import { Request, Response } from 'express';
import { pool } from '../db';

export const getTeams = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Teams ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addTeam = async (req: Request, res: Response) => {
    const { name, leagueID } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Teams (Name, LeagueID) VALUES ($1, $2) RETURNING *',
            [name, leagueID]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding team:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    const { teamID, name, leagueID } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Teams SET Name = $1, LeagueID = $2 WHERE TeamID = $3 RETURNING *',
            [name, leagueID, teamID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating team:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteTeam = async (req: Request, res: Response) => {
    const { teamID } = req.params;
    try {
        await pool.query('DELETE FROM Teams WHERE TeamID = $1', [teamID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
