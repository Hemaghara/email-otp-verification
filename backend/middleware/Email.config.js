import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('SMTP_USER:', process.env.SMTP_USER ? '***' : 'NOT SET');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' : 'NOT SET');

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error('SMTP_USER and SMTP_PASS must be set in .env');
}

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error('SMTP connection failed:', error.message);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});