import { Request, Response } from 'express';
import { pool } from '../db';

export const getLeagues = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Leagues ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leagues:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addLeague = async (req: Request, res: Response) => {
    const { name, countryID } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Leagues (Name, CountryID) VALUES ($1, $2) RETURNING *',
            [name, countryID]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding league:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateLeague = async (req: Request, res: Response) => {
    const { leagueID, name, countryID } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Leagues SET Name = $1, CountryID = $2 WHERE LeagueID = $3 RETURNING *',
            [name, countryID, leagueID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating league:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteLeague = async (req: Request, res: Response) => {
    const { leagueID } = req.params;
    try {
        await pool.query('DELETE FROM Leagues WHERE LeagueID = $1', [leagueID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting league:', error);
        res.status(500).json({ error: 'Server error' });
    }
};