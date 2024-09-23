import { Request, Response } from 'express';
import { pool } from '../db';

export const getPlayerAttributeRatings = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT par.*, p.Name as PlayerName, pa.Name as AttributeName 
            FROM PlayerAttributeRatings par
            JOIN Players p ON par.PlayerID = p.PlayerID
            JOIN PlayerAttributes pa ON par.AttributeID = pa.AttributeID
            ORDER BY p.Name, pa.Name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching player attribute ratings:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addPlayerAttributeRating = async (req: Request, res: Response) => {
    const { playerID, attributeID, value } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO PlayerAttributeRatings (PlayerID, AttributeID, Value) VALUES ($1, $2, $3) RETURNING *',
            [playerID, attributeID, value]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding player attribute rating:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updatePlayerAttributeRating = async (req: Request, res: Response) => {
    const { ratingID, playerID, attributeID, value } = req.body;
    try {
        const result = await pool.query(
            'UPDATE PlayerAttributeRatings SET PlayerID = $1, AttributeID = $2, Value = $3 WHERE RatingID = $4 RETURNING *',
            [playerID, attributeID, value, ratingID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating player attribute rating:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deletePlayerAttributeRating = async (req: Request, res: Response) => {
    const { ratingID } = req.params;
    try {
        await pool.query('DELETE FROM PlayerAttributeRatings WHERE RatingID = $1', [ratingID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting player attribute rating:', error);
        res.status(500).json({ error: 'Server error' });
    }
};