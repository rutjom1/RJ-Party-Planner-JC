"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getGameRecommendations } from "@/lib/actions/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Puzzle } from "lucide-react";
import { AIOutput } from "./ai-output";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Puzzle className="mr-2 h-4 w-4" />}
      Recommend Games
    </Button>
  );
}

export function GameRecommender() {
  const initialState = { recommendations: [], error: null };
  const [state, formAction] = useFormState(getGameRecommendations, initialState);
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Party Details</CardTitle>
          <CardDescription>Tell us about your party to get tailored game recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="theme">Party Theme</Label>
              <Input id="theme" name="theme" placeholder="e.g., Pirate Adventure" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageRange">Guest Age Range</Label>
              <Input id="ageRange" name="ageRange" placeholder="e.g., 5-10 years, Adults" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfGuests">Number of Guests</Label>
              <Input id="numberOfGuests" name="numberOfGuests" type="number" placeholder="e.g., 15" required />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <AIOutput
        title="Game Recommendations"
        description="Fun activities perfectly suited for your event."
        isLoading={pending}
        hasRun={!!state.recommendations && state.recommendations.length > 0 || !!state.error}
        output={
            state.recommendations && state.recommendations.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {state.recommendations.map((game, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{game.name}</AccordionTrigger>
                            <AccordionContent>
                                {game.description}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : null
        }
      />
    </div>
  );
}
