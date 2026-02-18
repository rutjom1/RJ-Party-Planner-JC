'use client';
import { useFirestore, useCollection } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { EventCard } from "@/components/events/event-card";
import { PartyEvent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function EventSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-[265px] w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const firestore = useFirestore();
    
    const eventsQuery = firestore ? query(collection(firestore, "events")) : null;
    const { data: events, loading } = useCollection<PartyEvent>(eventsQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here are your upcoming parties and events.</p>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
        </div>
      )}

      {!loading && events && events.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
            <EventCard key={event.id} event={event} />
            ))}
        </div>
      )}

      {!loading && (!events || events.length === 0) && (
        <div className="text-center py-12">
            <h3 className="text-2xl font-semibold">No Events Yet</h3>
            <p className="text-muted-foreground mt-2">You haven't created any events. Let's plan your first party!</p>
            <Button asChild className="mt-4">
                <Link href="/events/create">Create New Event</Link>
            </Button>
        </div>
      )}

    </div>
  );
}
