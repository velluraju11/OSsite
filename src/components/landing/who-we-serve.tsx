import { Card, CardContent } from '@/components/ui/card';

const whoWeServeList = [
    { emoji: '👨‍🎓', text: 'Students & Learners' },
    { emoji: '👩‍💻', text: 'Developers & Cybersecurity Experts' },
    { emoji: '🤝', text: 'Researchers & Innovators' },
    { emoji: '🏥', text: 'Healthcare & Medical Platforms' },
    { emoji: '🏛️', text: 'Governments, Law Enforcement & Public Systems' },
    { emoji: '⚒️', text: 'Designers, Engineers & Architects' },
    { emoji: '💼', text: 'Businesses, Startups & Enterprises' },
    { emoji: '🛒', text: 'E-commerce, Retail & Logistics' },
    { emoji: '✈️', text: 'Aerospace, Defense & Military Tech' },
    { emoji: '⚙️', text: 'Industrial Automation & Robotics' },
    { emoji: '🌍', text: 'NGOs & Global Service Networks' },
    { emoji: '🏫', text: 'Schools, Universities & Institutions' },
    { emoji: '📊', text: 'Banks, Fintech & Corporate Firms' },
    { emoji: '🤖', text: 'AI Builders, Prompt Engineers & Creators of Tomorrow' },
];

export function WhoWeServe() {
  return (
    <section id="who-we-serve" className="w-full py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Who We Serve</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Ryha’s technology is built for everyone, across every sector.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {whoWeServeList.map((item, index) => (
            <Card key={index} className="bg-background/50 hover:bg-background transition-colors duration-300">
              <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                <div className="text-5xl">{item.emoji}</div>
                <p className="font-medium text-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
