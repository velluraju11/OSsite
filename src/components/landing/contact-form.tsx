
"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast"
import { submitInterestForm, sendVerificationLinkAction } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldCheck, MailCheck, Send, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { getFirebaseApp } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';

const initialSubmitState = {
  message: '',
  errors: {},
  reset: false,
};

const initialEmailState = {
    error: '',
    message: '',
    success: false,
};

function SubmitButton({ isEmailVerified }: { isEmailVerified: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full text-lg py-6 glow-shadow" disabled={pending || !isEmailVerified}>
      {pending ? <Loader2 className="animate-spin" /> : 'Join the Waitlist'}
    </Button>
  );
}

export function ContactForm() {
  const [submitState, submitFormAction] = useActionState(submitInterestForm, initialSubmitState);
  const [emailState, sendEmailFormAction, isEmailSendPending] = useActionState(sendVerificationLinkAction, initialEmailState);
  
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [showOtherDesignation, setShowOtherDesignation] = useState(false);
  
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true); // Start as true to check on load

  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');

  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  
  // Effect to check for sign-in link on component mount
  useEffect(() => {
    const app = getFirebaseApp();
    if (!app) {
      console.log("Firebase not configured");
      setIsVerifying(false);
      return;
    };
    
    const auth = getAuth(app);
    if (isSignInWithEmailLink(auth, window.location.href) && emailFromUrl) {
      // Use a temporary email from localStorage if needed, or prompt the user.
      const savedEmail = window.localStorage.getItem('emailForSignIn') || emailFromUrl;
      signInWithEmailLink(auth, savedEmail, window.location.href)
        .then((result) => {
          setEmailVerified(true);
          setEmail(savedEmail);
          toast({
            title: "Verified",
            description: "Your email has been successfully verified.",
          });
           window.localStorage.removeItem('emailForSignIn');
          // Clean the URL
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
  }, [emailFromUrl, toast]);


  // Effect for main form submission
  useEffect(() => {
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
          setEmailSent(false);
          setEmailVerified(false);
          setUsername('');
          setIsUsernameValid(true);
      }
    }
  }, [submitState, toast]);
  
  // Effect for email verification link action
  useEffect(() => {
    if (emailState.success) {
      setEmailSent(true);
      // Store the email in localStorage to be used on return
      window.localStorage.setItem('emailForSignIn', email);
      toast({
        title: 'Verification link sent',
        description: emailState.message,
      });
    }
    if (emailState.error) {
      setEmailVerificationError(emailState.error);
    }
  }, [emailState, email, toast]);
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    const regex = /^[a-zA-Z0-9]*$/;
    if (regex.test(value)) {
      setIsUsernameValid(true);
    } else {
      setIsUsernameValid(false);
    }
  };

  const handleEmailAction = (formData: FormData) => {
    setEmailVerificationError(''); // Clear previous errors
    sendEmailFormAction(formData);
  }

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
             {submitState?.errors && Object.keys(submitState.errors).length > 0 && (
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
                  aria-describedby="username-error" 
                  value={username}
                  onChange={handleUsernameChange}
                  className={cn(!isUsernameValid || submitState.errors?.username ? 'border-destructive focus-visible:ring-destructive' : '')}
                />
                 <p className="text-sm text-muted-foreground mt-1">This will be your unique identifier. Only letters and numbers are allowed.</p>
                <div id="username-error" aria-live="polite">
                  {submitState.errors?.username && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.username[0]}</p>}
                  {!isUsernameValid && <p className="text-sm font-medium text-destructive mt-1">Username can only contain letters and numbers.</p>}
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
                        aria-describedby="email-error"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={emailSent || emailVerified}
                        className={cn(emailVerified && 'pl-8 border-green-500 focus-visible:ring-green-500')}
                    />
                    {emailVerified && <ShieldCheck className="w-4 h-4 text-green-500 absolute left-2 top-1/2 -translate-y-1/2" />}
                 </div>
                 
                 {!emailVerified && !emailSent && (
                    <Button formAction={handleEmailAction} disabled={isEmailSendPending} className="w-full mt-2">
                        {isEmailSendPending ? <Loader2 className="animate-spin" /> : <Send />}
                        <span className="ml-2">Verify Email</span>
                    </Button>
                 )}

                 <p className="text-sm text-muted-foreground mt-1">We’ll send you a link to verify your email.</p>
                 <div id="email-error" aria-live="polite">
                    {submitState.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.email[0]}</p>}
                    {emailState.error && !emailVerified && <p className="text-sm font-medium text-destructive mt-1">{emailState.error}</p>}
                    {emailVerificationError && !emailVerified && <p className="text-sm font-medium text-destructive mt-1">{emailVerificationError}</p>}
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
                <Input id="mobile" name="mobile" type="tel" placeholder="+1 (555) 123-4567" required aria-describedby="mobile-error" />
                <p className="text-sm text-muted-foreground mt-1">Helps us prioritize based on geolocation.</p>
                 <div id="mobile-error" aria-live="polite">
                  {submitState.errors?.mobile && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.mobile[0]}</p>}
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
                <Textarea id="reason" name="reason" placeholder="e.g., I'm looking for a more secure and efficient development environment." required aria-describedby="reason-error"/>
                 <div id="reason-error" aria-live="polite">
                  {submitState.errors?.reason && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.reason[0]}</p>}
                </div>
              </div>

              <SubmitButton isEmailVerified={emailVerified} />
               {!emailVerified && <p className="text-center text-sm text-muted-foreground">Please verify your email to join the waitlist.</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
