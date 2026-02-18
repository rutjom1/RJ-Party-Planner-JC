"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile, type User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Create Account
    </Button>
  );
}

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    setError(null);
    if (!auth || !firestore) {
        setError("Auth/Firestore service not available.");
        setIsSubmitting(false);
        return;
    }

    let user: User | null = null;

    try {
      // 1. Create user in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      user = userCredential.user;
      
      // 2. Update Auth display name
      await updateProfile(user, { displayName: values.name });

      // 3. Create user profile document in Firestore
      const userProfileData = {
        name: values.name,
        email: values.email,
        avatarUrl: user.photoURL || null
      };
      
      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, userProfileData);

      // 4. Redirect to dashboard on complete success
      router.push('/dashboard');

    } catch (e: any) {
        let errorMessage = e.message;
        
        if (e.code === 'auth/email-already-in-use') {
          errorMessage = 'This email address is already in use. Please try another one.';
        } 
        else if (e.name === 'FirebaseError' && e.code === 'permission-denied' && user) {
            // Firestore permission error after user was created.
            const userProfileData = {
                name: values.name,
                email: values.email,
                avatarUrl: user.photoURL || null
            };
            const permissionError = new FirestorePermissionError({
                path: `users/${user.uid}`,
                operation: 'create',
                requestResourceData: userProfileData,
            });
            errorEmitter.emit('permission-error', permissionError);
            errorMessage = permissionError.message; // Use the more detailed message
        }
        
        setError(errorMessage);
        setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Registration Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" {...field} />
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
