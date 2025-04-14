// /pages/api/farmboxes/update/[id].js
import sql from './db';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const {
      name,
      description,
      price,
      products,
      image,
      category,
      isFeatured,
      deliveryFrequency,
      boxType,
      maxQuantity
    } = req.body;

    try {
      const existingBox = await sql`
        SELECT * FROM farmboxes WHERE id = ${id}
      `;
      if (!existingBox.length) {
        return res.status(404).json({ error: 'Farmbox not found' });
      }

      const result = await sql`
        UPDATE farmboxes
        SET
          name = ${name},
          description = ${description},
          price = ${price},
          products = ${JSON.stringify(products)}::jsonb,
          image = ${image},
          category = ${category},
          isFeatured = ${isFeatured},
          deliveryFrequency = ${deliveryFrequency},
          boxType = ${boxType},
          maxQuantity = ${maxQuantity}
        WHERE id = ${id}
        RETURNING *
      `;

      if (!result.length) {
        return res.status(500).json({ error: 'Failed to update farmbox' });
      }

      res.status(200).json(result[0]);
    } catch (error) {
      console.error('Database error:', error);
      if (error.message.includes('unique constraint')) {
        return res.status(400).json({ error: 'Farmbox name already exists' });
      }
      res.status(500).json({ error: 'Failed to update farmbox' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}