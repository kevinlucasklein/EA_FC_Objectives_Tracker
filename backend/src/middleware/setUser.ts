import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET as string;

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number, username: string, isAdmin: boolean };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

const fetchUserById = async (id: number) => {
  try {
    const result = await pool.query('SELECT UserID, Username, Email, GamingPlatform, IsAdmin FROM Users WHERE UserID = $1', [id]);
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const setUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  const decoded = verifyToken(token);
  if (!decoded) return next();

  const user = await fetchUserById(decoded.id);
  if (user && user.isAdmin === decoded.isAdmin) {
    (req as any).user = {
      id: user.id,
      username: user.username,
      email: user.email,
      platform: user.platform,
      isAdmin: user.isAdmin
    };
  }

  next();
};