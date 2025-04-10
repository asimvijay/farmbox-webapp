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
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // 3. Fetch orders related to the logged-in user
    const orders = await sql`
      SELECT 
        o.id AS order_id,
        o.amount,
        o.status,
        o.date
      FROM orders o
      WHERE o.customer_id = ${session.id}
      ORDER BY o.date DESC
    `;

    // 4. Return the user data along with their orders
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
      orders: orders // Include the user's orders here
    });

  } catch (error) {
    console.error('User data fetch error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
