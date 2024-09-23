import { Request, Response } from 'express';
import { pool } from '../db';

export const getAcceleRATETypes = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM AcceleRATETypes ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching AcceleRATE types:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addAcceleRATEType = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO AcceleRATETypes (Name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding AcceleRATE type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateAcceleRATEType = async (req: Request, res: Response) => {
    const { acceleRATEID, name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE AcceleRATETypes SET Name = $1 WHERE AcceleRATEID = $2 RETURNING *',
            [name, acceleRATEID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating AcceleRATE type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteAcceleRATEType = async (req: Request, res: Response) => {
    const { acceleRATEID } = req.params;
    try {
        await pool.query('DELETE FROM AcceleRATETypes WHERE AcceleRATEID = $1', [acceleRATEID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting AcceleRATE type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};