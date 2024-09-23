import { Request, Response } from 'express';
import { handleQuery } from '../utils/dbUtils';

export const createObjective = async (req: Request, res: Response) => {
    const { name, description, groupId, rewardId } = req.body;
    const query = 'INSERT INTO Objectives (Name, Description, GroupID, RewardID) VALUES ($1, $2, $3, $4) RETURNING *';
    const params = [name, description, groupId, rewardId];
    const result = await handleQuery(res, query, params);
    if (result) res.status(201).json(result[0]);
};

export const getObjectives = async (req: Request, res: Response) => {
    const result = await handleQuery(res, 'SELECT * FROM Objectives');
    if (result) res.json(result);
};