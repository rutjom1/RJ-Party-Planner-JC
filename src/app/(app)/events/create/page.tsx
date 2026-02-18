import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function CreateEventPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-4xl font-headline">Create a New Event</CardTitle>
                    <CardDescription>This is where the magic begins. Plan your next unforgettable event.</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>Our event creation form is currently under construction.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Soon, you'll be able to enter all your party details here. Stay tuned!</p>
                </CardContent>
            </Card>
        </div>
    );
}
