
'use server';

import { z } from 'zod';
import { selectFeatureHighlights, type SelectFeatureHighlightsOutput } from '@/ai/flows/feature-highlight-selection';
import { addSubmission, ContactFormSchema } from '@/lib/db';

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
  
  // Save to our in-memory DB
  await addSubmission(validatedFields.data);


  return {
    message: 'Thank you for your interest! We have received your message and you are now on the waitlist.',
    errors: {},
    reset: true,
  };
}

export async function getAiHighlights(userInput: string, engagementLevel: 'low' | 'medium' | 'high'): Promise<SelectFeatureHighlightsOutput> {
  try {
    if (!userInput.trim()) {
      return [];
    }
    const highlights = await selectFeatureHighlights({
      userInput,
      engagementLevel,
    });
    return highlights;
  } catch (error) {
    console.error("Error fetching AI highlights:", error);
    // In a real app, you might want to return a more user-friendly error
    return [];
  }
}

