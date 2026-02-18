"use server";

import { redirect } from 'next/navigation';
import { z } from 'zod';

const eventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters.'),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  theme: z.string().optional(),
});

export async function createEvent(prevState: any, formData: FormData) {
  const validatedFields = eventSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Invalid fields. Please check the form and correct any errors.",
    };
  }

  // In a real app, you'd save this to a database.
  // We'll just log it and simulate a delay.
  console.log("New Event Data:", validatedFields.data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  redirect('/dashboard');
}
