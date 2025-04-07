import sql from './db';

export default async function handler(req, res) {
  try {
    const orders = await sql`
      SELECT 
        o.id,
        o.amount,
        o.status,
        o.date,
        c.id as customer_id,
        c.name as customer_name,
        c.email as customer_email,
        c.phone as customer_phone,
        c.address as customer_address
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.date DESC
      LIMIT 10
    `;

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await sql`
          SELECT 
            product_name, 
            quantity, 
            price
          FROM order_items
          WHERE order_id = ${order.id}
        `;
        return {
          ...order,
          items,
          customer: {
            id: order.customer_id,
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone,
            address: order.customer_address
          }
        };
      })
    );

    res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
}