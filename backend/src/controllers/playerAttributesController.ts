import { Request, Response } from 'express';
import { pool } from '../db';

export const getPlayerAttributes = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM PlayerAttributes ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching player attributes:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addPlayerAttribute = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO PlayerAttributes (Name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding player attribute:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updatePlayerAttribute = async (req: Request, res: Response) => {
    const { attributeID, name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE PlayerAttributes SET Name = $1 WHERE AttributeID = $2 RETURNING *',
            [name, attributeID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating player attribute:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deletePlayerAttribute = async (req: Request, res: Response) => {
    const { attributeID } = req.params;
    try {
        await pool.query('DELETE FROM PlayerAttributes WHERE AttributeID = $1', [attributeID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting player attribute:', error);
        res.status(500).json({ error: 'Server error' });
    }
};