'use client';
import { useFirestore, useCollection } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { EventCard } from "@/components/events/event-card";
import { Project } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

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
    
    const eventsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "events"));
    }, [firestore]);
    const { data: projects, loading } = useCollection<Project>(eventsQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">Here are your ongoing projects.</p>
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
        </div>
      )}

      {!loading && projects && projects.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
            <EventCard key={project.id} event={project} />
            ))}
        </div>
      )}

      {!loading && (!projects || projects.length === 0) && (
        <div className="text-center py-12">
            <h3 className="text-2xl font-semibold">No Projects Yet</h3>
            <p className="text-muted-foreground mt-2">You haven't created any projects. Let's create your first one!</p>
            <Button asChild className="mt-4">
                <Link href="/events/create">Create New Project</Link>
            </Button>
        </div>
      )}

    </div>
  );
}
