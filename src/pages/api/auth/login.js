import sql from '../farmboxes/db';
import bcrypt from 'bcryptjs';
import { setLoginSession } from './auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const users = await sql`
      SELECT * FROM customers WHERE email = ${email}
    `;

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create session
    await setLoginSession(res, {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}