"use client";

import { useState, useTransition, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { getAiHighlights } from '@/app/actions';
import type { SelectFeatureHighlightsOutput } from '@/ai/flows/feature-highlight-selection';
import { Loader2, Send, Sparkles, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'bot';
  content: string;
  highlights?: SelectFeatureHighlightsOutput;
};

export function AiHighlighter() {
  const [isPending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleQuerySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim() || isPending) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);

    startTransition(async () => {
      const highlights = await getAiHighlights(query, 'medium');
      const botMessage: Message = {
        role: 'bot',
        content: highlights.length > 0
          ? `I found ${highlights.length} feature${highlights.length > 1 ? 's' : ''} related to your query.`
          : "I couldn't find any specific features for your query. Here are some general highlights you might find interesting.",
        highlights: highlights.length > 0 ? highlights : await getAiHighlights('general features', 'low'),
      };
      setMessages(prev => [...prev, botMessage]);
    });
    setQuery('');
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <section id="ai-highlighter" className="w-full py-16 md:py-24 bg-background/50">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-3xl mx-auto border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center gap-2 mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <CardTitle className="font-headline text-3xl">Talk to Ryha AI</CardTitle>
              </div>
              <CardDescription>
                Ask a question about Ryha OS and get instant, intelligent answers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex flex-col">
                <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div key={index} className={cn("flex items-start gap-4 animate-in fade-in", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {message.role === 'bot' && <div className="p-2 bg-primary rounded-full text-primary-foreground"><Bot className="w-5 h-5"/></div>}
                        <div className={cn("max-w-[75%] rounded-lg p-3", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                          <p className="text-sm">{message.content}</p>
                          {message.role === 'bot' && message.highlights && message.highlights.length > 0 && (
                            <div className="mt-4 grid grid-cols-1 gap-2">
                              {message.highlights.map((highlight, idx) => (
                                <div key={idx} className="p-3 bg-background/50 rounded-md border border-border/50">
                                  <p className="font-bold text-sm text-foreground">{highlight.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{highlight.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                         {message.role === 'user' && <div className="p-2 bg-muted rounded-full text-muted-foreground"><User className="w-5 h-5"/></div>}
                      </div>
                    ))}
                    {isPending && (
                       <div className="flex items-start gap-4">
                         <div className="p-2 bg-primary rounded-full text-primary-foreground"><Bot className="w-5 h-5"/></div>
                         <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                           <Loader2 className="w-4 h-4 animate-spin" />
                           <span className="text-sm text-muted-foreground">Thinking...</span>
                         </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
                <form onSubmit={handleQuerySubmit} className="mt-4 flex items-center gap-2 border-t border-border/50 pt-4">
                  <Input
                    type="text"
                    placeholder="e.g., How does Ryha handle security?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={isPending}
                    className="flex-1"
                    aria-label="Ask a question about Ryha OS"
                  />
                  <Button type="submit" disabled={isPending || !query.trim()} size="icon" className="shrink-0">
                    {isPending ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
