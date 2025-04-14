// /pages/api/farmboxes/createbox.js
import sql from './db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, description, price, products, image, category, isFeatured, deliveryFrequency, boxType, maxQuantity } = req.body;

  // Validate required fields
  if (!name || !description || !price || !products || !category || !deliveryFrequency || !boxType || maxQuantity == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: 'At least one product is required' });
  }

  try {
    await sql.begin(async (sql) => {
      // Handle featured box stock adjustments
      if (boxType === 'featured') {
        // Check for existing farmbox
        const existingBoxes = await sql`
          SELECT id, products, maxQuantity
          FROM farmboxes
          WHERE name = ${name} AND boxType = 'featured'
          LIMIT 1
        `;

        if (existingBoxes.length > 0) {
          const existingBox = existingBoxes[0];
          const existingProducts = existingBox.products;

          // Restore stock for existing products
          for (const product of existingProducts) {
            await sql`
              UPDATE products
              SET stock = stock + ${product.quantity * existingBox.maxQuantity}
              WHERE id = ${product.productId}
            `;
          }

          // Delete the existing farmbox
          await sql`
            DELETE FROM farmboxes
            WHERE id = ${existingBox.id}
          `;
        }
      }

      // Validate and deduct stock for new products
      for (const product of products) {
        const [productRecord] = await sql`
          SELECT stock
          FROM products
          WHERE id = ${product.productId}
        `;

        if (!productRecord) {
          throw new Error(`Product with ID ${product.productId} not found`);
        }

        const requiredStock = product.quantity * maxQuantity;
        if (productRecord.stock < requiredStock) {
          throw new Error(`Insufficient stock for ${product.name}: ${productRecord.stock}kg available, ${requiredStock}kg needed`);
        }

        // Deduct stock
        await sql`
          UPDATE products
          SET stock = stock - ${requiredStock}
          WHERE id = ${product.productId}
        `;
      }

      // Insert the new farmbox
      const [newFarmbox] = await sql`
        INSERT INTO farmboxes (
          name, description, price, products, image, category, isFeatured, deliveryFrequency, boxType, maxQuantity
        )
        VALUES (
          ${name}, ${description}, ${price}, ${JSON.stringify(products)}::jsonb, ${image}, ${category}, 
          ${isFeatured}, ${deliveryFrequency}, ${boxType}, ${maxQuantity}
        )
        RETURNING id
      `;

      return newFarmbox;
    }).then(newFarmbox => {
      res.status(200).json({ message: 'Farmbox created successfully', id: newFarmbox.id });
    });
  } catch (error) {
    console.error('Database error:', error);
    if (error.message.includes('unique constraint')) {
      return res.status(400).json({ error: 'Farmbox name already exists' });
    }
    res.status(500).json({ error: error.message || 'Failed to create farmbox' });
  }
}