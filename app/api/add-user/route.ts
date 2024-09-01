import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
//import crypto from 'crypto';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(request: Request) {
    try {

      const { email } = await request.json();
  

      const role = 'user';
      //const token = crypto.randomBytes(20).toString('hex');
  

      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
      });
  
      const sql = 'INSERT INTO utilisateurs (courriel, role) VALUES (?, ?)'; //token
      await connection.execute(sql, [email, role]); //token
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Bienvenue',
        text: `Vous avez été ajouté en tant qu'utilisateur. Veuillez créer votre mot de passe ici: http://localhost:3000/login` ///login/${token}
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erreur lors de l\'envoi de l\'email:', error);
          return NextResponse.json({ success: false, message: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
        }
        console.log('Email envoyé: ' + info.response);
      });

      await connection.end();

      return NextResponse.json({ success: true, message: 'Utilisateur ajouté et e-mail envoyé' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      return NextResponse.json({ success: false, message: 'Une erreur est survenue' }, { status: 500 });
    }
  }