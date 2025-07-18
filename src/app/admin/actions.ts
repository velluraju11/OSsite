
'use server';

import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SECRET_KEY = 'a-super-secret-key-that-is-long-enough-for-hs256';

// WARNING: Hardcoding credentials is not recommended for production.
// This is a temporary workaround for environment variable issues.
const ADMIN_USERNAME = 'velluraju@ryha.in';
const ADMIN_PASSWORD = 'Velluking@0192';

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = { user: { username } };
    const token = sign(session, SECRET_KEY, { expiresIn: '1h' });
    
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return { success: true, error: '' };
  }

  return { error: 'Invalid username or password.', success: false };
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/admin/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
  try {
    const session = verify(sessionCookie, SECRET_KEY);
    return session;
  } catch (error) {
    console.error('Invalid session:', error);
    return null;
  }
}
