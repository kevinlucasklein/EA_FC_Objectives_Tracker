import { Request, Response } from 'express';
import { pool } from '../db';

export const getRewards = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Rewards ORDER BY RewardID');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createReward = async (req: Request, res: Response) => {
    const { type, value, description, rarity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Rewards (Type, Value, Description, Rarity) VALUES ($1, $2, $3, $4) RETURNING *',
            [type, value, description, rarity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating reward:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};