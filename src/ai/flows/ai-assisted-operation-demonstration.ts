'use server';
/**
 * @fileOverview Demonstrates Ryha OS's AI-assisted features like voice control, automated tasks, and real-time threat detection.
 *
 * - aiAssistedOperationDemonstration - A function that orchestrates the AI-assisted feature demonstration.
 * - AiAssistedOperationInput - The input type for the aiAssistedOperationDemonstration function.
 * - AiAssistedOperationOutput - The return type for the aiAssistedOperationDemonstration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistedOperationInputSchema = z.object({
  userQuery: z.string().describe('The user query about Ryha OS AI-assisted features.'),
  engagementLevel: z
    .enum(['low', 'medium', 'high'])
    .describe('The user engagement level (low, medium, high).'),
});
export type AiAssistedOperationInput = z.infer<typeof AiAssistedOperationInputSchema>;

const AiAssistedOperationOutputSchema = z.object({
  featureHighlights: z.array(
    z.object({
      title: z.string().describe('Title of the feature highlight.'),
      description: z.string().describe('Description of the feature highlight.'),
    })
  ).describe('A list of feature highlights tailored to the user query and engagement level.'),
});
export type AiAssistedOperationOutput = z.infer<typeof AiAssistedOperationOutputSchema>;

export async function aiAssistedOperationDemonstration(
  input: AiAssistedOperationInput
): Promise<AiAssistedOperationOutput> {
  return aiAssistedOperationDemonstrationFlow(input);
}

const featureHighlightTool = ai.defineTool({
  name: 'getFeatureHighlights',
  description: 'Retrieves relevant Ryha OS feature highlights based on user query and engagement level.',
  inputSchema: z.object({
    query: z.string().describe('The user query about Ryha OS features.'),
    level: z.enum(['low', 'medium', 'high']).describe('The user engagement level.'),
  }),
  outputSchema: z.array(
    z.object({
      title: z.string().describe('Title of the feature highlight.'),
      description: z.string().describe('Description of the feature highlight.'),
    })
  ),
},
async (input) => {
  // Mock implementation of fetching feature highlights based on query and level.
  // In a real application, this would fetch from a database or external source.
  const {
    query,
    level,
  } = input;
  const highlights = [
    {
      title: 'Voice Control',
      description: `Effortlessly manage Ryha OS with voice commands. Engagement level: ${level}, Query: ${query}`,
    },
    {
      title: 'Automated Tasks',
      description: `Ryha OS automates routine tasks, saving you time. Engagement level: ${level}, Query: ${query}`,
    },
    {
      title: 'Real-time Threat Detection',
      description: `Proactive security measures protect your data. Engagement level: ${level}, Query: ${query}`,
    },
  ];

  // Filter based on query (very basic example)
  const filteredHighlights = highlights.filter(h =>
    h.title.toLowerCase().includes(query.toLowerCase())
  );

  return filteredHighlights.length > 0 ? filteredHighlights : highlights;
});

const aiAssistedOperationDemonstrationPrompt = ai.definePrompt({
  name: 'aiAssistedOperationDemonstrationPrompt',
  tools: [featureHighlightTool],
  input: {schema: AiAssistedOperationInputSchema},
  output: {schema: AiAssistedOperationOutputSchema},
  prompt: `Based on the user's query and engagement level, select the most relevant Ryha OS feature highlights. Use the getFeatureHighlights tool to retrieve the highlights.

User Query: {{{userQuery}}}
Engagement Level: {{{engagementLevel}}}

Return the feature highlights.
`,
});

const aiAssistedOperationDemonstrationFlow = ai.defineFlow(
  {
    name: 'aiAssistedOperationDemonstrationFlow',
    inputSchema: AiAssistedOperationInputSchema,
    outputSchema: AiAssistedOperationOutputSchema,
  },
  async input => {
    const {output} = await aiAssistedOperationDemonstrationPrompt(input);
    return output!;
  }
);
