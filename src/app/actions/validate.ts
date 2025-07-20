
'use server';

import { Submission } from '@/lib/db';

const forbiddenUsernames = ['narmatha', 'narmata', 'narmadha', 'narmada'];

export async function isUsernameTaken(username: string): Promise<boolean> {
    if (!username) return false;
    
    // Check if the username contains any of the forbidden substrings.
    const isForbidden = forbiddenUsernames.some(name => username.toLowerCase().includes(name));
    if (isForbidden) {
        return true;
    }

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
