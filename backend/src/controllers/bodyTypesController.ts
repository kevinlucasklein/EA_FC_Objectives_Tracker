import { Request, Response } from 'express';
import { pool } from '../db';

export const getBodyTypes = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM BodyTypes ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching body types:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addBodyType = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO BodyTypes (Name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding body type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateBodyType = async (req: Request, res: Response) => {
    const { bodyTypeID, name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE BodyTypes SET Name = $1 WHERE BodyTypeID = $2 RETURNING *',
            [name, bodyTypeID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating body type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteBodyType = async (req: Request, res: Response) => {
    const { bodyTypeID } = req.params;
    try {
        await pool.query('DELETE FROM BodyTypes WHERE BodyTypeID = $1', [bodyTypeID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting body type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};