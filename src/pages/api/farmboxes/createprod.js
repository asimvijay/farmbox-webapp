// /pages/api/products/create.js
import sql from './db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, category, price, stock, image } = req.body;

    try {
      await sql`
        INSERT INTO products (name, category, price, stock, image)
        VALUES (${name}, ${category}, ${price},  ${stock}, ${image})
      `;
      res.status(200).json({ message: 'Product created successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
