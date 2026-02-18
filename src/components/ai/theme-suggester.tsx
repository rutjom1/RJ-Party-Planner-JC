"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getThemeSuggestions } from "@/lib/actions/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lightbulb, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AIOutput } from "./ai-output";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
      Suggest Ideas
    </Button>
  );
}

export function ThemeSuggester() {
  const initialState = { themes: [], error: null };
  const [state, formAction] = useFormState(getThemeSuggestions, initialState);
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Describe Your Project Idea</CardTitle>
          <CardDescription>Tell us a bit about your project, and we'll suggest some ideas.</CardDescription>
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
              <Input id="projectType" name="projectType" placeholder="e.g., SaaS, Mobile App, Open Source Tool" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectField">Field / Industry</Label>
              <Input id="projectField" name="projectField" placeholder="e.g., Fintech, Healthcare, Developer Tools" />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <AIOutput
        title="Suggested Project Ideas"
        description="Here are some creative ideas for your next project."
        isLoading={pending}
        hasRun={!!state.themes && state.themes.length > 0 || !!state.error}
        output={
          state.themes && state.themes.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside">
              {state.themes.map((theme, index) => (
                <li key={index} className="text-foreground">{theme}</li>
              ))}
            </ul>
          ) : null
        }
      />
    </div>
  );
}
