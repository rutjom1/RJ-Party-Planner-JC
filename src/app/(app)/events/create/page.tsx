import { EventForm } from "@/components/events/event-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function CreateEventPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-4xl font-headline">Create a New Event</CardTitle>
                <CardDescription>This is where the magic begins. Plan your next unforgettable event.</CardDescription>
            </CardHeader>
            <CardContent>
                <EventForm />
            </CardContent>
        </Card>
    );
}
