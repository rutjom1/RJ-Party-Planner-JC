import { MOCK_EVENTS } from "@/lib/placeholder-data";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = MOCK_EVENTS.find(e => e.id === params.id);

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-headline">{event.name}</CardTitle>
          <CardDescription className="text-lg">{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <span className="text-foreground">{event.location}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Event chat, guest list, and task management features are being planned!</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Check back later to manage all aspects of your party right from this page.</p>
        </CardContent>
      </Card>
    </div>
  );
}
