
'use server';

import { z } from 'zod';
import { selectFeatureHighlights, type SelectFeatureHighlightsOutput } from '@/ai/flows/feature-highlight-selection';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const ContactFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50, { message: 'Name must be 50 characters or less.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  mobile: z.string().regex(phoneRegex, 'Invalid mobile number.').optional().or(z.literal('')),
  designation: z.string({ required_error: 'Please select a designation.'}),
});

export async function submitInterestForm(prevState: any, formData: FormData) {
  const validatedFields = ContactFormSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    mobile: formData.get('mobile'),
    designation: formData.get('designation'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      reset: false,
    };
  }
  
  // Simulate saving to Google Drive
  console.log('New Interest Form Submission:');
  console.log('Full Name:', validatedFields.data.fullName);
  console.log('Email:', validatedFields.data.email);
  console.log('Mobile:', validatedFields.data.mobile);
  console.log('Designation:', validatedFields.data.designation);

  // Here you would add the logic to send an OTP and verify it.
  // For now, we'll just simulate a successful submission.

  return {
    message: 'Thank you for your interest! We have received your message.',
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
