import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      connection.release();
      // Still return a success message to prevent email enumeration
      return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    }

    const user = users[0];

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await connection.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetToken, tokenExpiry, user.id]
    );

    connection.release();

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;

    // In a real application, you would send an email here.
    // For this example, we'll log the link to the console.


    return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' });

  } catch (error) {
    console.error('Request password reset error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
