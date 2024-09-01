import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  const url = new URL(request.url);
  const sort = url.searchParams.get('sort') || 'recent';

  let sql = 'SELECT * FROM prestations WHERE id_utilisateur = ?';
  if (sort === 'recent') {
    sql += ' ORDER BY date DESC';
  } else {
    sql += ' ORDER BY date ASC';
  }

  try {

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [results] = await connection.execute<any[]>(sql, [userId]);

    await connection.end();

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching prestations:', error);
    return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
  }
}
