import { Check } from 'lucide-react';

const buildItems = [
  { text: 'Automate repetitive and technical tasks in real time' },
  { text: 'Continuously optimize workflows without relying on user pattern learning' },
  { text: 'Embed military-grade security at every layer — by default' },
  { text: 'Deliver extreme performance with an ultra-light system footprint' },
  { text: 'Fuse human creativity with machine precision' },
  { text: 'Assist in coding, UI/UX, cybersecurity, DevOps, testing, and more' },
  { text: 'Serve all industries — from students to defense' },
];

export function WhatRyhaBuilds() {
  return (
    <section id="what-we-build" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">What Ryha Builds</h2>
            <p className="text-muted-foreground md:text-lg">
              Ryha creates AI-native, autonomous digital ecosystems that:
            </p>
            <ul className="space-y-4 mt-6">
              {buildItems.map((item, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="bg-primary/90 text-primary-foreground rounded-full p-1.5 mt-1 flex-shrink-0 shadow-md">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-foreground/90 text-base">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-card rounded-lg p-8 border border-primary/20 glow-shadow shadow-2xl shadow-primary/10">
            <p className="text-xl md:text-2xl font-medium text-foreground/90 leading-relaxed font-headline tracking-wide">
              "This is not traditional software. These are AI-native ecosystems that think, work, and evolve — like a human."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
