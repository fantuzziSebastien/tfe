import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email manquant.' });
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [user] = await connection.execute<any[]>(
      'SELECT id FROM utilisateurs WHERE courriel = ?',
      [email]
    );

    if (user.length === 0) {
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé.' });
    }

    const userId = user[0].id;

    const [rows] = await connection.execute<any[]>(
      'SELECT id, remarque, date FROM prestations WHERE id_utilisateur = ?',
      [userId]
    );

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des prestations:', error);
    return NextResponse.json({ success: false, message: 'Une erreur est survenue.' });
  }
}
