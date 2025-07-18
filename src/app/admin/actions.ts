'use server';

import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSubmissions, Submission } from '@/lib/db';

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
  throw new Error('AUTH_SECRET is not set in the environment variables.');
}

// Hardcoded credentials for simplicity
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password';

type SessionPayload = {
  username: string;
  expires: number;
};

export async function login(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return redirect('/admin/login?error=Invalid credentials');
  }

  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const session: SessionPayload = { username, expires };

  const token = sign(session, AUTH_SECRET);

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });

  redirect('/admin/dashboard');
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/admin/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) {
    return null;
  }
  try {
    const payload = verify(sessionCookie.value, AUTH_SECRET) as SessionPayload;
    if (Date.now() > payload.expires) {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

export async function fetchSubmissions(): Promise<Submission[]> {
    const session = await getSession();
    if (!session) {
        redirect('/admin/login');
    }
    return getSubmissions();
}
