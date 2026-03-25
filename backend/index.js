import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/Auth.routes.js';
import DbCon from './libs/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

DbCon();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', AuthRoutes);

app.listen(PORT, () => {
  console.log(`App is running on Port ${PORT}`);
});