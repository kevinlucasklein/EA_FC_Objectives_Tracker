import { Request, Response } from 'express';
import { pool } from '../db';

export const getRewards = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Rewards');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addReward = async (req: Request, res: Response) => {
    const { type, value, description, rarity } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Rewards (Type, Value, Description, Rarity) VALUES ($1, $2, $3, $4) RETURNING *',
            [type, value, description, rarity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding reward:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateReward = async (req: Request, res: Response) => {
    const { rewardID, type, value, description, rarity } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Rewards SET Type = $1, Value = $2, Description = $3, Rarity = $4 WHERE RewardID = $5 RETURNING *',
            [type, value, description, rarity, rewardID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating reward:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteReward = async (req: Request, res: Response) => {
    const { rewardID } = req.params;
    try {
        await pool.query('DELETE FROM Rewards WHERE RewardID = $1', [rewardID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting reward:', error);
        res.status(500).json({ error: 'Server error' });
    }
};