
'use server';

import { Submission } from '@/lib/db';

export async function isUsernameTaken(username: string): Promise<boolean> {
    if (!username) return false;
    const { isUsernameTaken } = await Submission.isUsernameTaken(username);
    return isUsernameTaken;
}

export async function isEmailTaken(email: string): Promise<boolean> {
    if (!email) return false;
    const { isEmailTaken } = await Submission.isEmailTaken(email);
    return isEmailTaken;
}

export async function isMobileTaken(mobile: string): Promise<boolean> {
    if (!mobile) return false;
    const { isMobileTaken } = await Submission.isMobileTaken(mobile);
    return isMobileTaken;
}
