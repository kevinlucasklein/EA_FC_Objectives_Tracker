import { Pool } from 'pg';
import dotenv from 'dotenv';

// Automatically load environment variables from .env file
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
};

export const pool = new Pool(dbConfig);

// Test the connection
(async () => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log('Database connection successful:', result.rows[0]);
    } finally {
      client.release();
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error acquiring client or executing query', err.stack);
    } else {
      console.error('Unexpected error', err);
    }
  }
})();