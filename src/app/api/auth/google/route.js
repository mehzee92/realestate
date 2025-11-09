import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  const { id_token } = await request.json();

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, given_name, family_name, picture } = payload;
    
    // Extract first and last name from the name or given_name/family_name
    let firstName = given_name || '';
    let lastName = family_name || '';
    
    if (!firstName && name) {
      const nameParts = name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    if (!email) {
      return NextResponse.json({ message: 'Google account must have an email' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    let [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    let user = users[0];

    if (!user) {
      // User does not exist, register them
      const hashedPassword = await bcrypt.hash(email + Date.now(), 10); // Generate a dummy password
      const [result] = await connection.query(
        'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, 'user']
      );
      user = { id: result.insertId, email, first_name: firstName, last_name: lastName, role: 'user' };
    }

    connection.release();

    const token = sign({ 
      userId: user.id, 
      email: user.email, 
      firstName: user.first_name || firstName, 
      lastName: user.last_name || lastName,
      role: user.role 
    }, JWT_SECRET, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: name || email, picture: picture || null } });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
  }
}
