"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2, FolderPlus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters.'),
  startDate: z.string().min(1, "Start date is required."),
  repoUrl: z.string().url('Please enter a valid repository URL.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  techStack: z.string().optional(),
});

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FolderPlus className="mr-2 h-4 w-4" />}
      Create Project
    </Button>
  );
}

export function EventForm() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const firestore = useFirestore();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            startDate: '',
            repoUrl: '',
            description: '',
            techStack: '',
        },
    });

    const onSubmit = (values: z.infer<typeof projectSchema>) => {
        startTransition(async () => {
            setError(null);
            
            if (!firestore) {
                setError("Database connection not available.");
                return;
            }

            const randomImage = PlaceHolderImages[Math.floor(Math.random() * 4)];
            const newProject = {
                ...values,
                imageUrl: randomImage.imageUrl,
                imageHint: randomImage.imageHint,
            };

            try {
                const eventCollection = collection(firestore, 'events');
                const docRef = await addDoc(eventCollection, newProject);
                
                toast({
                    title: "Project Created!",
                    description: `${values.name} has been successfully created.`,
                });
                router.push(`/events/${docRef.id}`);
            } catch (e: any) {
                const permissionError = new FirestorePermissionError({
                  path: 'events',
                  operation: 'create',
                  requestResourceData: newProject,
                });
                errorEmitter.emit('permission-error', permissionError);
                setError("There was an error creating your project. Please try again.");
            }
        });
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Creating Project</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., My Awesome App" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tech Stack (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Next.js, Firebase" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="repoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repository URL</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://github.com/user/repo" {...field} />
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
                <Textarea placeholder="Tell us about your project..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isSubmitting={isPending} />
      </form>
    </Form>
  );
}
