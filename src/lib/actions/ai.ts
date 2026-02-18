"use server";

import { z } from 'zod';
import { suggestPartyThemes } from '@/ai/flows/suggest-party-themes';
import { draftInvitationWording } from '@/ai/flows/draft-invitation-wording';
import { recommendPartyGames } from '@/ai/flows/recommend-party-games';

// Project Idea Suggester
const themeSchema = z.object({
  projectType: z.string().min(3, "Project type must be at least 3 characters long."),
  projectField: z.string().min(3, "Field/Industry must be at least 3 characters long."),
});

type ThemeState = {
  themes?: string[];
  error?: string | null;
}

export async function getThemeSuggestions(prevState: ThemeState, formData: FormData): Promise<ThemeState> {
  const validatedFields = themeSchema.safeParse({
    projectType: formData.get('projectType'),
    projectField: formData.get('projectField'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.projectType?.[0] || validatedFields.error.flatten().fieldErrors.projectField?.[0],
    };
  }

  try {
    // Note: AI flow is still for party themes, but we're passing project-related data.
    const result = await suggestPartyThemes({ purpose: validatedFields.data.projectType, ambiance: validatedFields.data.projectField});
    return { themes: result.themes };
  } catch (e) {
    console.error(e);
    return { error: "Failed to get project ideas. Please try again." };
  }
}


// README Drafter
const invitationSchema = z.object({
  projectName: z.string().min(1, "Project name is required."),
  projectDescription: z.string().min(1, "Project description is required."),
  techStack: z.string().optional(),
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
        // Note: AI flow is still for invitations, but we're passing README-related data.
        const result = await draftInvitationWording({
            eventName: validatedFields.data.projectName,
            purpose: validatedFields.data.projectDescription,
            theme: validatedFields.data.techStack,
            additionalInfo: validatedFields.data.additionalInfo,
            date: '',
            time: '',
            location: ''
        });
        return { invitationWording: result.invitationWording };
    } catch (e) {
        console.error(e);
        return { error: "Failed to draft README. Please try again." };
    }
}


// Tech Stack Recommender
const gameSchema = z.object({
    projectType: z.string().min(1, "Project type is required."),
    experienceLevel: z.string().min(1, "Experience level is required."),
    teamSize: z.coerce.number().min(1, "Team size must be at least 1."),
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
        // Note: AI flow is still for games, but we're passing tech stack related data.
        const result = await recommendPartyGames({
            theme: validatedFields.data.projectType,
            ageRange: validatedFields.data.experienceLevel,
            numberOfGuests: validatedFields.data.teamSize,
        });
        return { recommendations: result.recommendations };
    } catch (e) {
        console.error(e);
        return { error: "Failed to get tech stack recommendations. Please try again." };
    }
}
