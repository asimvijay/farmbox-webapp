// /pages/api/farmboxes/adjust-stocks.js
import sql from './db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { boxId, newProducts, oldProducts } = req.body;

    try {
      await sql.begin(async (sql) => {
        // Restore stock for old products
        for (const oldProduct of oldProducts) {
          const productId = oldProduct.productId;
          const quantity = oldProduct.quantity;
          await sql`
            UPDATE products
            SET stock = stock + ${quantity}
            WHERE id = ${productId}
          `;
        }

        // Deduct stock for new products
        for (const newProduct of newProducts) {
          const productId = newProduct.productId;
          const quantity = newProduct.quantity;
          const product = await sql`
            SELECT stock FROM products WHERE id = ${productId}
          `;
          if (!product.length || product[0].stock < quantity) {
            throw new Error(`Insufficient stock for product ID ${productId}`);
          }
          await sql`
            UPDATE products
            SET stock = stock - ${quantity}
            WHERE id = ${productId}
          `;
        }
      });

      res.status(200).json({ message: 'Stocks adjusted successfully' });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: error.message || 'Failed to adjust product stocks' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}