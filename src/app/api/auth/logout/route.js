import { NextResponse } from 'next/server';

export async function POST(req) {
  const response = NextResponse.json({ message: 'Logout successful' });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: -1, // Expire the cookie
    path: '/',
  });
  return response;
}
