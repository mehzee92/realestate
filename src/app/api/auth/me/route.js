import { verify } from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });

    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, email, first_name, last_name, role FROM users WHERE id = ?', [decoded.userId]);
    connection.release();

    if (users.length === 0) {
      return NextResponse.json({ isAuthenticated: false }, { status: 404 });
    }

    return NextResponse.json({ isAuthenticated: true, user: users[0] });
  } catch (err) {
    console.error('Me route error:', err);
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }
}
