import sql from '../farmboxes/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, boxId, quantity, frequency, price } = req.body;

    // ✅ Sanitize the price (remove ₹ or any non-numeric characters except dot)
    const cleanPrice = parseFloat(price.toString().replace(/[^0-9.]/g, ''));

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id, quantity FROM cart_items 
      WHERE customer_id = ${userId} AND box_id = ${boxId} AND frequency = ${frequency}
    `;

    if (existingItem.length > 0) {
      // Update quantity if already exists
      await sql`
        UPDATE cart_items 
        SET 
          quantity = ${existingItem[0].quantity + quantity},
          updated_at = NOW()
        WHERE id = ${existingItem[0].id}
      `;
    } else {
      // Add new item to cart
      await sql`
        INSERT INTO cart_items (
          customer_id,
          box_id,
          quantity,
          frequency,
          price,
          created_at,
          updated_at
        ) VALUES (
          ${userId},
          ${boxId},
          ${quantity},
          ${frequency},
          ${cleanPrice},
          NOW(),
          NOW()
        )
      `;
    }

    return res.status(200).json({
      message: 'Item added to cart successfully'
    });

  } catch (error) {
    console.error('Cart operation error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
}
