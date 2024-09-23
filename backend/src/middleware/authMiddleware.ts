import { Request, Response, NextFunction } from 'express';
import { pool } from '../db';

const handleUnauthorized = (res: Response) => res.status(401).json({ error: 'Unauthorized' });
const handleForbidden = (res: Response) => res.status(403).json({ error: 'Forbidden: Admin access required' });
const handleServerError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ error: 'Server error' });
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  user ? next() : handleUnauthorized(res);
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || !user.id) return handleUnauthorized(res);

  try {
    const result = await pool.query('SELECT IsAdmin FROM Users WHERE UserID = $1', [user.id]);
    result.rows.length > 0 && result.rows[0].isadmin ? next() : handleForbidden(res);
  } catch (error) {
    handleServerError(res, error, 'Error checking admin status:');
  }
};