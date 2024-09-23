import { Request, Response } from 'express';
import { pool } from '../db';

export const getObjectiveTypes = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM ObjectiveTypes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching objective types:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addObjectiveType = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ObjectiveTypes (Name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding objective type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateObjectiveType = async (req: Request, res: Response) => {
    const { typeid, name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE ObjectiveTypes SET Name = $1 WHERE TypeID = $2 RETURNING *',
            [name, typeid]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating objective type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteObjectiveType = async (req: Request, res: Response) => {
    const { typeID } = req.params;
    try {
        await pool.query('DELETE FROM ObjectiveTypes WHERE TypeID = $1', [typeID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting objective type:', error);
        res.status(500).json({ error: 'Server error' });
    }
};