
'use server';

import { z } from 'zod';
import { Submission, ContactFormSchema } from '@/lib/db';
import { auth } from 'firebase-admin';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

const EmailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});


export async function sendVerificationLinkAction(prevState: any, formData: FormData) {
  const validatedFields = EmailSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid email address.',
    };
  }
  
  const email = validatedFields.data.email;

  try {
    getFirebaseAdminApp();
    
    const actionCodeSettings = {
      url: `${process.env.NEXT_PUBLIC_URL}?email=${encodeURIComponent(email)}`,
      handleCodeInApp: true,
    };

    await auth().generateSignInWithEmailLink(email, actionCodeSettings);

    return {
      success: true,
      message: 'A verification link has been sent to your email. Please check your inbox.',
    };
  } catch (error: any) {
    console.error('Firebase Error:', error.message);
    return { error: 'Could not send verification link. Please try again later.' };
  }
}


export async function submitInterestForm(prevState: any, formData: FormData) {
  const validatedFields = ContactFormSchema.safeParse({
    fullName: formData.get('fullName'),
    username: formData.get('username'),
    email: formData.get('email'),
    mobile: formData.get('mobile'),
    designation: formData.get('designation'),
    otherDesignation: formData.get('otherDesignation') || null, // Ensure it's null if empty
    features: formData.get('features'),
    reason: formData.get('reason'),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please correct the errors below.',
      reset: false,
    };
  }
  
  try {
    const submissionData = validatedFields.data;
    
    const { isUsernameTaken, error: usernameError } = await Submission.isUsernameTaken(submissionData.username);
    if(usernameError) throw new Error(usernameError);
    if(isUsernameTaken) {
      return {
        errors: { username: ['This username is already taken.'] },
        message: 'Please choose a different username.',
        reset: false,
      };
    }

    const { error } = await Submission.create(submissionData);

    if (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Thank you for your interest! We have received your message and you are now on the waitlist.',
      errors: {},
      reset: true,
    };
  } catch (error: any) {
    console.error('Submission Error:', error);
    return {
      message: error.message || 'An unexpected error occurred. Please try again.',
      errors: {},
      reset: false,
    }
  }
}
