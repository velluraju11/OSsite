
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { selectFeatureHighlights, SelectFeatureHighlightsOutput } from '@/ai/flows/feature-highlight-selection';
import { AnimatePresence, motion } from 'framer-motion';

export function AiDemo() {
  const [userInput, setUserInput] = useState('');
  const [engagementLevel, setEngagementLevel] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SelectFeatureHighlightsOutput>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDemo = async () => {
    if (!userInput) {
      setError('Please enter a query to see the AI in action.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const highlights = await selectFeatureHighlights({
        userInput,
        engagementLevel,
      });
      setResults(highlights);
    } catch (e) {
      console.error(e);
      setError('An error occurred while fetching AI suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <section id="ai-demo" className="w-full py-16 md:py-24 bg-background border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">Ryha AI in Action</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            See how Ryha OS understands your needs. Describe what you're looking for, and our AI will highlight the most relevant features for you.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mt-12 bg-card border-primary/20 shadow-xl shadow-primary/10 rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span>Feature Discovery Engine</span>
            </CardTitle>
            <CardDescription>
              Tell us what you want to achieve, and we'll show you how Ryha can help.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  className="sm:col-span-2"
                  placeholder="e.g., 'a secure environment for my startup'"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDemo()}
                />
                <Select value={engagementLevel} onValueChange={setEngagementLevel}>
                    <SelectTrigger>
                        <SelectValue placeholder="Engagement Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="low">Low Engagement</SelectItem>
                        <SelectItem value="medium">Medium Engagement</SelectItem>
                        <SelectItem value="high">High Engagement</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <Button onClick={handleDemo} disabled={isLoading} className="w-full glow-shadow">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Wand2 />
                    <span>Generate Highlights</span>
                  </div>
                )}
              </Button>
               {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
            </div>
            
            {results.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-center">Recommended Features For You:</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {results.map((feature, i) => (
                      <motion.div
                        key={feature.title}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                      >
                        <Card className="bg-background/50 h-full">
                          <CardHeader>
                            <CardTitle className="text-base">{feature.title}</CardTitle>
                            <CardDescription className="text-sm">{feature.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
