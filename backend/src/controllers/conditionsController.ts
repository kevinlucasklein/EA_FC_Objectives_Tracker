import { Request, Response } from 'express';
import { pool } from '../db';

export const getConditions = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Conditions');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching conditions:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addCondition = async (req: Request, res: Response) => {
    const { requirementID, type, value } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Conditions (RequirementID, Type, Value) VALUES ($1, $2, $3) RETURNING *',
            [requirementID, type, value]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding condition:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateCondition = async (req: Request, res: Response) => {
    const { conditionID, requirementID, type, value } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Conditions SET RequirementID = $1, Type = $2, Value = $3 WHERE ConditionID = $4 RETURNING *',
            [requirementID, type, value, conditionID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating condition:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteCondition = async (req: Request, res: Response) => {
    const { conditionID } = req.params;
    try {
        await pool.query('DELETE FROM Conditions WHERE ConditionID = $1', [conditionID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting condition:', error);
        res.status(500).json({ error: 'Server error' });
    }
};