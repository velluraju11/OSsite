import { Cpu, ShieldCheck, Bot, Sparkles, Gauge, Cloud, Mic, BrainCircuit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const featuresList = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-primary" />,
    title: 'AI-Assisted Operations',
    description: 'Ryha AI streamlines your experience from boot-up to shutdown for ultimate efficiency.',
  },
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    title: 'Futuristic UI',
    description: 'A modern, intuitive UI with built-in applications for a seamless workflow.',
  },
  {
    icon: <Mic className="w-8 h-8 text-primary" />,
    title: 'Voice Control',
    description: 'No keyboard or mouse needed. Enjoy complete hands-free control over any app or game with integrated voice commands.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: 'Self-Modification',
    description: 'Adapts to your preferences over time, creating a truly personalized experience.',
  },
  {
    icon: <Gauge className="w-8 h-8 text-primary" />,
    title: '10x Faster Performance',
    description: 'Experience blazing-fast performance that leaves traditional operating systems behind.',
  },
  {
    icon: <Cpu className="w-8 h-8 text-primary" />,
    title: 'Automated Tasks',
    description: 'Increase your productivity and reclaim your time by automating repetitive tasks.',
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Real-Time Threat Detection',
    description: 'Advanced, proactive security architecture provides robust protection for your data.',
  },
  {
    icon: <Cloud className="w-8 h-8 text-primary" />,
    title: 'Intelligent Drive Integration',
    description: 'Seamlessly connect with Google Drive for intelligent, user-controlled data storage. Your data is never shared with us.',
  },
];

export function Features() {
  return (
    <section id="features" className="w-full py-16 md:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">A New Era of Computing</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Ryha OS is not just an operating system; it's an intelligent partner designed to enhance your digital life with classified security and unparalleled speed.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((feature, index) => (
            <div key={index} className="relative group">
              <Card className="relative flex items-start text-left p-6 bg-card h-full transition-all duration-300 border border-primary/10 rounded-xl hover:bg-primary/5 hover:border-primary/30">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-lg border border-primary/20">
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <CardHeader className="p-0">
                    <CardTitle className="font-headline text-lg tracking-wide">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardDescription className="mt-1 text-foreground/70">{feature.description}</CardDescription>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
