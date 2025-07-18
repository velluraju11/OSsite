import { z } from 'zod';

// Mock database of existing usernames and submissions
// In a real app, this would be a database.
let submissions: Submission[] = [];
let existingUsernames: string[] = ['ryha', 'admin', 'testuser', 'ada'];
let lastId = 0;


const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const ContactFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50, { message: 'Name must be 50 characters or less.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }).max(20, { message: 'Username must be 20 characters or less.' }).regex(/^[a-zA-Z0-9]+$/, { message: 'Username can only contain letters and numbers.' }).refine(username => !existingUsernames.includes(username.toLowerCase()), { message: 'This username is already taken.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  mobile: z.string().regex(phoneRegex, 'Invalid mobile number.'),
  designation: z.string({ required_error: 'Please select a designation.'}),
  otherDesignation: z.string().optional(),
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

export type Submission = z.infer<typeof ContactFormSchema> & { id: number };

export async function addSubmission(data: z.infer<typeof ContactFormSchema>): Promise<Submission> {
  const newSubmission: Submission = {
    id: ++lastId,
    ...data,
  };
  submissions.push(newSubmission);
  existingUsernames.push(data.username.toLowerCase());
  console.log("New submission added:", newSubmission);
  console.log("All submissions:", submissions);
  return newSubmission;
}

export async function getSubmissions(): Promise<Submission[]> {
  // Return a copy to prevent mutation
  return [...submissions];
}

export async function isUsernameTaken(username: string): Promise<boolean> {
    return existingUsernames.includes(username.toLowerCase());
}
