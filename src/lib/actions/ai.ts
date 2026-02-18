"use server";

import { z } from 'zod';
import { suggestPartyThemes } from '@/ai/flows/suggest-party-themes';
import { draftInvitationWording } from '@/ai/flows/draft-invitation-wording';
import { recommendPartyGames } from '@/ai/flows/recommend-party-games';

// Theme Suggester
const themeSchema = z.object({
  purpose: z.string().min(3, "Purpose must be at least 3 characters long."),
  ambiance: z.string().min(3, "Ambiance must be at least 3 characters long."),
});

type ThemeState = {
  themes?: string[];
  error?: string | null;
}

export async function getThemeSuggestions(prevState: ThemeState, formData: FormData): Promise<ThemeState> {
  const validatedFields = themeSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.purpose?.[0] || validatedFields.error.flatten().fieldErrors.ambiance?.[0],
    };
  }

  try {
    const result = await suggestPartyThemes(validatedFields.data);
    return { themes: result.themes };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get theme suggestions. Please try again." };
  }
}


// Invitation Drafter
const invitationSchema = z.object({
  eventName: z.string().min(1, "Event name is required."),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  location: z.string().min(1, "Location is required."),
  theme: z.string().optional(),
  purpose: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type InvitationState = {
    invitationWording?: string;
    error?: string | null;
}

export async function getInvitationDraft(prevState: InvitationState, formData: FormData): Promise<InvitationState> {
    const validatedFields = invitationSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { error: "Please fill out all required fields." };
    }

    try {
        const result = await draftInvitationWording(validatedFields.data);
        return { invitationWording: result.invitationWording };
    } catch (e) {
        console.error(e);
        return { error: "Failed to draft invitation. Please try again." };
    }
}


// Game Recommender
const gameSchema = z.object({
    theme: z.string().min(1, "Theme is required."),
    ageRange: z.string().min(1, "Age range is required."),
    numberOfGuests: z.coerce.number().min(1, "Number of guests must be at least 1."),
});

type GameRecommendation = { name: string; description: string };
type GameState = {
    recommendations?: GameRecommendation[];
    error?: string | null;
}

export async function getGameRecommendations(prevState: GameState, formData: FormData): Promise<GameState> {
    const validatedFields = gameSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
        return { error: "Please fill out all fields correctly." };
    }

    try {
        const result = await recommendPartyGames(validatedFields.data);
        return { recommendations: result.recommendations };
    } catch (e) {
        console.error(e);
        return { error: "Failed to get game recommendations. Please try again." };
    }
}
