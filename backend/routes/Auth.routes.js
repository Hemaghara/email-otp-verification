import express from 'express';
import { Register, VerifyEmail } from '../controllers/Auth.js';

const AuthRoutes = express.Router();

AuthRoutes.post('/register', Register);
AuthRoutes.post('/verifyEmail', VerifyEmail);

export default AuthRoutes;