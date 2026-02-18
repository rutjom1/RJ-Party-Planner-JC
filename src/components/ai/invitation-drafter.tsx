"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getInvitationDraft } from "@/lib/actions/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, FileText } from "lucide-react";
import { AIOutput } from "./ai-output";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
      Draft README
    </Button>
  );
}

export function InvitationDrafter() {
  const initialState = { invitationWording: "", error: null };
  const [state, formAction] = useFormState(getInvitationDraft, initialState);
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>Provide the key details and let our AI write a README for you.</CardDescription>
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
                <Label htmlFor="projectName">Project Name</Label>
                <Input id="projectName" name="projectName" placeholder="e.g., My Awesome App" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea id="projectDescription" name="projectDescription" placeholder="A brief description of what your project does." required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="techStack">Tech Stack (Optional)</Label>
                <Input id="techStack" name="techStack" placeholder="e.g., Next.js, Tailwind CSS, Firebase" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Info (Optional)</Label>
                <Textarea id="additionalInfo" name="additionalInfo" placeholder="e.g., Installation instructions, how to contribute..." />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <AIOutput
        title="Your README Draft"
        description="Copy and paste this into your project's README.md file."
        isLoading={pending}
        hasRun={!!state.invitationWording || !!state.error}
        output={
            state.invitationWording ? (
                <p className="whitespace-pre-wrap text-foreground">{state.invitationWording}</p>
            ) : null
        }
      />
    </div>
  );
}
