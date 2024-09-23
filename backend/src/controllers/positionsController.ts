import { Request, Response } from 'express';
import { pool } from '../db';

export const getPositions = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Positions ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching positions:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addPosition = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Positions (Name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding position:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updatePosition = async (req: Request, res: Response) => {
    const { positionID, name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Positions SET Name = $1 WHERE PositionID = $2 RETURNING *',
            [name, positionID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating position:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deletePosition = async (req: Request, res: Response) => {
    const { positionID } = req.params;
    try {
        await pool.query('DELETE FROM Positions WHERE PositionID = $1', [positionID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting position:', error);
        res.status(500).json({ error: 'Server error' });
    }
};