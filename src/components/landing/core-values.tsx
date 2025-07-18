import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock, Cpu, Fingerprint, Code, ToyBrick, Rocket, ShieldQuestion, BrainCircuit } from 'lucide-react';

const valuesList = [
    { icon: <Fingerprint className="w-8 h-8 text-primary"/>, title: 'Security by Design', description: 'Not an afterthought, but a foundation' },
    { icon: <BrainCircuit className="w-8 h-8 text-primary"/>, title: 'AI-First Thinking', description: 'Every layer is smart, from kernel to UI' },
    { icon: <Cpu className="w-8 h-8 text-primary"/>, title: 'User-Driven Interfaces', description: 'Designed for experience, not complexity' },
    { icon: <Rocket className="w-8 h-8 text-primary"/>, title: 'Boundless Innovation', description: 'No barriers. No limits' },
    { icon: <Code className="w-8 h-8 text-primary"/>, title: 'Affordable Power', description: 'Elite tech made accessible' },
    { icon: <ToyBrick className="w-8 h-8 text-primary"/>, title: 'Autonomous Evolution', description: 'Self-updating and self-improving systems' },
    { icon: <ShieldQuestion className="w-8 h-8 text-primary"/>, title: 'True Freedom', description: 'No surveillance. No vendor lock-ins. Your data is never shared with us.' },
    { icon: <Lock className="w-8 h-8 text-primary"/>, title: 'Real Utility', description: 'Not just hype. Tangible, daily-impacting results' },
];

export function CoreValues() {
  return (
    <section id="core-values" className="w-full py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Our Core Values</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valuesList.map((value, index) => (
             <div key={index} className="relative group">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-10 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Card className="relative flex flex-col items-center text-center p-6 bg-card h-full">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <CardHeader className="p-0">
                    <CardTitle className="font-headline text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardDescription className="mt-2 flex-grow">{value.description}</CardDescription>
                </Card>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
