"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const eventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters.'),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  theme: z.string().optional(),
});

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CalendarPlus className="mr-2 h-4 w-4" />}
      Create Event
    </Button>
  );
}

export function EventForm() {
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof eventSchema>>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: '',
            date: '',
            time: '',
            location: '',
            description: '',
            theme: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof eventSchema>) => {
        setIsSubmitting(true);
        setError(null);
        
        if (!firestore) {
            setError("Database connection not available.");
            setIsSubmitting(false);
            return;
        }

        const randomImage = PlaceHolderImages[Math.floor(Math.random() * 4)];
        const newEvent = {
            ...values,
            imageUrl: randomImage.imageUrl,
            imageHint: randomImage.imageHint,
        };

        try {
            const eventCollection = collection(firestore, 'events');
            const docRef = await addDoc(eventCollection, newEvent);
            
            toast({
                title: "Event Created!",
                description: `${values.name} has been successfully created.`,
            });
            router.push(`/events/${docRef.id}`);
        } catch (e: any) {
            const permissionError = new FirestorePermissionError({
              path: 'events',
              operation: 'create',
              requestResourceData: newEvent,
            });
            errorEmitter.emit('permission-error', permissionError);
            setError("There was an error creating your event. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Creating Event</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Summer Soiree" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123 Party Lane" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Tropical Luau" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your event..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
