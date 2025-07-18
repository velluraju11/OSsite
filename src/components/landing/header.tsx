import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-grid relative overflow-hidden">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent">
            Ryha OS
          </h1>
          <p className="mt-4 max-w-xl text-lg md:text-xl text-muted-foreground">
            The World’s Smartest Operating System. Fully integrated with Ryha AI, enabling AI-assisted operations from booting to shutdown.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#contact">
              <Button size="lg" className="px-8 py-6 text-lg">Express Interest</Button>
            </a>
            <a href="#features">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
