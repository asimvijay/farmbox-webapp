import sql from '../farmboxes/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { phone, otp, name } = req.body;

    if (!phone || !otp || !name) {
      return res.status(400).json({ message: 'Phone, OTP, and name are required' });
    }

    // Verify OTP
    const otpRecord = await sql`
      SELECT * FROM otp_verifications 
      WHERE phone = ${phone} AND otp = ${otp} AND expiry > NOW()
    `;

    if (otpRecord.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
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

    // Generate a random 8-character password
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new guest customer
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
        ${`${nextId}@crop2x.com`},
        ${phone},
        ${hashedPassword},
        'guest',
        TRUE, -- Set verified to TRUE since OTP was validated
        0,
        0
      ) RETURNING id, name, email, phone, user_type, verified
    `;

    // Delete used OTP
    await sql`DELETE FROM otp_verifications WHERE phone = ${phone}`;

    return res.status(201).json({
      user: {
        id: newGuest.id,
        name: newGuest.name,
        email: newGuest.email,
        phone: newGuest.phone,
        user_type: newGuest.user_type,
        verified: newGuest.verified,
      },
      password,
      message: 'Guest user created successfully',
    });
  } catch (error) {
    console.error('Guest creation error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}