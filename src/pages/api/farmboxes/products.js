import sql from './db';

export default async function handler(req, res) {
  try {
    const products = await sql
    `
      SELECT * FROM products
      ORDER BY stock DESC
  
    `;
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}