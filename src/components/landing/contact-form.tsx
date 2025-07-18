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
import { Loader2, ShieldCheck, MailCheck } from 'lucide-react';

const initialState = {
  message: '',
  errors: {},
  reset: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full text-lg py-6 glow-shadow" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Join the Waitlist'}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitInterestForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    if (!state.message) return;
    
    if (state.errors && Object.keys(state.errors).length > 0) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
      setShowOtp(false);
    } else {
      toast({
        title: "Success",
        description: state.message,
      });
      if (state.reset) {
          formRef.current?.reset();
          setShowOtp(false);
      }
    }
  }, [state, toast]);

  const handleEmailSubmit = (e: React.FocusEvent<HTMLInputElement>) => {
    // Basic email validation before showing OTP
    if (e.target.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
      // In a real app, you'd trigger the OTP sending here.
      console.log("OTP requested for:", e.target.value);
      setShowOtp(true);
    } else {
      setShowOtp(false);
    }
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
                <div className="relative">
                  <Input id="email" name="email" type="email" placeholder="ada@newera.com" required aria-describedby="email-error" onBlur={handleEmailSubmit} />
                  {showOtp && <MailCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />}
                </div>
                 <p className="text-sm text-muted-foreground mt-1">We’ll send you an OTP to verify and whitelist you for updates.</p>
                 <div id="email-error" aria-live="polite">
                  {state.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{state.errors.email[0]}</p>}
                </div>
              </div>
              
              {showOtp && (
                <div>
                  <Label htmlFor="otp">Email OTP</Label>
                  <div className="relative">
                    <Input id="otp" name="otp" type="text" placeholder="Enter the 6-digit code" required />
                    <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  </div>
                   <p className="text-sm text-muted-foreground mt-1">Check your email for the verification code.</p>
                </div>
              )}

              <div>
                <Label htmlFor="mobile">Mobile Number (Optional)</Label>
                <Input id="mobile" name="mobile" type="tel" placeholder="+1 (555) 123-4567" aria-describedby="mobile-error" />
                <p className="text-sm text-muted-foreground mt-1">Helps us prioritize based on geolocation.</p>
                 <div id="mobile-error" aria-live="polite">
                  {state.errors?.mobile && <p className="text-sm font-medium text-destructive mt-1">{state.errors.mobile[0]}</p>}
                </div>
              </div>

               <div>
                <Label htmlFor="designation">Your Designation</Label>
                <Select name="designation">
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

              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
