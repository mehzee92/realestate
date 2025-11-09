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

export async function POST(request, { params }) {
  const { id } = params;
  const { favorited } = await request.json();

  const userId = await getUserIdFromSession(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const connection = await pool.getConnection();
    if (favorited) {
      await connection.query('INSERT INTO user_favorites (user_id, property_id) VALUES (?, ?)', [userId, id]);
    } else {
      await connection.query('DELETE FROM user_favorites WHERE user_id = ? AND property_id = ?', [userId, id]);
    }
    connection.release();
    return NextResponse.json({ success: true, favorited });
  } catch (error) {
    console.error('Favorite error:', error);
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json({ success: true, favorited });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
