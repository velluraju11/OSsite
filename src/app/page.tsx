import { Header } from '@/components/landing/header';
import { Features } from '@/components/landing/features';
import { AiHighlighter } from '@/components/landing/ai-highlighter';
import { ContactForm } from '@/components/landing/contact-form';
import { Footer } from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1">
        <Header />
        <Features />
        <AiHighlighter />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
