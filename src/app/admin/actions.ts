'use server';

import { getSubmissions, Submission } from '@/lib/db';

export async function fetchSubmissions(): Promise<Submission[]> {
    return getSubmissions();
}
