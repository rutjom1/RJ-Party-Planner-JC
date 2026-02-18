'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseDocOptions<T> {
  idField?: string;
  snapshotListenOptions?: { includeMetadataChanges: boolean };
}

export function useDoc<T>(
  docRef: DocumentReference | null,
  options?: UseDocOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const idField = options?.idField || 'id';


  useEffect(() => {
    if (!docRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      docRef,
      { includeMetadataChanges: options?.snapshotListenOptions?.includeMetadataChanges },
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          setData({
            ...snapshot.data(),
            [idField]: snapshot.id,
          } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef, idField, options?.snapshotListenOptions]);

  return { data, loading, error };
}
