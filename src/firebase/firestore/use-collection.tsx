'use client';
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  Query,
  DocumentData,
  QuerySnapshot,
  FirestoreError,
  CollectionReference,
} from 'firebase/firestore';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseCollectionOptions<T> {
  idField?: string;
  snapshotListenOptions?: { includeMetadataChanges: boolean };
}

export function useCollection<T>(
  queryOrRef: Query | CollectionReference | null,
  options?: UseCollectionOptions<T>
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const idField = options?.idField || 'id';

  useEffect(() => {
    if (!queryOrRef) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      queryOrRef,
      { includeMetadataChanges: options?.snapshotListenOptions?.includeMetadataChanges },
      (snapshot: QuerySnapshot<DocumentData>) => {
        const docs = snapshot.docs.map(doc => ({
          ...doc.data(),
          [idField]: doc.id,
        })) as T[];
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
          path: (queryOrRef as any)._query?.path?.canonical ?? 'unknown path',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [queryOrRef, idField, options?.snapshotListenOptions]);

  return { data, loading, error };
}
