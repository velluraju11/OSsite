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
    <section id="features" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">A New Era of Computing</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Ryha OS is not just an operating system; it's an intelligent partner designed to enhance your digital life with classified security and unparalleled speed.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuresList.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 bg-card hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="mb-4 p-3 bg-primary/10 rounded-full">{feature.icon}</div>
              <CardHeader className="p-0">
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardDescription className="mt-2 flex-grow">{feature.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
