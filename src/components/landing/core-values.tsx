import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const valuesList = [
    { emoji: '🔐', title: 'Security by Design', description: 'Not an afterthought, but a foundation' },
    { emoji: '🧠', title: 'AI-First Thinking', description: 'Every layer is smart, from kernel to UI' },
    { emoji: '👨‍💻', title: 'User-Driven Interfaces', description: 'Designed for experience, not complexity' },
    { emoji: '⚙️', title: 'Boundless Innovation', description: 'No barriers. No limits' },
    { emoji: '💸', title: 'Affordable Power', description: 'Elite tech made accessible' },
    { emoji: '♻️', title: 'Autonomous Evolution', description: 'Self-updating and self-improving systems' },
    { emoji: '⚖️', title: 'True Freedom', description: 'No surveillance. No vendor lock-ins. Your data is never shared with us.' },
    { emoji: '💡', title: 'Real Utility', description: 'Not just hype. Tangible, daily-impacting results' },
];

export function CoreValues() {
  return (
    <section id="core-values" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Our Core Values</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valuesList.map((value, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 bg-card hover:shadow-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
              <div className="text-5xl mb-4">{value.emoji}</div>
              <CardHeader className="p-0">
                <CardTitle className="font-headline text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardDescription className="mt-2 flex-grow">{value.description}</CardDescription>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
