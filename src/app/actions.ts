
'use server';

import { z } from 'zod';
import { selectFeatureHighlights, type SelectFeatureHighlightsOutput } from '@/ai/flows/feature-highlight-selection';
import { addSubmission, ContactFormSchema } from '@/lib/db';
import { saveToGoogleDrive } from '@/lib/drive';

const EmailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

export async function sendOtpAction(prevState: any, formData: FormData) {
  const validatedFields = EmailSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid email address.',
    };
  }
  
  // Simulate sending OTP
  console.log('OTP requested for:', validatedFields.data.email);
  
  return {
    success: true,
    message: 'A verification code has been sent to your email.',
  };
}


export async function submitInterestForm(prevState: any, formData: FormData) {
  const validatedFields = ContactFormSchema.safeParse({
    fullName: formData.get('fullName'),
    username: formData.get('username'),
    email: formData.get('email'),
    mobile: formData.get('mobile'),
    designation: formData.get('designation'),
    otherDesignation: formData.get('otherDesignation'),
    features: formData.get('features'),
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      reset: false,
    };
  }
  
  try {
    // Save to our in-memory DB
    const submission = await addSubmission(validatedFields.data);

    // Save to Google Drive
    await saveToGoogleDrive(submission);

    return {
      message: 'Thank you for your interest! We have received your message and you are now on the waitlist.',
      errors: {},
      reset: true,
    };
  } catch (error) {
    console.error('Submission Error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: {},
      reset: false,
    }
  }
}
