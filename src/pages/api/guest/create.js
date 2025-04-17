import sql from '../farmboxes/db'; // Adjust path to your DB connection
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    // Format and validate phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+92${phone.slice(1)}`;
    if (formattedPhone !== '+923240251086') {
      return res.status(403).json({ message: 'Direct creation not allowed for this number' });
    }

    // Get the next customer ID
    const lastCustomer = await sql`
      SELECT id FROM customers 
      WHERE id LIKE 'CUST-%' 
      ORDER BY id DESC 
      LIMIT 1
    `;

    let nextId = 'CUST-001';
    if (lastCustomer.length > 0) {
      const lastNumber = parseInt(lastCustomer[0].id.split('-')[1], 10);
      nextId = `CUST-${String(lastNumber + 1).padStart(3, '0')}`;
    }

    // Generate email and password
    const email = `${nextId}@crop2x.com`;
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert guest customer into database
    const [newGuest] = await sql`
      INSERT INTO customers (
        id,
        name,
        email,
        phone,
        password,
        user_type,
        verified,
        total_orders,
        total_spent
      ) VALUES (
        ${nextId},
        ${name},
        ${email},
        ${formattedPhone},
        ${hashedPassword},
        'guest',
        FALSE,
        0,
        0
      ) RETURNING id, name, email, phone, user_type, verified
    `;

    return res.status(200).json({
      user: {
        id: newGuest.id,
        name: newGuest.name,
        phone: newGuest.phone,
        email: newGuest.email,
        user_type: newGuest.user_type,
        verified: newGuest.verified,
      },
      password, // Send plain password to client for display
      message: 'Guest user created successfully',
    });
  } catch (error) {
    console.error('Guest creation error:', error);
    return res.status(500).json({
      message: 'Failed to create guest user',
      error: error.message,
    });
  }
}