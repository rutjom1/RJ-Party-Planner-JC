import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Memoized instances
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;

function initializeFirebase() {
  if (typeof window === 'undefined') {
    return { app: null, auth: null, firestore: null };
  }

  if (!app) {
    const apps = getApps();
    if (apps.length > 0) {
      app = apps[0];
    } else {
      // This will throw if the config is not set.
      // The user will be prompted to add it.
      app = initializeApp(firebaseConfig);
    }
    auth = getAuth(app);
    firestore = getFirestore(app);
  }

  return { app, auth, firestore };
}

export { initializeFirebase };
export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './client-provider';
