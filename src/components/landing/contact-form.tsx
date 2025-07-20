
"use client";

import { useActionState, useEffect, useRef, useState, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast"
import { submitInterestForm } from '@/app/actions';
import { isUsernameTaken, isEmailTaken, isMobileTaken } from '@/app/actions/validate';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ShieldCheck, MailCheck, Send, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { getAuth, isSignInWithEmailLink, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { getFirebaseApp } from '@/lib/firebase';

const initialSubmitState = {
  message: '',
  errors: {},
  reset: false,
};

function SubmitButton({ isEmailVerified, isFormValid }: { isEmailVerified: boolean, isFormValid: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full text-lg py-6 glow-shadow" disabled={pending || !isEmailVerified || !isFormValid}>
      {pending ? <Loader2 className="animate-spin" /> : 'Join the Waitlist'}
    </Button>
  );
}

const FieldValidationStatus = ({ status, checkingText, takenText, availableText }: { status: 'idle' | 'checking' | 'taken' | 'available' | 'invalid', checkingText: string, takenText: string, availableText: string }) => {
    if (status === 'checking') {
        return <p className="text-sm text-muted-foreground mt-1 flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {checkingText}</p>;
    }
    if (status === 'taken') {
        return <p className="text-sm font-medium text-destructive mt-1 flex items-center"><XCircle className="w-4 h-4 mr-2" /> {takenText}</p>;
    }
    if (status === 'available') {
        return <p className="text-sm font-medium text-green-500 mt-1 flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> {availableText}</p>;
    }
    return null;
};

// Custom hook for debouncing
function useDebounce(callback: (...args: any[]) => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback((...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);
}

const forbiddenUsernames = ['narmatha', 'narmata', 'narmadha', 'narmada'];
const REASON_QUERY_TEXT = '[i want to know the reason behind that hated name]';

export function ContactForm() {
  const [submitState, submitFormAction, isSubmitPending] = useActionState(submitInterestForm, initialSubmitState);
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [showOtherDesignation, setShowOtherDesignation] = useState(false);
  
  // Email verification state
  const [emailForVerification, setEmailForVerification] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);

  // Field values
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [reason, setReason] = useState('');
  
  // Real-time validation state
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'taken' | 'available' | 'invalid'>('idle');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'taken' | 'available' | 'invalid'>('idle');
  const [mobileStatus, setMobileStatus] = useState<'idle' | 'checking' | 'taken' | 'available' | 'invalid'>('idle');
  
  // State for the special username reason feature
  const [showReasonCheckbox, setShowReasonCheckbox] = useState(false);
  const [reasonQueryChecked, setReasonQueryChecked] = useState(false);


  const debouncedCheckUsername = useDebounce(async (value: string) => {
    if (value.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    if (forbiddenUsernames.includes(value.toLowerCase())) {
        setUsernameStatus('taken');
        setShowReasonCheckbox(true);
        return;
    }
    setShowReasonCheckbox(false);
    setUsernameStatus('checking');
    const taken = await isUsernameTaken(value);
    setUsernameStatus(taken ? 'taken' : 'available');
  }, 500);

  const debouncedCheckEmail = useDebounce(async (value: string) => {
    if (!/^\S+@\S+\.\S+$/.test(value)) {
        setEmailStatus('idle');
        return;
    }
    if (value === emailForVerification && emailVerified) {
        setEmailStatus('available');
        return;
    }
    setEmailStatus('checking');
    const taken = await isEmailTaken(value);
    setEmailStatus(taken ? 'taken' : 'available');
  }, 500);

  const debouncedCheckMobile = useDebounce(async (value: string) => {
    if (value.length < 10) {
        setMobileStatus('idle');
        return;
    }
    setMobileStatus('checking');
    const taken = await isMobileTaken(value);
    setMobileStatus(taken ? 'taken' : 'available');
  }, 500);
  
  useEffect(() => {
    const app = getFirebaseApp();
    if (!app) {
      console.log("Firebase not configured");
      setIsVerifying(false);
      return;
    };
    
    const auth = getAuth(app);
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let savedEmail = window.localStorage.getItem('emailForSignIn');
      if (!savedEmail) {
         setEmailVerificationError('Your email could not be found to complete the verification. Please try sending the link again.');
         setIsVerifying(false);
         return;
      }
      signInWithEmailLink(auth, savedEmail, window.location.href)
        .then(() => {
          setEmailVerified(true);
          setEmail(savedEmail);
          setEmailForVerification(savedEmail);
          setEmailStatus('available');
          toast({
            title: "Verified",
            description: "Your email has been successfully verified.",
          });
           window.localStorage.removeItem('emailForSignIn');
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((error) => {
          setEmailVerificationError('Failed to verify email. The link may be invalid or expired.');
          console.error("Firebase sign-in error", error);
        }).finally(() => {
            setIsVerifying(false);
        });
    } else {
        setIsVerifying(false);
    }
  }, [toast]);


  useEffect(() => {
    if (isSubmitPending) return;
    if (!submitState.message) return;
    
    if (submitState.errors && Object.keys(submitState.errors).length > 0) {
      toast({
        title: "Error",
        description: submitState.message,
        variant: "destructive",
      });
    } else if (!submitState.reset) {
        toast({
          title: "Error",
          description: submitState.message,
          variant: "destructive",
       });
    }
     else {
      toast({
        title: "Success",
        description: submitState.message,
      });
      if (submitState.reset) {
          formRef.current?.reset();
          setShowOtherDesignation(false);
          setEmail('');
          setEmailForVerification('');
          setEmailSent(false);
          setEmailVerified(false);
          setUsername('');
          setMobile('');
          setReason('');
          setUsernameStatus('idle');
          setEmailStatus('idle');
          setMobileStatus('idle');
          setShowReasonCheckbox(false);
          setReasonQueryChecked(false);
      }
    }
  }, [submitState, isSubmitPending, toast]);
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setUsername(value);
    const regex = /^[a-z0-9]*$/;
    if (regex.test(value)) {
      setUsernameStatus('idle');
      debouncedCheckUsername(value);
    } else {
      setUsernameStatus('invalid');
      setShowReasonCheckbox(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setEmailStatus('idle');
    debouncedCheckEmail(value);
  }

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobile(value);
    setMobileStatus('idle');
    debouncedCheckMobile(value);
  }

  const handleSendVerificationEmail = async () => {
    setEmailVerificationError('');
    if (!email) {
      setEmailVerificationError('Please enter your email address.');
      return;
    }
    if (emailStatus === 'taken') {
      setEmailVerificationError('This email is already on the waitlist.');
      return;
    }
    
    const app = getFirebaseApp();
    if (!app) {
        setEmailVerificationError('Firebase is not configured correctly.');
        return;
    }

    setIsSendingEmail(true);
    const auth = getAuth(app);
    const actionCodeSettings = {
      url: window.location.href, // Use the current URL
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailForVerification(email);
      setEmailSent(true);
      toast({
        title: 'Verification link sent',
        description: 'A verification link has been sent to your email. Please check your inbox.',
      });
    } catch (error: any) {
        console.error("Firebase send link error:", error);
        if (error.code === 'auth/invalid-email') {
             setEmailVerificationError('The email address is not valid.');
        } else if (error.code === 'auth/missing-continue-uri') {
            setEmailVerificationError('Configuration error: A continue URL is missing.');
        }
        else {
             setEmailVerificationError('Could not send verification link. Please check the console for more details and ensure your Firebase project is configured correctly.');
        }
    } finally {
        setIsSendingEmail(false);
    }
  };

  const handleReasonQueryCheck = (checked: boolean | 'indeterminate') => {
    if (typeof checked !== 'boolean') return;
    setReasonQueryChecked(checked);
    if (checked) {
      // Append if not already there
      if (!reason.includes(REASON_QUERY_TEXT)) {
        setReason(prev => `${prev} ${REASON_QUERY_TEXT}`.trim());
      }
    } else {
      // Remove if it's there
      setReason(prev => prev.replace(REASON_QUERY_TEXT, '').trim());
    }
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReason = e.target.value;
    setReason(newReason);
    // If user manually removes the query text, uncheck the box
    if (reason.includes(REASON_QUERY_TEXT) && !newReason.includes(REASON_QUERY_TEXT)) {
      setReasonQueryChecked(false);
    }
  };
  
  const isUsernameForbidden = forbiddenUsernames.includes(username.toLowerCase());
  const isFormValid = usernameStatus === 'available' && emailStatus === 'available' && mobileStatus === 'available' && !isUsernameForbidden;


  if (isVerifying) {
    return (
        <section id="contact" className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6 flex justify-center">
                <Card className="max-w-xl mx-auto bg-card border-primary/20 shadow-2xl shadow-primary/10 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <p className="text-lg">Verifying your email...</p>
                    </div>
                </Card>
            </div>
        </section>
    )
  }

  return (
    <section id="contact" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-xl mx-auto bg-card border-primary/20 shadow-2xl shadow-primary/10 rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl tracking-tight">Get Early Access</CardTitle>
            <CardDescription>
              Be the first to know when Ryha OS is available. Join the waitlist for exclusive updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {submitState?.errors && Object.keys(submitState.errors).length > 0 && !isSubmitPending &&(
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  {submitState.message}
                </AlertDescription>
              </Alert>
            )}
            <form ref={formRef} action={submitFormAction} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="Enter your real name" required aria-describedby="fullName-error" />
                <div id="fullName-error" aria-live="polite">
                  {submitState.errors?.fullName && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.fullName[0]}</p>}
                </div>
              </div>
              
               <div>
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username" 
                  placeholder="Choose a unique username" 
                  required 
                  aria-describedby="username-error username-status" 
                  value={username}
                  onChange={handleUsernameChange}
                  className={cn( (submitState.errors?.username || usernameStatus === 'taken' || usernameStatus === 'invalid') && 'border-destructive focus-visible:ring-destructive')}
                />
                 <p className="text-sm text-muted-foreground mt-1">This will be your unique identifier. Only lowercase letters and numbers are allowed.</p>
                <div id="username-error" aria-live="polite">
                  {submitState.errors?.username && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.username[0]}</p>}
                   {usernameStatus === 'invalid' && <p className="text-sm font-medium text-destructive mt-1">Username can only contain lowercase letters and numbers.</p>}
                </div>
                <div id="username-status" aria-live="polite">
                    <FieldValidationStatus status={usernameStatus} checkingText="Checking username..." takenText={isUsernameForbidden ? "This name can not be entered because this name is the most hated name by the ryha founder and the reason behind this will shared with all users during publishing time" : "Username is already taken."} availableText="Username is available." />
                </div>
              </div>

              <div className="space-y-2">
                 <Label htmlFor="email">Email Address</Label>
                 <div className="relative">
                    <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="ada@newera.com" 
                        required 
                        aria-describedby="email-error email-status"
                        value={email}
                        onChange={handleEmailChange}
                        readOnly={emailSent || emailVerified}
                        className={cn(emailVerified && 'pl-8 border-green-500 focus-visible:ring-green-500', (submitState.errors?.email || emailStatus === 'taken') && 'border-destructive focus-visible:ring-destructive')}
                    />
                    {emailVerified && <ShieldCheck className="w-4 h-4 text-green-500 absolute left-2 top-1/2 -translate-y-1/2" />}
                 </div>
                 
                 {!emailVerified && !emailSent && (
                    <Button type="button" onClick={handleSendVerificationEmail} disabled={isSendingEmail || emailStatus !== 'available'} className="w-full mt-2">
                        {isSendingEmail ? <Loader2 className="animate-spin" /> : <Send />}
                        <span className="ml-2">Verify Email</span>
                    </Button>
                 )}

                 <p className="text-sm text-muted-foreground mt-1">We’ll send you a link to verify your email.</p>
                 <div id="email-error" aria-live="polite">
                    {submitState.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.email[0]}</p>}
                    {emailVerificationError && !emailVerified && <p className="text-sm font-medium text-destructive mt-1">{emailVerificationError}</p>}
                 </div>
                 <div id="email-status" aria-live="polite">
                    <FieldValidationStatus status={emailStatus} checkingText="Checking email..." takenText="Email is already on the waitlist." availableText="Email is available to use." />
                 </div>
              </div>
              
              {emailSent && !emailVerified && (
                <Alert variant="default" className="bg-primary/10 border-primary/20">
                    <MailCheck className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary">Check Your Inbox</AlertTitle>
                    <AlertDescription>
                        A verification link has been sent to <strong>{email}</strong>. Click the link to continue.
                    </AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input 
                  id="mobile" 
                  name="mobile" 
                  type="tel" 
                  placeholder="+1 (555) 123-4567" 
                  required 
                  aria-describedby="mobile-error mobile-status"
                  value={mobile}
                  onChange={handleMobileChange}
                  className={cn((submitState.errors?.mobile || mobileStatus === 'taken') && 'border-destructive focus-visible:ring-destructive')}
                />
                <p className="text-sm text-muted-foreground mt-1">Helps us prioritize based on geolocation.</p>
                 <div id="mobile-error" aria-live="polite">
                  {submitState.errors?.mobile && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.mobile[0]}</p>}
                </div>
                 <div id="mobile-status" aria-live="polite">
                    <FieldValidationStatus status={mobileStatus} checkingText="Checking mobile number..." takenText="Mobile number is already on the waitlist." availableText="Mobile number is available." />
                </div>
              </div>

               <div>
                <Label htmlFor="designation">Your Designation</Label>
                <Select name="designation" required onValueChange={(value) => setShowOtherDesignation(value === 'other')}>
                    <SelectTrigger id="designation" aria-describedby="designation-error">
                        <SelectValue placeholder="Select your role..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="student">Student / Learner</SelectItem>
                        <SelectItem value="developer">Developer / Cybersecurity Expert</SelectItem>
                        <SelectItem value="researcher">Researcher / Innovator</SelectItem>
                        <SelectItem value="business">Business / Startup / Enterprise</SelectItem>
                        <SelectItem value="designer">Designer / Engineer / Architect</SelectItem>
                        <SelectItem value="government">Government / Public Sector</SelectItem>
                        <SelectItem value="creator">AI Builder / Creator</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
                 <div id="designation-error" aria-live="polite">
                  {submitState.errors?.designation && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.designation[0]}</p>}
                </div>
              </div>

              {showOtherDesignation && (
                <div>
                  <Label htmlFor="otherDesignation">Please specify</Label>
                  <Input id="otherDesignation" name="otherDesignation" placeholder="e.g., Marketing Manager" required aria-describedby="otherDesignation-error" />
                  <div id="otherDesignation-error" aria-live="polite">
                    {submitState.errors?.otherDesignation && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.otherDesignation[0]}</p>}
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="features">What Features Do You Want in Ryha OS?</Label>
                <Textarea id="features" name="features" placeholder="e.g., Advanced AI-powered code editor, seamless cloud integration..." required aria-describedby="features-error" />
                 <div id="features-error" aria-live="polite">
                  {submitState.errors?.features && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.features[0]}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Why do you want Ryha OS?</Label>
                <Textarea 
                  id="reason" 
                  name="reason" 
                  placeholder="e.g., I'm looking for a more secure and efficient development environment." 
                  required 
                  aria-describedby="reason-error"
                  value={reason}
                  onChange={handleReasonChange}
                />
                 <div id="reason-error" aria-live="polite">
                  {submitState.errors?.reason && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.reason[0]}</p>}
                </div>
              </div>
              
              {showReasonCheckbox && (
                <div className="items-top flex space-x-2">
                  <Checkbox 
                    id="reason-query" 
                    onCheckedChange={handleReasonQueryCheck}
                    checked={reasonQueryChecked}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="reason-query"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I want to know the reason behind this hated name
                    </label>
                  </div>
                </div>
              )}

              <SubmitButton isEmailVerified={emailVerified} isFormValid={isFormValid} />
               {!emailVerified && <p className="text-center text-sm text-muted-foreground">Please verify your email to join the waitlist.</p>}
               {emailVerified && !isFormValid && <p className="text-center text-sm text-muted-foreground">Please ensure all fields are valid and available before submitting.</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
