'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.toContextObject());
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'You do not have permission to perform this action.',
        duration: process.env.NODE_ENV === 'development' ? 20000 : 5000,
      });
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null;
}
