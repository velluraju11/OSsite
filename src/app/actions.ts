
'use server';
require('dotenv').config({ path: './.env.local' });

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
    
    // Firebase requires a valid, authorized URL to build the verification link.
    // This URL must be added to your Firebase project's "Authorized Domains".
    // We construct it from an environment variable for flexibility.
    const continueUrl = process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}` : 'http://localhost:9002';
    
    const actionCodeSettings = {
      url: continueUrl,
      handleCodeInApp: true,
    };
    
    await auth().generateSignInWithEmailLink(email, actionCodeSettings);

    return {
      success: true,
      message: 'A verification link has been sent to your email. Please check your inbox.',
    };
  } catch (error: any) {
    console.error('Firebase Error:', error);
    if (error.code === 'auth/invalid-action-code-setting' || error.message.includes('domain is not authorized')) {
        return { error: 'Configuration error: The domain of the link is not authorized. Please add it to the authorized domains in your Firebase Authentication settings.' };
    }
    if (error.message?.includes('Firebase Admin SDK credentials are not set up')) {
        return { error: 'Configuration error: Firebase Admin SDK credentials are not set up on the server. Please check your .env.local file.' };
    }
     if (error.message?.includes('Could not initialize Firebase Admin SDK')) {
        return { error: 'Configuration error: Could not initialize Firebase Admin SDK. Please check your credentials in .env.local.' };
    }
    return { error: 'Could not send verification link. Please ensure Email link sign-in is enabled in your Firebase project and that your server has the correct permissions.' };
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
      throw new Error(error);
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
