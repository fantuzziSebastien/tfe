import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  try {

    const { email, password } = await request.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute<any[]>(
      'SELECT password, role FROM utilisateurs WHERE courriel = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' });
    }

    const user = rows[0] as { password: string; role: string };

    if (password === user.password) {
      return NextResponse.json({ success: true, message: 'Login successful', role: user.role });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error verifying user:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}