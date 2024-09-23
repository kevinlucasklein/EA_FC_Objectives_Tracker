import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fetchUser } from '../utils/dbUtils';
import { generateToken, handleError, JWT_SECRET } from '../utils/authUtils';

const PEPPER = process.env.PASSWORD_PEPPER;
const SALT_ROUNDS = 12;

export const register = async (req: Request, res: Response) => {
  const { username, email, password, platform } = req.body;

  try {
    const userCheck = await fetchUser('SELECT * FROM Users WHERE Username = $1 OR Email = $2', [username, email]);
    if (userCheck) return res.status(400).json({ error: 'Username or email already exists' });

    const hashedPassword = await bcrypt.hash(password + PEPPER, SALT_ROUNDS);
    const newUser = await fetchUser(
      'INSERT INTO Users (Username, PasswordHash, Email, GamingPlatform) VALUES ($1, $2, $3, $4) RETURNING UserID, Username, Email, GamingPlatform, IsAdmin',
      [username, hashedPassword, email, platform]
    );

    res.status(201).json({ user: newUser, token: generateToken(newUser) });
  } catch (error) {
    handleError(res, error, 'Registration error:');
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await fetchUser('SELECT * FROM Users WHERE Username = $1', [username]);
    if (!user || !(await bcrypt.compare(password + PEPPER, user.passwordhash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { passwordhash, ...userWithoutPassword } = user;
    res.json({ user: { ...userWithoutPassword, isAdmin: user.isadmin }, token: generateToken(user) });
  } catch (error) {
    handleError(res, error, 'Login error:');
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    console.log('Validating token:', token);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number, username: string, isAdmin: boolean };
    console.log('Token decoded:', decoded);
    const user = await fetchUser('SELECT UserID, Username, Email, GamingPlatform, IsAdmin FROM Users WHERE UserID = $1', [decoded.id]);
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ 
      user: { userid: user.userid, username: user.username, email: user.email, gamingplatform: user.gamingplatform, isadmin: user.isadmin },
      token: generateToken(user)
    });
  } catch (error) {
    console.error('Token validation error:', error);
    handleError(res, error, 'Token validation error:');
  }
};