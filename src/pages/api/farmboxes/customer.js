import sql from './db';

export default async function handler(req, res) {
  try {
    const customers = await sql`
      SELECT * FROM customers
    `;
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}
