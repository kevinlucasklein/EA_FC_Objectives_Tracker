import { Request, Response } from 'express';
import { pool } from '../db';

export const getObjectiveGroups = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM ObjectiveGroups');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching objective groups:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addObjectiveGroup = async (req: Request, res: Response) => {
    const { typeID, name, startTime, expirationTime } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ObjectiveGroups (TypeID, Name, StartTime, ExpirationTime) VALUES ($1, $2, $3, $4) RETURNING *',
            [typeID, name, startTime, expirationTime]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding objective group:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateObjectiveGroup = async (req: Request, res: Response) => {
    const { groupID, typeID, name, startTime, expirationTime } = req.body;
    try {
        const result = await pool.query(
            'UPDATE ObjectiveGroups SET TypeID = $1, Name = $2, StartTime = $3, ExpirationTime = $4 WHERE GroupID = $5 RETURNING *',
            [typeID, name, startTime, expirationTime, groupID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating objective group:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteObjectiveGroup = async (req: Request, res: Response) => {
    const { groupID } = req.params;
    try {
        await pool.query('DELETE FROM ObjectiveGroups WHERE GroupID = $1', [groupID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting objective group:', error);
        res.status(500).json({ error: 'Server error' });
    }
};