import { Header } from '@/components/landing/header';
import { Features } from '@/components/landing/features';
import { WhatRyhaBuilds } from '@/components/landing/what-ryha-builds';
import { CoreValues } from '@/components/landing/core-values';
import { WhoWeServe } from '@/components/landing/who-we-serve';
import { ContactForm } from '@/components/landing/contact-form';
import { Footer } from '@/components/landing/footer';
import { ScrollAnimation } from '@/components/scroll-animation';
import { AiDemo } from '@/components/landing/ai-demo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1">
        <Header />
        <ScrollAnimation>
          <Features />
        </ScrollAnimation>
        <ScrollAnimation>
          <AiDemo />
        </ScrollAnimation>
        <ScrollAnimation>
          <WhatRyhaBuilds />
        </ScrollAnimation>
        <ScrollAnimation>
          <CoreValues />
        </ScrollAnimation>
        <ScrollAnimation>
          <WhoWeServe />
        </ScrollAnimation>
        <ScrollAnimation>
          <ContactForm />
        </ScrollAnimation>
      </main>
      <Footer />
    </div>
  );
}
