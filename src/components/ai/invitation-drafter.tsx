"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getInvitationDraft } from "@/lib/actions/ai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { AIOutput } from "./ai-output";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
      Draft Invitation
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
          <CardTitle>Invitation Details</CardTitle>
          <CardDescription>Provide the key details and let our AI write the invitation for you.</CardDescription>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input id="eventName" name="eventName" placeholder="e.g., Summer Soiree" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme (Optional)</Label>
                <Input id="theme" name="theme" placeholder="e.g., Tropical Luau" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" name="date" type="date" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" name="time" type="time" required/>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="123 Party Lane" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Info (Optional)</Label>
                <Textarea id="additionalInfo" name="additionalInfo" placeholder="e.g., Dress code, RSVP by..." />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <AIOutput
        title="Your Invitation Draft"
        description="Copy and paste this into your invitations."
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
