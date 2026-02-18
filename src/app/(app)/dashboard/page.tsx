import { MOCK_EVENTS } from "@/lib/placeholder-data";
import { EventCard } from "@/components/events/event-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here are your upcoming parties and events.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_EVENTS.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
