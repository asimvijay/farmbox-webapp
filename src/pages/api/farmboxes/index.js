// /pages/api/farmboxes/index.js
import sql from './db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const farmboxes = await sql`SELECT * FROM farmboxes`;
      res.status(200).json(farmboxes);

    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch farmboxes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

