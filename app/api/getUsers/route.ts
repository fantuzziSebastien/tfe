import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute<any[]>(
      'SELECT courriel, id FROM utilisateurs'
    );

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}
