import { getSessionToken } from './auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSessionToken(req.cookies);
    
    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    return res.status(200).json({ 
      user: {
        id: session.id,
        name: session.name,
        email: session.email
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}