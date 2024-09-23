import { Request, Response } from 'express';
import { handleQuery } from '../utils/dbUtils';

export const getRewards = async (req: Request, res: Response) => {
    const result = await handleQuery(res, 'SELECT * FROM Rewards ORDER BY RewardID');
    if (result) res.json(result);
};

export const createReward = async (req: Request, res: Response) => {
    const { type, value, description, rarity } = req.body;
    const query = 'INSERT INTO Rewards (Type, Value, Description, Rarity) VALUES ($1, $2, $3, $4) RETURNING *';
    const params = [type, value, description, rarity];
    const result = await handleQuery(res, query, params);
    if (result) res.status(201).json(result[0]);
};