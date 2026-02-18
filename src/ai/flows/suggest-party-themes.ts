'use server';
/**
 * @fileOverview A Genkit flow for suggesting party themes based on event details.
 *
 * - suggestPartyThemes - A function that handles the party theme suggestion process.
 * - SuggestPartyThemesInput - The input type for the suggestPartyThemes function.
 * - SuggestPartyThemesOutput - The return type for the suggestPartyThemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPartyThemesInputSchema = z.object({
  purpose: z
    .string()
    .describe("The purpose of the event (e.g., birthday, graduation, casual get-together)."),
  ambiance: z
    .string()
    .describe("The desired ambiance for the party (e.g., lively, relaxed, elegant, quirky)."),
});
export type SuggestPartyThemesInput = z.infer<typeof SuggestPartyThemesInputSchema>;

const SuggestPartyThemesOutputSchema = z.object({
  themes: z.array(z.string()).describe('A list of suggested party themes.'),
});
export type SuggestPartyThemesOutput = z.infer<typeof SuggestPartyThemesOutputSchema>;

export async function suggestPartyThemes(
  input: SuggestPartyThemesInput
): Promise<SuggestPartyThemesOutput> {
  return suggestPartyThemesFlow(input);
}

const suggestPartyThemesPrompt = ai.definePrompt({
  name: 'suggestPartyThemesPrompt',
  input: {schema: SuggestPartyThemesInputSchema},
  output: {schema: SuggestPartyThemesOutputSchema},
  prompt: `You are an AI assistant specialized in party planning, offering creative and unique theme suggestions.

Based on the following details, suggest a list of creative party themes.

Event Purpose: {{{purpose}}}
Desired Ambiance: {{{ambiance}}}

Ensure the themes are distinct and inspiring.`,
});

const suggestPartyThemesFlow = ai.defineFlow(
  {
    name: 'suggestPartyThemesFlow',
    inputSchema: SuggestPartyThemesInputSchema,
    outputSchema: SuggestPartyThemesOutputSchema,
  },
  async input => {
    const {output} = await suggestPartyThemesPrompt(input);
    return output!;
  }
);
