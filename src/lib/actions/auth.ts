"use server";

import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});


export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Invalid fields provided.",
    };
  }

  // In a real app, you'd validate credentials against a database
  await new Promise(resolve => setTimeout(resolve, 1000));

  redirect('/dashboard');
}


export async function signup(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      error: "Invalid fields provided.",
    };
  }
  
  // In a real app, you'd create a new user in the database
  await new Promise(resolve => setTimeout(resolve, 1000));

  redirect('/dashboard');
}
