import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, BrainCircuit, User, Infinity, Wallet, Zap, Key, Lightbulb } from 'lucide-react';

const valuesList = [
    { icon: <Shield className="w-8 h-8 text-primary"/>, title: 'Security by Design', description: 'Not an afterthought, but a foundation' },
    { icon: <BrainCircuit className="w-8 h-8 text-primary"/>, title: 'AI-First Thinking', description: 'Every layer is smart, from kernel to UI' },
    { icon: <User className="w-8 h-8 text-primary"/>, title: 'User-Driven Interfaces', description: 'Designed for experience, not complexity' },
    { icon: <Infinity className="w-8 h-8 text-primary"/>, title: 'Boundless Innovation', description: 'No barriers. No limits' },
    { icon: <Wallet className="w-8 h-8 text-primary"/>, title: 'Affordable Power', description: 'Elite tech made accessible' },
    { icon: <Zap className="w-8 h-8 text-primary"/>, title: 'Autonomous Evolution', description: 'Self-updating and self-improving systems' },
    { icon: <Key className="w-8 h-8 text-primary"/>, title: 'True Freedom', description: 'No surveillance. No vendor lock-ins. Your data is never shared with us.' },
    { icon: <Lightbulb className="w-8 h-8 text-primary"/>, title: 'Real Utility', description: 'Not just hype. Tangible, daily-impacting results' },
];

export function CoreValues() {
  return (
    <section id="core-values" className="w-full py-16 md:py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Our Core Values</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valuesList.map((value, index) => (
             <div key={index} className="relative group">
                <Card className="relative flex items-start text-left p-6 bg-card h-full transition-all duration-300 border border-primary/10 rounded-xl hover:bg-primary/5 hover:border-primary/30">
                  <div className="mr-4 flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg border border-primary/20">
                      {value.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <CardHeader className="p-0">
                      <CardTitle className="font-headline text-lg tracking-wide">{value.title}</CardTitle>
                    </CardHeader>
                    <CardDescription className="mt-1 text-foreground/70">{value.description}</CardDescription>
                  </div>
                </Card>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
