import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ message: 'Token and password are required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      connection.release();
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    const user = users[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    connection.release();

    return NextResponse.json({ message: 'Password has been reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
