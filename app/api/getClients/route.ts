import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute<any[]>('SELECT * FROM clients');
    
    await connection.end();
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' });
  }
}
