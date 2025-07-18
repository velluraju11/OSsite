"use client";

import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from "@/hooks/use-toast"
import { submitInterestForm } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ShieldCheck, MailCheck, Send } from 'lucide-react';

const initialState = {
  message: '',
  errors: {},
  reset: false,
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
  const [state, formAction] = useActionState(submitInterestForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [showOtherDesignation, setShowOtherDesignation] = useState(false);
  
  // OTP State Management
  const [email, setEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');


  useEffect(() => {
    if (!state.message) return;
    
    if (state.errors && Object.keys(state.errors).length > 0) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: state.message,
      });
      if (state.reset) {
          formRef.current?.reset();
          setShowOtherDesignation(false);
          // Reset OTP state as well
          setEmail('');
          setOtpSent(false);
          setOtpVerified(false);
          setOtp('');
          setOtpError('');
      }
    }
  }, [state, toast]);
  
  const handleSendOtp = async () => {
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setOtpError('Please enter a valid email address.');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);
    // Simulate API call to send OTP
    console.log("OTP requested for:", email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSendingOtp(false);
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: "A verification code has been sent to your email.",
    });
  };

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
            <form ref={formRef} action={formAction} className="space-y-6">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" placeholder="Enter your real or hacker alias" required aria-describedby="fullName-error" />
                <div id="fullName-error" aria-live="polite">
                  {state.errors?.fullName && <p className="text-sm font-medium text-destructive mt-1">{state.errors.fullName[0]}</p>}
                </div>
              </div>
              
              <div>
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
                  {!otpVerified && (
                     <Button type="button" onClick={handleSendOtp} disabled={isSendingOtp || otpSent} className="shrink-0">
                       {isSendingOtp ? <Loader2 className="animate-spin" /> : otpSent ? <MailCheck /> : <Send />}
                       <span className="ml-2 hidden md:inline">{otpSent ? 'Sent' : 'Send OTP'}</span>
                     </Button>
                  )}
                  {otpVerified && <ShieldCheck className="w-10 h-10 text-green-500 shrink-0" />}
                </div>
                 <p className="text-sm text-muted-foreground mt-1">We’ll send you an OTP to verify and whitelist you for updates.</p>
                 <div id="email-error" aria-live="polite">
                  {state.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{state.errors.email[0]}</p>}
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
                  {state.errors?.mobile && <p className="text-sm font-medium text-destructive mt-1">{state.errors.mobile[0]}</p>}
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
                  {state.errors?.designation && <p className="text-sm font-medium text-destructive mt-1">{state.errors.designation[0]}</p>}
                </div>
              </div>

              {showOtherDesignation && (
                <div>
                  <Label htmlFor="otherDesignation">Please specify</Label>
                  <Input id="otherDesignation" name="otherDesignation" placeholder="e.g., Marketing Manager" required aria-describedby="otherDesignation-error" />
                  <div id="otherDesignation-error" aria-live="polite">
                    {state.errors?.otherDesignation && <p className="text-sm font-medium text-destructive mt-1">{state.errors.otherDesignation[0]}</p>}
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="features">What Features Do You Want in Ryha OS?</Label>
                <Textarea id="features" name="features" placeholder="e.g., Advanced AI-powered code editor, seamless cloud integration..." required />
                 <div id="features-error" aria-live="polite">
                  {state.errors?.features && <p className="text-sm font-medium text-destructive mt-1">{state.errors.features[0]}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Why do you want Ryha OS?</Label>
                <Textarea id="reason" name="reason" placeholder="e.g., I'm looking for a more secure and efficient development environment." required/>
                 <div id="reason-error" aria-live="polite">
                  {state.errors?.reason && <p className="text-sm font-medium text-destructive mt-1">{state.errors.reason[0]}</p>}
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
