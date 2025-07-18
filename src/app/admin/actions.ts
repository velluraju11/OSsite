
'use server';

import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SECRET_KEY = process.env.AUTH_SECRET;

if (!SECRET_KEY) {
  throw new Error('AUTH_SECRET environment variable is not set. Please add it to your .env file.');
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // IMPORTANT: In a real app, use a secure password hashing library like bcrypt
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // Create the session
    const session = { user: { username } };
    const token = sign(session, SECRET_KEY, { expiresIn: '1h' });
    
    // Set the session cookie
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    
    // Redirect to the dashboard on successful login
    redirect('/admin/dashboard');

  } else {
    // Redirect back to the login page with an error message
    redirect('/admin/login?error=Invalid credentials. Please try again.');
  }
}

export async function logout() {
  // Clear the session cookie
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/admin/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie) return null;

  try {
    // Verify the token
    const session = verify(sessionCookie, SECRET_KEY) as { user: { username: string }, iat: number, exp: number };
    return session;
  } catch (error) {
    // This will handle expired or invalid tokens
    console.error('Invalid session:', error);
    return null;
  }
}
