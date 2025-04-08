import { getLoginSession } from './auth';
import sql from './db';

export default async function handler(req, res) {
  try {
    const session = await getLoginSession(req);

    if (!session || !session.email) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const users = await sql`
      SELECT * FROM customers WHERE email = ${session.email}
    `;

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      postalCode: user.postal_code,
      verified: user.verified,
      createdAt: user.created_at,
      avatar: user.avatar_url,
      referralCount: user.referral_count,
      activeReferrals: user.active_referrals
    });

  } catch (error) {
    console.error('User fetch error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
