import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthentificationCompte } from '../model/Compte.js';

dotenv.config();

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'];

if (!SECRET) throw new Error('JWT_SECRET is required in the environment');

const secret: string = SECRET;

export const signAccessToken = (user: AuthentificationCompte): string =>
  jwt.sign(user, secret, { expiresIn: EXPIRES_IN });

export const verifyAccessToken = (token: string): AuthentificationCompte => {
  const { id, email, role } = jwt.verify(token, secret) as AuthentificationCompte;
  return { id, email, role };
};