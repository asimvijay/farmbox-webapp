import sql from './db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await sql`
      SELECT id FROM customers WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate customer ID (you might want to use a better ID generation strategy)
    const customerId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;

    // Insert new customer
    const newCustomer = await sql`
      INSERT INTO customers (
        id,
        name,
        email,
        password,
        phone,
        address,
        total_orders,
        total_spent
      ) VALUES (
        ${customerId},
        ${`${firstName} ${lastName}`},
        ${email},
        ${hashedPassword},
        NULL,
        NULL,
        0,
        0
      ) RETURNING id, name, email
    `;

    return res.status(201).json({
      message: 'User created successfully',
      user: newCustomer[0]
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}