import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/user';

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (user: User) => jwt.sign(
  { id: user.userid, username: user.username, isAdmin: user.isadmin },
  JWT_SECRET,
  { expiresIn: '1d' }
);

export const handleError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ error: 'Server error' });
};