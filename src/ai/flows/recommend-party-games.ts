'use server';
/**
 * @fileOverview A Genkit flow that recommends party games based on party details.
 *
 * - recommendPartyGames - A function that handles the party game recommendation process.
 * - RecommendPartyGamesInput - The input type for the recommendPartyGames function.
 * - RecommendPartyGamesOutput - The return type for the recommendPartyGames function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPartyGamesInputSchema = z.object({
  theme: z.string().describe('The theme of the party (e.g., Pirate Adventure, Roaring Twenties).'),
  ageRange: z.string().describe('The age range of the guests (e.g., 5-10 years old, Adults 18+, Mixed family group).'),
  numberOfGuests: z.number().describe('The number of guests attending the party.'),
});
export type RecommendPartyGamesInput = z.infer<typeof RecommendPartyGamesInputSchema>;

const RecommendPartyGamesOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      name: z.string().describe('The name of the recommended game or activity.'),
      description: z.string().describe('A brief description of the game and how to play it.'),
    })
  ).describe('A list of recommended party games and activities tailored to the party details.'),
});
export type RecommendPartyGamesOutput = z.infer<typeof RecommendPartyGamesOutputSchema>;

export async function recommendPartyGames(input: RecommendPartyGamesInput): Promise<RecommendPartyGamesOutput> {
  return recommendPartyGamesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPartyGamesPrompt',
  input: {schema: RecommendPartyGamesInputSchema},
  output: {schema: RecommendPartyGamesOutputSchema},
  prompt: `You are an AI assistant specializing in party planning and game recommendations.
Your task is to suggest engaging games and activities tailored to a party's theme, guest age range, and number of guests.
Provide a list of at least 3-5 distinct game or activity recommendations.

Party Details:
Theme: {{{theme}}}
Guest Age Range: {{{ageRange}}}
Number of Guests: {{{numberOfGuests}}}

Consider the age range and number of guests to suggest appropriate and fun activities. Ensure the recommendations align with the party theme.
`,
});

const recommendPartyGamesFlow = ai.defineFlow(
  {
    name: 'recommendPartyGamesFlow',
    inputSchema: RecommendPartyGamesInputSchema,
    outputSchema: RecommendPartyGamesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
