import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  const { firstName, lastName, email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const [existingUsers] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUsers.length > 0) {
      connection.release();
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)', 
      [email, hashedPassword, firstName, lastName, 'user']
    );
    const userId = result.insertId;
    connection.release();

    const token = sign({ userId, email, firstName, lastName, role: 'user' }, SECRET_KEY, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({ message: 'User created successfully' }, { status: 201 });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
