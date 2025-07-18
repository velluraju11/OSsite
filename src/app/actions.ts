
'use server';

import { z } from 'zod';
import { selectFeatureHighlights, type SelectFeatureHighlightsOutput } from '@/ai/flows/feature-highlight-selection';

const ContactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  captcha: z.string().refine(val => val === '8', { message: 'Incorrect captcha answer.' }),
});

export async function submitInterestForm(prevState: any, formData: FormData) {
  const validatedFields = ContactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
    captcha: formData.get('captcha'),
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
  console.log('Name:', validatedFields.data.name);
  console.log('Email:', validatedFields.data.email);
  console.log('Message:', validatedFields.data.message);

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
