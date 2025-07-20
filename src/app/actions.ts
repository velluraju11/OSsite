
'use server';

import { z } from 'zod';
import { Submission, ContactFormSchema } from '@/lib/db';

const forbiddenUsernames = ['narmatha', 'narmata', 'narmadha', 'narmada'];

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
    
    // Forbidden name checks
    if (forbiddenUsernames.some(name => submissionData.fullName.toLowerCase().includes(name))) {
      return {
        errors: { fullName: ['This name is not permitted.'] },
        message: 'A forbidden name was used in the Full Name field.',
        reset: false,
      };
    }
     if (forbiddenUsernames.some(name => submissionData.email.toLowerCase().includes(name))) {
      return {
        errors: { email: ['This name is not permitted in the email.'] },
        message: 'A forbidden name was used in the Email field.',
        reset: false,
      };
    }
    if (forbiddenUsernames.some(name => submissionData.username.toLowerCase().includes(name))) {
      return {
        errors: { username: ['This username is not permitted.'] },
        message: 'A forbidden name was used in the Username field.',
        reset: false,
      };
    }


    const { isUsernameTaken, error: usernameError } = await Submission.isUsernameTaken(submissionData.username);
    if(usernameError) throw new Error(usernameError);
    if(isUsernameTaken) {
      return {
        errors: { username: ['This username is already taken.'] },
        message: 'Please choose a different username.',
        reset: false,
      };
    }

    const { isEmailTaken, error: emailError } = await Submission.isEmailTaken(submissionData.email);
    if (emailError) throw new Error(emailError);
    if (isEmailTaken) {
      return {
        errors: { email: ['This email address has already been submitted.'] },
        message: 'Please use a different email address.',
        reset: false,
      };
    }

    const { isMobileTaken, error: mobileError } = await Submission.isMobileTaken(submissionData.mobile);
    if (mobileError) throw new Error(mobileError);
    if (isMobileTaken) {
      return {
        errors: { mobile: ['This mobile number has already been submitted.'] },
        message: 'Please use a different mobile number.',
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
