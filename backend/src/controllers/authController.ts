import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { User } from '../types/user'; 

const PEPPER = process.env.PASSWORD_PEPPER;
const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req: Request, res: Response) => {
  const { username, email, password, platform } = req.body;

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM Users WHERE Username = $1 OR Email = $2', [username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password with pepper
    const pepperedPassword = password + PEPPER;
    const hashedPassword = await bcrypt.hash(pepperedPassword, SALT_ROUNDS);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO Users (Username, PasswordHash, Email, GamingPlatform) VALUES ($1, $2, $3, $4) RETURNING UserID, Username, Email, GamingPlatform, IsAdmin',
      [username, hashedPassword, email, platform]
    );

    const newUser = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.userid, username: newUser.username, isAdmin: newUser.isadmin },
      JWT_SECRET as string,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM Users WHERE Username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const pepperedPassword = password + PEPPER;
    const isPasswordValid = await bcrypt.compare(pepperedPassword, user.passwordhash);

    if (isPasswordValid) {
      const { passwordhash, ...userWithoutPassword } = user;
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.userid, username: user.username, isAdmin: user.isadmin },
        JWT_SECRET as string,
        { expiresIn: '1d' } // Token expires in 1 day
      );

      res.json({ user: { ...userWithoutPassword, isAdmin: user.isadmin }, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;
  
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET as string) as { id: number, username: string, isAdmin: boolean };
      
      // Fetch user from database to ensure they still exist and their status hasn't changed
      const result = await pool.query('SELECT UserID, Username, Email, GamingPlatform, IsAdmin FROM Users WHERE UserID = $1', [decoded.id]);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const user = result.rows[0];
      
      // Instead of returning an error, update the token with the current admin status
      const updatedToken = jwt.sign(
        { id: user.userid, username: user.username, isAdmin: user.isadmin },
        JWT_SECRET as string,
        { expiresIn: '1d' }
      );
  
      // Return user information and the updated token
      res.json({ 
        user: {
          id: user.userid,
          username: user.username,
          email: user.email,
          platform: user.gamingplatform,
          isAdmin: user.isadmin
        },
        token: updatedToken
      });
    } catch (error) {
      console.error('Token validation error:', error);
      res.status(401).json({ error: 'Invalid token' });
    }
  };