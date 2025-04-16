import sql from '../farmboxes/db';

// Utility function to validate Pakistani phone numbers
function validatePhone(phone) {
  const phoneRegex = /^(\+92)(3\d{2})(\d{7})$/;
  return phoneRegex.test(phone);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { guestId, phone, address, city, postalCode } = req.body;

    console.log('Received update request:', { guestId, phone, address, city, postalCode });

    // Check if all required fields are provided
    const missingFields = [];
    if (!guestId) missingFields.push('guestId');
    if (!phone) missingFields.push('phone');
    if (!address) missingFields.push('address');
    if (!city) missingFields.push('city');
    if (!postalCode) missingFields.push('postalCode');

    if (missingFields.length > 0) {
      console.log('Missing fields:', missingFields);
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields 
      });
    }

    // Validate phone number format
    if (!validatePhone(phone)) {
      console.log('Invalid phone number:', phone);
      return res.status(400).json({ message: 'Please try again with a valid Pakistani number' });
    }

    // Check for duplicate phone numbers
    const existingPhone = await sql`
      SELECT id FROM customers WHERE phone = ${phone} AND id != ${guestId}
    `;
    if (existingPhone.length > 0) {
      console.log('Duplicate phone number:', phone);
      return res.status(400).json({ message: 'Phone number already in use' });
    }

    // Update guest information in the database
    const updatedGuest = await sql`
      UPDATE customers 
      SET 
        phone = ${phone},
        address = ${address},
        city = ${city},
        postalcode = ${postalCode},
        updated_at = NOW()
      WHERE id = ${guestId}
      RETURNING id, name, email, phone, address, city, postalcode, user_type
    `;

    // If no rows are updated, return an error message
    if (updatedGuest.length === 0) {
      console.log('No guest found with ID:', guestId);
      return res.status(404).json({ message: 'Guest user not found' });
    }

    console.log('Guest updated successfully:', updatedGuest[0]);
    return res.status(200).json({
      user: updatedGuest[0],
      message: 'Guest information updated successfully'
    });

  } catch (error) {
    console.error('Guest update error:', error);
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Phone number already in use' });
    }
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
}