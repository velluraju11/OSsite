import { Badge } from '@/components/ui/badge';

const whoWeServeList = [
    'Students & Learners',
    'Developers & Cybersecurity Experts',
    'Researchers & Innovators',
    'Healthcare & Medical Platforms',
    'Governments, Law Enforcement & Public Systems',
    'Designers, Engineers & Architects',
    'Businesses, Startups & Enterprises',
    'E-commerce, Retail & Logistics',
    'Aerospace, Defense & Military Tech',
    'Industrial Automation & Robotics',
    'NGOs & Global Service Networks',
    'Schools, Universities & Institutions',
    'Banks, Fintech & Corporate Firms',
    'AI Builders, Prompt Engineers & Creators of Tomorrow',
];

export function WhoWeServe() {
  return (
    <section id="who-we-serve" className="w-full py-16 md:py-24 bg-background border-y border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl text-primary">Who We Serve</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Ryha’s technology is built for everyone, across every sector.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {whoWeServeList.map((item, index) => (
            <Badge key={index} variant="secondary" className="px-4 py-2 text-sm font-medium rounded-full bg-muted hover:bg-muted/80 text-muted-foreground border-border/50 transition-colors">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}