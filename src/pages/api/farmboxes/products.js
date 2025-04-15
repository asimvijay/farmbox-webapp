// /pages/api/farmboxes/products.js
import sql from './db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await sql`SELECT * FROM products`;
     
      res.status(200).json(products);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}