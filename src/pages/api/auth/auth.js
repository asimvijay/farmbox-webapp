import { serialize } from 'cookie';
import bcrypt from 'bcryptjs';

const TOKEN_NAME = 'farmbox_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export async function setLoginSession(res, session) {
  const token = await createSessionToken(session);

  const cookie = serialize(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  });

  res.setHeader('Set-Cookie', cookie);
}

async function createSessionToken(session) {
  const tokenContent = {
    ...session,
    createdAt: Date.now()
  };
  return Buffer.from(JSON.stringify(tokenContent)).toString('base64');
}

export function getSessionToken(cookies) {
  const token = cookies[TOKEN_NAME];
  if (!token) return null;
  
  try {
    const session = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
    return session;
  } catch (error) {
    return null;
  }
}

export function clearSession(res) {
  const cookie = serialize(TOKEN_NAME, '', {
    maxAge: -1,
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
}