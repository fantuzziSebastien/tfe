import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  try {
    const { email, description, date } = await request.json();

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
      return NextResponse.json({ success: false, message: 'Utilisateur non trouvé' });
    }

    const userId = user[0].id;

    await connection.execute(
      'INSERT INTO prestations (id_utilisateur, remarque, date) VALUES (?, ?, ?)',
      [userId, description, date]
    );

    await connection.end();

    return NextResponse.json({ success: true, message: 'Prestation créée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la création de la prestation:', error);
    return NextResponse.json({ success: false, message: 'Une erreur est survenue.' });
  }
}
