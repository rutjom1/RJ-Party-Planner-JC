'use client';
import { useDoc, useFirestore } from "@/firebase";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import { doc } from "firebase/firestore";
import { PartyEvent } from "@/lib/types";
import { useMemo } from "react";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  const eventRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, "events", params.id);
  }, [firestore, params.id]);
  const { data: event, loading } = useDoc<PartyEvent>(eventRef);

  if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  if (!event) {
    notFound();
  }

  const eventDate = new Date(event.date.replace(/-/g, '/'));

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
