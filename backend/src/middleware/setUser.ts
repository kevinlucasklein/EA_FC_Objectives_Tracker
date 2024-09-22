import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { User } from '../types/user';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const setUser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number, username: string, isAdmin: boolean };
    const result = await pool.query('SELECT UserID, Username, Email, GamingPlatform, IsAdmin FROM Users WHERE UserID = $1', [decoded.id]);
    
    if (result.rows.length > 0) {
      const user: User = result.rows[0];
      if (user.isAdmin === decoded.isAdmin) {
        (req as any).user = {
          id: user.id,
          username: user.username,
          email: user.email,
          platform: user.platform,
          isAdmin: user.isAdmin
        };
      }
    }
  } catch (error) {
    console.error('Error setting user:', error);
  }

  next();
};