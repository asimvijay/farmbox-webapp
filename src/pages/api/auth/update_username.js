// pages/api/user/update-username.js
import sql from '../farmboxes/db';
import { getSessionToken } from './auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSessionToken(req.cookies);

    if (!session?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { newUsername } = req.body;

    // Validate username
    if (!newUsername || typeof newUsername !== 'string') {
      return res.status(400).json({ message: 'Valid username is required' });
    }

    // Check minimum length
    if (newUsername.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    // Check maximum length
    if (newUsername.length > 30) {
      return res.status(400).json({ message: 'Username cannot exceed 30 characters' });
    }

    // Check if username is already taken (case-insensitive)
    const existingUser = await sql`
      SELECT id FROM customers 
      WHERE LOWER(name) = LOWER(${newUsername}) 
      AND id != ${session.id}
    `;

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Update username and return the updated user data
    const updatedUser = await sql`
      UPDATE customers 
      SET 
        name = ${newUsername},
        updated_at = NOW()
      WHERE id = ${session.id}
      RETURNING id, name, email, phone, address, city, country, postalcode, verified, created_at
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = updatedUser[0];
    return res.status(200).json({ 
      message: 'Username updated successfully',
      user: {
        id: user.id,
        username: user.name,  // Note: Using 'name' as username
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
        postalCode: user.postal_code,
        verified: user.verified,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Update username error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}