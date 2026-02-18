import { EventForm } from "@/components/events/event-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CreateEventPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-headline">Create a New Project</CardTitle>
                <CardDescription>This is where your next big idea begins. Plan your new tech project.</CardDescription>
            </CardHeader>
            <CardContent>
                <EventForm />
            </CardContent>
        </Card>
    );
}
