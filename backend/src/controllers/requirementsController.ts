import { Request, Response } from 'express';
import { pool } from '../db';

export const getRequirements = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Requirements');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching requirements:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addRequirement = async (req: Request, res: Response) => {
    const { objectiveID, type, value } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Requirements (ObjectiveID, Type, Value) VALUES ($1, $2, $3) RETURNING *',
            [objectiveID, type, value]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding requirement:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateRequirement = async (req: Request, res: Response) => {
    const { requirementID, objectiveID, type, value } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Requirements SET ObjectiveID = $1, Type = $2, Value = $3 WHERE RequirementID = $4 RETURNING *',
            [objectiveID, type, value, requirementID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating requirement:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteRequirement = async (req: Request, res: Response) => {
    const { requirementID } = req.params;
    try {
        await pool.query('DELETE FROM Requirements WHERE RequirementID = $1', [requirementID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting requirement:', error);
        res.status(500).json({ error: 'Server error' });
    }
};