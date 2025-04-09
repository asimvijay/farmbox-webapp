// pages/api/user/update-profile.js
import sql from '../farmboxes/db';
import { getSessionToken } from './auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSessionToken(req.cookies);

    if (!session || !session.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { phone, address, city, country, postalCode, area } = req.body;

    // Update all provided fields
    const updatedUser = await sql`
      UPDATE customers
      SET 
        phone = COALESCE(${phone}, phone),
        address = COALESCE(${address}, address),
        city = COALESCE(${city}, city),
        country = COALESCE(${country}, country),
        postalcode = COALESCE(${postalCode}, postalcode),
        area = COALESCE(${area}, area),
        updated_at = NOW()
      WHERE id = ${session.id}
      RETURNING *
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = updatedUser[0];
    return res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        phone: user.phone,
        address: user.address,
        city: user.city,
        country: user.country,
        postalCode: user.postal_code,
        area: user.area
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}