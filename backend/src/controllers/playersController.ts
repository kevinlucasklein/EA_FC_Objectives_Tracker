import { Request, Response } from 'express';
import { pool } from '../db';

export const getPlayers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT p.*, 
                   t.Name as TeamName, 
                   c.Name as NationName, 
                   l.Name as LeagueName,
                   pos.Name as PositionName,
                   f.Name as FootName,
                   a.Name as AcceleRATEName,
                   b.Name as BodyTypeName
            FROM Players p
            LEFT JOIN Teams t ON p.TeamID = t.TeamID
            LEFT JOIN Countries c ON p.NationID = c.CountryID
            LEFT JOIN Leagues l ON p.LeagueID = l.LeagueID
            LEFT JOIN Positions pos ON p.PositionID = pos.PositionID
            LEFT JOIN Feet f ON p.FootID = f.FootID
            LEFT JOIN AcceleRATETypes a ON p.AcceleRATEID = a.AcceleRATEID
            LEFT JOIN BodyTypes b ON p.BodyTypeID = b.BodyTypeID
            ORDER BY p.Name
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addPlayer = async (req: Request, res: Response) => {
    const { name, teamID, nationID, leagueID, positionID, footID, skillMoves, weakFoot, acceleRATEID, height, weight, bodyTypeID, age, rating } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Players (Name, TeamID, NationID, LeagueID, PositionID, FootID, SkillMoves, WeakFoot, AcceleRATEID, Height, Weight, BodyTypeID, Age, Rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
            [name, teamID, nationID, leagueID, positionID, footID, skillMoves, weakFoot, acceleRATEID, height, weight, bodyTypeID, age, rating]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding player:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updatePlayer = async (req: Request, res: Response) => {
    const { playerID, name, teamID, nationID, leagueID, positionID, footID, skillMoves, weakFoot, acceleRATEID, height, weight, bodyTypeID, age, rating } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Players SET Name = $1, TeamID = $2, NationID = $3, LeagueID = $4, PositionID = $5, FootID = $6, SkillMoves = $7, WeakFoot = $8, AcceleRATEID = $9, Height = $10, Weight = $11, BodyTypeID = $12, Age = $13, Rating = $14 WHERE PlayerID = $15 RETURNING *',
            [name, teamID, nationID, leagueID, positionID, footID, skillMoves, weakFoot, acceleRATEID, height, weight, bodyTypeID, age, rating, playerID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deletePlayer = async (req: Request, res: Response) => {
    const { playerID } = req.params;
    try {
        await pool.query('DELETE FROM Players WHERE PlayerID = $1', [playerID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ error: 'Server error' });
    }
};