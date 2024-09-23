import { Request, Response } from 'express';
import { pool } from '../db';

export const getFeet = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Feet ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching feet:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addFoot = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Feet (Name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding foot:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateFoot = async (req: Request, res: Response) => {
    const { footID, name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Feet SET Name = $1 WHERE FootID = $2 RETURNING *',
            [name, footID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating foot:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteFoot = async (req: Request, res: Response) => {
    const { footID } = req.params;
    try {
        await pool.query('DELETE FROM Feet WHERE FootID = $1', [footID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting foot:', error);
        res.status(500).json({ error: 'Server error' });
    }
};