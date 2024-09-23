import { Response } from 'express';
import { pool } from '../db';

export const handleQuery = async (res: Response, query: string, params: any[] = []) => {
    try {
        const result = await pool.query(query, params);
        return result.rows;
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const fetchUser = async (query: string, params: any[]) => {
    const result = await pool.query(query, params);
    return result.rows[0];
};