import { Request, Response } from 'express';
import { pool } from '../db';

export const getObjectives = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Objectives');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching objectives:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addObjective = async (req: Request, res: Response) => {
    const { groupID, name, description, rewardID } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Objectives (GroupID, Name, Description, RewardID) VALUES ($1, $2, $3, $4) RETURNING *',
            [groupID, name, description, rewardID]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding objective:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateObjective = async (req: Request, res: Response) => {
    const { objectiveID, groupID, name, description, rewardID } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Objectives SET GroupID = $1, Name = $2, Description = $3, RewardID = $4 WHERE ObjectiveID = $5 RETURNING *',
            [groupID, name, description, rewardID, objectiveID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating objective:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteObjective = async (req: Request, res: Response) => {
    const { objectiveID } = req.params;
    try {
        await pool.query('DELETE FROM Objectives WHERE ObjectiveID = $1', [objectiveID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting objective:', error);
        res.status(500).json({ error: 'Server error' });
    }
};