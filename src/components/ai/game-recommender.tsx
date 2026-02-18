"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getGameRecommendations } from "@/lib/actions/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Cpu } from "lucide-react";
import { AIOutput } from "./ai-output";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cpu className="mr-2 h-4 w-4" />}
      Suggest Tech Stacks
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
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Tell us about your project to get tech stack recommendations.</CardDescription>
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
              <Label htmlFor="projectType">Project Type</Label>
              <Input id="projectType" name="projectType" placeholder="e.g., Web App, Mobile App, Data Science" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Team Experience Level</Label>
              <Input id="experienceLevel" name="experienceLevel" placeholder="e.g., Beginner, Intermediate, Expert" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input id="teamSize" name="teamSize" type="number" placeholder="e.g., 5" required />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <AIOutput
        title="Tech Stack Recommendations"
        description="Technologies perfectly suited for your project."
        isLoading={pending}
        hasRun={!!state.recommendations && state.recommendations.length > 0 || !!state.error}
        output={
            state.recommendations && state.recommendations.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {state.recommendations.map((tech, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>{tech.name}</AccordionTrigger>
                            <AccordionContent>
                                {tech.description}
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
