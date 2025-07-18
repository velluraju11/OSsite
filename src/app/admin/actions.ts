
'use server';

import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.AUTH_SECRET;

export async function login(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    if (!SECRET_KEY) {
        return { error: 'Authentication secret is not configured on the server.' };
    }
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
    return { success: false, error: 'Invalid username or password.' };
  }
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/admin/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;
   if (!SECRET_KEY) {
    console.error('AUTH_SECRET is not set. Cannot verify session.');
    return null;
  }
  try {
    const session = verify(sessionCookie, SECRET_KEY) as { user: { username: string } };
    return session;
  } catch (error) {
    console.error('Invalid session:', error);
    return null;
  }
}
