
'use server';

import { Submission } from '@/lib/db';

export async function fetchSubmissions(): Promise<{submissions: Submission[], error: string | null}> {
    return Submission.getAll();
}
