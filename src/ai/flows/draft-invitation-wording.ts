'use server';
/**
 * @fileOverview An AI assistant that helps draft personalized invitation wording.
 *
 * - draftInvitationWording - A function that handles the invitation wording drafting process.
 * - DraftInvitationWordingInput - The input type for the draftInvitationWording function.
 * - DraftInvitationWordingOutput - The return type for the draftInvitationWording function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftInvitationWordingInputSchema = z.object({
  eventName: z.string().describe('The name of the event or party.'),
  date: z.string().describe('The date of the event, e.g., "October 26, 2024".'),
  time: z.string().describe('The time of the event, e.g., "7:00 PM onwards".'),
  location: z.string().describe('The location or venue of the event.'),
  theme: z.string().optional().describe('The theme of the party, if any, e.g., "Tropical Luau" or "Masquerade Ball".'),
  purpose: z.string().optional().describe('The purpose of the event, e.g., "celebrating a birthday" or "annual holiday gathering".'),
  additionalInfo: z.string().optional().describe('Any other specific details or instructions to include in the invitation, e.g., "dress code" or "RSVP by date".'),
});
export type DraftInvitationWordingInput = z.infer<typeof DraftInvitationWordingInputSchema>;

const DraftInvitationWordingOutputSchema = z.object({
  invitationWording: z.string().describe('The generated personalized invitation wording.'),
});
export type DraftInvitationWordingOutput = z.infer<typeof DraftInvitationWordingOutputSchema>;

export async function draftInvitationWording(input: DraftInvitationWordingInput): Promise<DraftInvitationWordingOutput> {
  return draftInvitationWordingFlow(input);
}

const draftInvitationWordingPrompt = ai.definePrompt({
  name: 'draftInvitationWordingPrompt',
  input: {schema: DraftInvitationWordingInputSchema},
  output: {schema: DraftInvitationWordingOutputSchema},
  prompt: `You are an expert copywriter specializing in creating compelling and personalized party invitations.

Draft a creative and engaging invitation for an event, incorporating all provided details.

Event Name: {{{eventName}}}
Date: {{{date}}}
Time: {{{time}}}
Location: {{{location}}}
{{#if theme}}Theme: {{{theme}}}{{/if}}
{{#if purpose}}Purpose: {{{purpose}}}{{/if}}
{{#if additionalInfo}}Additional Information: {{{additionalInfo}}}{{/if}}

Focus on creating a warm, inviting, and clear message that encourages guests to attend. Feel free to use a friendly and festive tone.`,
});

const draftInvitationWordingFlow = ai.defineFlow(
  {
    name: 'draftInvitationWordingFlow',
    inputSchema: DraftInvitationWordingInputSchema,
    outputSchema: DraftInvitationWordingOutputSchema,
  },
  async (input) => {
    const {output} = await draftInvitationWordingPrompt(input);
    return output!;
  },
);
