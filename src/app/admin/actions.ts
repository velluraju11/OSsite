
'use server';

import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.AUTH_SECRET;

if (!SECRET_KEY) {
  throw new Error('AUTH_SECRET environment variable is not set.');
}

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // This is a temporary check for debugging.
  // In a real app, you would compare against hashed passwords from a database.
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const session = { user: { username } };
    const token = sign(session, SECRET_KEY, { expiresIn: '1h' });
    
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return { success: true, error: null };
  } else {
    return { success: false, error: 'Invalid credentials. Please try again.' };
  }
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/admin/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  try {
    const session = verify(sessionCookie, SECRET_KEY) as { user: { username: string } };
    return session;
  } catch (error) {
    // This will handle expired or invalid tokens
    console.error('Invalid session:', error);
    return null;
  }
}
