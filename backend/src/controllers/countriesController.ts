import { Request, Response } from 'express';
import { pool } from '../db';

export const getCountries = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM Countries ORDER BY Name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching countries:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const addCountry = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Countries (Name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding country:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateCountry = async (req: Request, res: Response) => {
    const { countryID, name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Countries SET Name = $1 WHERE CountryID = $2 RETURNING *',
            [name, countryID]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating country:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteCountry = async (req: Request, res: Response) => {
    const { countryID } = req.params;
    try {
        await pool.query('DELETE FROM Countries WHERE CountryID = $1', [countryID]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting country:', error);
        res.status(500).json({ error: 'Server error' });
    }
};