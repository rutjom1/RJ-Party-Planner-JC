import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

type EventCardProps = {
  event: Project;
};

export function EventCard({ event }: EventCardProps) {
  const eventDate = event.startDate ? new Date(event.startDate.replace(/-/g, '/')) : null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <Image
          src={event.imageUrl}
          alt={event.name}
          data-ai-hint={event.imageHint}
          width={400}
          height={300}
          className="rounded-t-lg object-cover aspect-[4/3]"
        />
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-1">
        <CardTitle className="text-xl font-headline mb-2">{event.name}</CardTitle>
        {eventDate && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        )}
        <div className="flex-grow" />
        <Button asChild className="mt-auto">
          <Link href={`/events/${event.id}`}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
