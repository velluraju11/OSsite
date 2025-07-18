"use client";

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getAiHighlights } from '@/app/actions';
import type { SelectFeatureHighlightsOutput } from '@/ai/flows/feature-highlight-selection';
import { Loader2, Wand2 } from 'lucide-react';

export function AiHighlighter() {
  const [isPending, startTransition] = useTransition();
  const [highlights, setHighlights] = useState<SelectFeatureHighlightsOutput>([]);
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [engagement, setEngagement] = useState<number[]>([1]);

  const engagementLevels = ['low', 'medium', 'high'] as const;

  const handleHighlight = () => {
    startTransition(async () => {
      const level = engagementLevels[engagement[0]];
      const result = await getAiHighlights(query, level);
      setHighlights(result);
      setHasSearched(true);
    });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleHighlight();
    }
  };

  return (
    <section id="ai-highlighter" className="w-full py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Smart Feature Highlights</h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            Have a question? Ask our AI to find the features most relevant to you.
          </p>
        </div>

        <div className="mt-8 max-w-2xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="e.g., 'How does it handle security?'"
              value={query}
              onChange={handleQueryChange}
              onKeyDown={handleKeyDown}
              className="flex-1"
              aria-label="Ask a question about Ryha OS"
            />
            <Button onClick={handleHighlight} disabled={isPending || !query} className="w-full sm:w-auto">
              {isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
              <span className="ml-2">Ask AI</span>
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="engagement-slider" className="text-sm text-muted-foreground">
              Detail Level: <span className="font-semibold text-foreground">{engagementLevels[engagement[0]]}</span>
            </Label>
            <Slider
              id="engagement-slider"
              min={0}
              max={2}
              step={1}
              value={engagement}
              onValueChange={setEngagement}
              disabled={isPending}
              aria-label="Engagement level slider"
            />
          </div>
        </div>

        <div className="mt-12 min-h-[250px]">
          {isPending && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                    <div className="h-6 bg-muted/30 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted/30 rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted/30 rounded w-5/6"></div>
                </Card>
              ))}
            </div>
          )}
          {!isPending && highlights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((highlight, index) => (
                <Card key={index} className="bg-background overflow-hidden animate-in fade-in-50" style={{animationDelay: `${index * 100}ms`}}>
                  <CardHeader>
                    <CardTitle className="font-headline text-xl">{highlight.title}</CardTitle>
                    <CardDescription className="pt-2">{highlight.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">Relevance</div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div className="bg-gradient-to-r from-accent to-primary h-1.5 rounded-full" style={{ width: `${highlight.relevanceScore * 100}%`}}></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {!isPending && hasSearched && highlights.length === 0 && (
             <div className="text-center text-muted-foreground mt-8">
                <p>No specific features found for your query. Please try asking another question.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
