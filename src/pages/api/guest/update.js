import sql from '../farmboxes/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { guestId, phone, address, city, postalCode, country = 'Pakistan', area } = req.body;

    if (!guestId || !phone || !address || !city || !postalCode) {
      return res.status(400).json({
        message: 'Guest ID, phone, address, city, and postal code are required',
      });
    }

    // Update customer in the database
    const [updatedCustomer] = await sql`
      UPDATE customers
      SET
        address = ${address},
        city = ${city},
        postalcode = ${postalCode},
        country = ${country},
        area = ${area || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${guestId} AND phone = ${phone}
      RETURNING id, name, email, phone, address, city, postalcode, country, area, user_type, verified
    `;

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.status(200).json({
      user: updatedCustomer,
      message: 'Guest information updated successfully',
    });
  } catch (error) {
    console.error('Guest update error:', error);
    return res.status(500).json({
      message: 'Failed to update guest information',
      error: error.message,
    });
  }
}