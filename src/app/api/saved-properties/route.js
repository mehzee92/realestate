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

export async function GET(request) {
  const userId = await getUserIdFromSession(request);
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const connection = await pool.getConnection();
    const [favoritePropertyIds] = await connection.query(
      'SELECT property_id FROM user_favorites WHERE user_id = ?',
      [userId]
    );

    if (favoritePropertyIds.length === 0) {
      connection.release();
      return NextResponse.json({ properties: [] });
    }

    const propertyIds = favoritePropertyIds.map(row => row.property_id);
    
    // Fetch actual property details using the /api/properties endpoint
    const propertiesApiUrl = `${request.nextUrl.origin}/api/properties?propertyIds=${propertyIds.join(',')}`;
    const propertiesRes = await fetch(propertiesApiUrl, {
        headers: {
            'Authorization': request.headers.get('Authorization') || '',
            'Cookie': request.headers.get('Cookie') || '',
        },
    });

    if (!propertiesRes.ok) {
        console.error('Failed to fetch property details from /api/properties', propertiesRes.status);
        connection.release();
        return NextResponse.json({ message: 'Failed to retrieve property details' }, { status: 500 });
    }

    const propertiesData = await propertiesRes.json();
    const savedProperties = propertiesData.value || [];

    connection.release();
    return NextResponse.json({ properties: savedProperties });
  } catch (error) {
    console.error('Error fetching saved properties:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
