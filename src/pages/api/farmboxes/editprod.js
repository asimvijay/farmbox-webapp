// /pages/api/farmboxes/editprod/index.js
import sql from './db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, name, category, price, stock, image } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
      await sql`
        UPDATE products
        SET name = ${name}, category = ${category}, price = ${price}, stock = ${stock}, image = ${image}
        WHERE id = ${id}
      `;

      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
