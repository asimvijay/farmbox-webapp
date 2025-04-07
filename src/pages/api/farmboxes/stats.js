import sql from './db';

export default async function handler(req, res) {
  try {
    const stats = await sql`SELECT * FROM stats`;
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}