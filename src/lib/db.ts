
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

// Schema for database interaction and form validation
const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const ContactFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50, { message: 'Name must be 50 characters or less.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(20, { message: 'Username must be 20 characters or less.' }).regex(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  mobile: z.string().regex(phoneRegex, 'Invalid mobile number.'),
  designation: z.string({ required_error: 'Please select a designation.'}),
  otherDesignation: z.string().nullable(),
  features: z.string().min(1, { message: 'Please tell us what features you want.'}),
  reason: z.string().min(1, { message: 'Please tell us why you want Ryha OS.'}),
}).refine(data => {
  if (data.designation === 'other' && (!data.otherDesignation || data.otherDesignation.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Please specify your designation.',
  path: ['otherDesignation'],
});

export type Submission = z.infer<typeof ContactFormSchema> & { id: number; created_at: string; };
type SubmissionInput = z.infer<typeof ContactFormSchema>;

const NO_SUPABASE_ERROR = "Supabase is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.";


// A Submission class to encapsulate database logic
export class Submission {
  static async create(data: SubmissionInput): Promise<{ submission: Submission | null, error: any }> {
    const supabase = createClient();
    if (!supabase) return { submission: null, error: { message: NO_SUPABASE_ERROR } };

    const { data: submission, error } = await supabase
      .from('submissions')
      .insert([data])
      .select()
      .single();

    return { submission, error };
  }

  static async getAll(): Promise<{ submissions: Submission[], error: string | null }> {
    const supabase = createClient();
    if (!supabase) return { submissions: [], error: NO_SUPABASE_ERROR };

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase error fetching submissions:", error);
        return { submissions: [], error: "Could not fetch submissions. Please check your Supabase connection and ensure the 'submissions' table exists." };
    }
    
    return { submissions: data || [], error: null };
  }

  static async isUsernameTaken(username: string): Promise<{ isUsernameTaken: boolean, error: string | null }> {
    const supabase = createClient();
    if (!supabase) return { isUsernameTaken: false, error: NO_SUPABASE_ERROR };
    
    const { data, error } = await supabase
        .from('submissions')
        .select('id')
        .eq('username', username)
        .maybeSingle();

    if (error) {
        console.error("Supabase error checking username:", error);
        return { isUsernameTaken: false, error: "Could not verify username." };
    }

    return { isUsernameTaken: !!data, error: null };
  }
}
