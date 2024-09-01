import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'reconnexion necessaire' });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute<any[]>(
      'SELECT prenom FROM utilisateurs WHERE courriel = ?',
      [email]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    const user = rows[0];
    return NextResponse.json({ success: true, firstName: user.prenom });
  } catch (error) {
    console.error('Error retrieving user details:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}
