'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, FirestoreError } from 'firebase/firestore';
import { useAuth, useFirestore } from '../provider';
import type { UserProfile } from '@/lib/types'; // Assuming UserProfile is the correct type

interface UseUserHook {
  user: (UserProfile & { uid: string }) | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UseUserHook {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<(UserProfile & { uid: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firestore) {
        const userRef = doc(firestore, 'users', firebaseUser.uid);
        const unsubscribeFirestore = onSnapshot(
          userRef,
          (doc) => {
            if (doc.exists()) {
              setUser({
                uid: firebaseUser.uid,
                ...doc.data(),
              } as UserProfile & { uid: string });
            } else {
              // This case can happen if user profile creation fails after signup
              // We can create a local representation of the user
               setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                avatarUrl: firebaseUser.photoURL,
              } as UserProfile & { uid: string });
            }
            setLoading(false);
          },
          (err: FirestoreError) => {
            console.error("Error fetching user profile:", err);
            setError(err);
            setLoading(false);
          }
        );
        return () => unsubscribeFirestore();
      } else {
        setUser(null);
        setLoading(false);
      }
    }, (err) => {
        console.error("Auth state change error:", err);
        setError(err);
        setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  return { user, loading, error };
}
