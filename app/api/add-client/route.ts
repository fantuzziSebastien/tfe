import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';


/* const createConnection = async () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};
 */

export async function POST(request: Request) {
    try {

      const { name, location } = await request.json();
  
      if (!name || !location) {
        return NextResponse.json({ success: false, message: 'Name and location are required' }, { status: 400 });
      }
  
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
  

      const sql = 'INSERT INTO clients (denomination, ville) VALUES (?, ?)';
      await connection.execute(sql, [name, location]);
  
      await connection.end();
  
      return NextResponse.json({ success: true, message: 'Client added' });
    } catch (error) {
      console.error('Error adding client:', error);
      return NextResponse.json({ success: false, message: 'An error occurred' }, { status: 500 });
    }
  }
