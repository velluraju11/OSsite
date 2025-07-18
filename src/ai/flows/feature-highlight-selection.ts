'use server';

/**
 * @fileOverview A flow for selecting relevant Ryha OS feature highlights based on user input.
 *
 * - selectFeatureHighlights - A function that selects feature highlights based on user input.
 * - SelectFeatureHighlightsInput - The input type for the selectFeatureHighlights function.
 * - SelectFeatureHighlightsOutput - The return type for the selectFeatureHighlights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SelectFeatureHighlightsInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input, question, or area of interest regarding Ryha OS.'),
  engagementLevel: z
    .string()
    .optional()
    .describe(
      'Optional. The user engagement level: low, medium, or high.  Indicates the depth of information to provide.'
    ),
});
export type SelectFeatureHighlightsInput = z.infer<typeof SelectFeatureHighlightsInputSchema>;

const FeatureHighlightSchema = z.object({
  title: z.string().describe('The title of the feature highlight card.'),
  description: z.string().describe('A concise description of the Ryha OS feature.'),
  relevanceScore: z
    .number()
    .describe('A numerical score (0-1) indicating the relevance of this feature to the user input.'),
});

const SelectFeatureHighlightsOutputSchema = z.array(FeatureHighlightSchema).describe(
  'An array of Ryha OS feature highlights, ordered by relevance to the user input.'
);
export type SelectFeatureHighlightsOutput = z.infer<typeof SelectFeatureHighlightsOutputSchema>;

export async function selectFeatureHighlights(
  input: SelectFeatureHighlightsInput
): Promise<SelectFeatureHighlightsOutput> {
  return selectFeatureHighlightsFlow(input);
}

const featureCards = [
  {
    title: 'AI-Assisted Operations',
    description: 'Ryha AI enables AI-assisted operations from booting to shutdown, streamlining the user experience.',
  },
  {
    title: 'Futuristic UI',
    description: 'Features a futuristic UI with in-built applications for a modern user experience.',
  },
  {
    title: 'Voice Control',
    description: 'Hands-free control with integrated voice commands for enhanced accessibility.',
  },
  {
    title: 'Self-Modification',
    description: 'Ryha OS can self-modify and adapt to user preferences over time.',
  },
  {
    title: '10x Faster Performance',
    description: 'Experience significantly faster performance compared to traditional operating systems.',
  },
  {
    title: 'Automated Tasks',
    description: 'Automate repetitive tasks, increasing productivity and efficiency.',
  },
  {
    title: 'Real-Time Threat Detection',
    description: 'Advanced threat detection capabilities provide robust security.',
  },
  {
    title: 'Intelligent Google Drive Integration',
    description: 'Seamless and intelligent integration with Google Drive for user-controlled data storage.',
  },
  {
    title: 'Classified Security Architecture',
    description: 'A classified security architecture ensures top-tier data protection and privacy.',
  },
];

const prompt = ai.definePrompt({
  name: 'selectFeatureHighlightsPrompt',
  input: {schema: SelectFeatureHighlightsInputSchema},
  output: {schema: SelectFeatureHighlightsOutputSchema},
  prompt: `Given the following user input and Ryha OS features, select the most relevant features and order them by relevance. User Input: {{{userInput}}}. Engagement Level: {{{engagementLevel}}}

Here are the available Ryha OS features:
{{#each featureCards}}
  - Title: {{this.title}}, Description: {{this.description}}
{{/each}}

Output an array of feature highlights, ordered by relevance to the user input, with each highlight including a title, description, and relevanceScore (0-1).`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const selectFeatureHighlightsFlow = ai.defineFlow(
  {
    name: 'selectFeatureHighlightsFlow',
    inputSchema: SelectFeatureHighlightsInputSchema,
    outputSchema: SelectFeatureHighlightsOutputSchema,
  },
  async input => {
    const {output} = await prompt({
      ...input,
      featureCards,
    });
    return output!;
  }
);
