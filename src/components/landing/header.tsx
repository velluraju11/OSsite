import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-grid relative overflow-hidden border-b border-primary/10">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>
      <div className="absolute pointer-events-none -bottom-1/2 left-0 right-0 h-1/2 w-full bg-gradient-to-t from-background to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
           <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 border border-primary/20 shadow-sm">
            The World’s Smartest Operating System
          </div>
          <h1 className="font-headline text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 leading-tight">
            Ryha OS
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
            An AI-native ecosystem that thinks, works, and evolves—like a human. Fully voice-controlled and designed for military-grade security.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#contact">
              <Button size="lg" className="px-8 py-6 text-lg glow-shadow">Get Early Access</Button>
            </a>
            <a href="#features">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-background/50 backdrop-blur-sm">
                Explore Features
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
