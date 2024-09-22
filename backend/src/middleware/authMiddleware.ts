import { Request, Response, NextFunction } from 'express';
import { pool } from '../db';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || !user.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const result = await pool.query('SELECT IsAdmin FROM Users WHERE UserID = $1', [user.id]);
    if (result.rows.length > 0 && result.rows[0].isadmin) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ error: 'Server error during admin check' });
  }
};