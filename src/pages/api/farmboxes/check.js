import sql from '../farmboxes/db';
import { getSessionToken } from '../auth/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 1. Verify session token
    const session = await getSessionToken(req.cookies);
    
    if (!session?.id) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // 2. Fetch complete user data from database
    const users = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        address,
        city,
        country,
        postalcode,
        verified,
        created_at,
        updated_at,
        area
      FROM customers
      WHERE id = ${session.id}
    `;

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const user = users[0];

    // 3. Fetch detailed orders related to the logged-in user
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
      WHERE o.customer_id = ${session.id}
      ORDER BY o.date DESC
    `;

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await sql`
          SELECT 
            f.id as farmbox_id,
            f.name as farmbox_name,
            oi.quantity, 
            oi.price
          FROM order_items oi
          JOIN farmboxes f ON oi.farmbox_id = f.id
          WHERE oi.order_id = ${order.id}
        `;
        return {
          ...order,
          order_items: items.map(item => ({
            product: {
              id: item.farmbox_id,
              name: item.farmbox_name
            },
            quantity: item.quantity,
            price: item.price
          })),
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

    // 4. Fetch cart items for the customer
    const cartItems = await sql`
      SELECT 
        ci.id,
        ci.quantity,
        ci.price,
        ci.frequency,
        ci.created_at,
        ci.updated_at,
        f.id as box_id,
        f.name as box_name
      FROM cart_items ci
      JOIN farmboxes f ON ci.box_id = f.id
      WHERE ci.customer_id = ${session.id}
    `;

    const cart = {
      customer_id: session.id,
      items: cartItems.map(item => ({
        id: item.id,
        product: {
          id: item.box_id,
          name: item.box_name
        },
        quantity: item.quantity,
        price: item.price,
        frequency: item.frequency,
        created_at: item.created_at,
        updated_at: item.updated_at
      }))
    };

   // 5. Return the user data along with their orders and cart



   return res.status(200).json({ 
     user: {
       id: user.id,
       name: user.name,
       email: user.email,
       phone: user.phone,
       address: user.address,
       city: user.city,
       country: user.country,
       postalCode: user.postalcode,
       area: user.area,
       verified: user.verified,
       createdAt: user.created_at,
       updatedAt: user.updated_at
     },
     orders: ordersWithItems,
     cart,
   });

  } catch (error) {
    console.error('User data fetch error:', error);
    return res.status(500).json({ message: 'Internal server error', details: error.message });
  }
}