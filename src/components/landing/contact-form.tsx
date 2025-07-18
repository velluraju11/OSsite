
"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast"
import { submitInterestForm, sendOtpAction } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldCheck, MailCheck, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialSubmitState = {
  message: '',
  errors: {},
  reset: false,
};

const initialOtpState = {
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
  const [otpState, sendOtpFormAction] = useActionState(sendOtpAction, initialOtpState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [showOtherDesignation, setShowOtherDesignation] = useState(false);
  
  // OTP State Management
  const [email, setEmail] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  // Username client-side validation
  const [username, setUsername] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  // Effect for main form submission
  useEffect(() => {
    if (!submitState.message) return;
    
    if (submitState.errors && Object.keys(submitState.errors).length > 0) {
      toast({
        title: "Error",
        description: submitState.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: submitState.message,
      });
      if (submitState.reset) {
          formRef.current?.reset();
          setShowOtherDesignation(false);
          // Reset OTP state as well
          setEmail('');
          setOtpSent(false);
          setOtpVerified(false);
          setOtp('');
          setOtpError('');
          setUsername('');
          setIsUsernameValid(true);
      }
    }
  }, [submitState, toast]);

  // Effect for OTP form action
  useEffect(() => {
    if (otpState.success) {
      setOtpSent(true);
      toast({
        title: 'OTP Sent',
        description: otpState.message,
      });
    }
    if (otpState.error) {
      setOtpError(otpState.error);
    }
  }, [otpState, toast]);
  
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
        setOtpError('Please enter a valid 6-digit OTP.');
        return;
    }
    setOtpError('');
    setIsVerifyingOtp(true);
    // Simulate API call to verify OTP
    console.log("Verifying OTP:", otp);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure
    if(otp === '123456') { // Mock OTP
        setIsVerifyingOtp(false);
        setOtpVerified(true);
        setOtpError('');
        toast({
          title: "Verified",
          description: "Your email has been successfully verified.",
          className: "bg-green-500 text-white"
        });
    } else {
        setIsVerifyingOtp(false);
        setOtpError('Invalid OTP. Please try again.');
    }
  };
  
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

  const { pending: isOtpPending } = useFormStatus();


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
            <form ref={formRef} action={submitFormAction} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="Enter your real or hacker alias" required aria-describedby="fullName-error" />
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
                 <div className="flex items-center gap-2">
                    <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="ada@newera.com" 
                        required 
                        aria-describedby="email-error"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={otpSent}
                    />
                    {!otpVerified && !otpSent && (
                        <Button type="submit" disabled={isOtpPending} className="shrink-0" formAction={sendOtpFormAction}>
                            {isOtpPending ? <Loader2 className="animate-spin" /> : <Send />}
                            <span className="ml-2 hidden md:inline">Send OTP</span>
                        </Button>
                    )}
                 </div>
                 <div className="flex items-center gap-2">
                    {otpSent && !otpVerified && <MailCheck className="w-10 h-10 text-primary shrink-0" />}
                    {otpVerified && <ShieldCheck className="w-10 h-10 text-green-500 shrink-0" />}
                 </div>
                 <p className="text-sm text-muted-foreground mt-1">We’ll send you an OTP to verify and whitelist you for updates.</p>
                 <div id="email-error" aria-live="polite">
                    {submitState.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{submitState.errors.email[0]}</p>}
                    {otpState.error && !otpVerified && <p className="text-sm font-medium text-destructive mt-1">{otpState.error}</p>}
                </div>
              </div>
              
              {otpSent && !otpVerified && (
                <div>
                  <Label htmlFor="otp">Email OTP</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                        id="otp" 
                        name="otp" 
                        type="text" 
                        placeholder="Enter the 6-digit code" 
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                    />
                     <Button type="button" onClick={handleVerifyOtp} disabled={isVerifyingOtp} className="shrink-0">
                       {isVerifyingOtp ? <Loader2 className="animate-spin" /> : 'Verify'}
                     </Button>
                  </div>
                   <p className="text-sm text-muted-foreground mt-1">Check your email for the verification code. (Hint: it's 123456)</p>
                   {otpError && <p className="text-sm font-medium text-destructive mt-1">{otpError}</p>}
                </div>
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

              <SubmitButton isEmailVerified={otpVerified} />
               {!otpVerified && <p className="text-center text-sm text-muted-foreground">Please verify your email to join the waitlist.</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
