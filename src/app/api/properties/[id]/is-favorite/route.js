import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verify } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

async function getUserIdFromSession(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const decoded = await new Promise((resolve, reject) => {
      verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      });
    });
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(request, { params }) {
  const { id } = params;

  const userId = await getUserIdFromSession(request);
  if (!userId) {
    return NextResponse.json({ isFavorited: false }, { status: 200 });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT * FROM user_favorites WHERE user_id = ? AND property_id = ?',
      [userId, id]
    );
    connection.release();

    const isFavorited = rows.length > 0;
    return NextResponse.json({ isFavorited });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json({ isFavorited: false }, { status: 500 });
  }
}
