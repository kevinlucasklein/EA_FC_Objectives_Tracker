import { Request, Response } from 'express';
import { pool } from '../db';

export const createObjective = async (req: Request, res: Response) => {
  const { name, description, groupId, rewardId } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Objectives (Name, Description, GroupID, RewardID) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, groupId, rewardId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating objective:', error);
    res.status(500).json({ error: 'Server error during objective creation' });
  }
};

export const getObjectives = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM Objectives');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    res.status(500).json({ error: 'Server error while fetching objectives' });
  }
};