"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast"
import { submitInterestForm } from '@/app/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const initialState = {
  message: '',
  errors: {},
  reset: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full text-lg py-6" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : 'Submit Interest'}
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState(submitInterestForm, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

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
      }
    }
  }, [state, toast]);

  return (
    <section id="contact" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-xl mx-auto border-primary/50 shadow-lg shadow-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Get Early Access</CardTitle>
            <CardDescription>
              Join the waitlist and be the first to experience the future of computing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Ada Lovelace" required aria-describedby="name-error" />
                <div id="name-error" aria-live="polite">
                  {state.errors?.name && <p className="text-sm font-medium text-destructive mt-1">{state.errors.name[0]}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="ada@newera.com" required aria-describedby="email-error" />
                 <div id="email-error" aria-live="polite">
                  {state.errors?.email && <p className="text-sm font-medium text-destructive mt-1">{state.errors.email[0]}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" placeholder="Tell us what you're most excited about in Ryha OS!" required rows={4} aria-describedby="message-error" />
                 <div id="message-error" aria-live="polite">
                  {state.errors?.message && <p className="text-sm font-medium text-destructive mt-1">{state.errors.message[0]}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="captcha">Security Question: What is 3 + 5?</Label>
                <Input id="captcha" name="captcha" type="text" placeholder="Your answer" required aria-describedby="captcha-error" />
                 <div id="captcha-error" aria-live="polite">
                  {state.errors?.captcha && <p className="text-sm font-medium text-destructive mt-1">{state.errors.captcha[0]}</p>}
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
