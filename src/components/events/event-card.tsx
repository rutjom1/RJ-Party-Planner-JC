import Link from "next/link";
import Image from "next/image";
import type { Event } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

type EventCardProps = {
  event: Event;
};

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-0">
        <Image
          src={event.image.url}
          alt={event.image.alt}
          data-ai-hint={event.image.hint}
          width={400}
          height={300}
          className="rounded-t-lg object-cover aspect-[4/3]"
        />
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-1">
        <CardTitle className="text-xl font-headline mb-2">{event.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
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
