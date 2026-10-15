import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  firestoreDatabaseId?: string;
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let isConfigured = false;

// Check if user has saved custom config in localStorage
export function getStoredFirebaseConfig(): FirebaseCustomConfig | null {
  try {
    const raw = localStorage.getItem('info_college_firebase_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading custom firebase config', e);
  }
  return null;
}

export function saveStoredFirebaseConfig(config: FirebaseCustomConfig | null) {
  if (!config) {
    localStorage.removeItem('info_college_firebase_config');
    isConfigured = false;
    firebaseApp = null;
    firestoreDb = null;
    firebaseAuth = null;
    return;
  }
  localStorage.setItem('info_college_firebase_config', JSON.stringify(config));
  initFirebaseWithConfig(config);
}

export function initFirebaseWithConfig(config: FirebaseCustomConfig): boolean {
  try {
    if (!config.apiKey || !config.projectId) {
      return false;
    }
    const appName = 'INFO_COLLEGE_FIREBASE_APP';
    const existing = getApps().find(a => a.name === appName);
    if (existing) {
      firebaseApp = existing;
    } else {
      firebaseApp = initializeApp(config, appName);
    }
    
    firestoreDb = getFirestore(firebaseApp, config.firestoreDatabaseId || '(default)');
    firebaseAuth = getAuth(firebaseApp);
    isConfigured = true;
    return true;
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    isConfigured = false;
    return false;
  }
}

// Auto-try initializing stored config
const stored = getStoredFirebaseConfig();
if (stored) {
  initFirebaseWithConfig(stored);
}

export function getIsFirebaseConfigured(): boolean {
  return isConfigured && firestoreDb !== null && firebaseAuth !== null;
}

export function getDb(): Firestore | null {
  return firestoreDb;
}

export function getFirebaseAuth(): Auth | null {
  return firebaseAuth;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = firebaseAuth;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid,
      email: currentAuth?.currentUser?.email,
      emailVerified: currentAuth?.currentUser?.emailVerified,
      isAnonymous: currentAuth?.currentUser?.isAnonymous,
      tenantId: currentAuth?.currentUser?.tenantId,
      providerInfo: currentAuth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  if (!firestoreDb) {
    return { success: false, message: 'Firebase is not initialized.' };
  }
  try {
    await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
    return { success: true, message: 'Connected to Firestore successfully.' };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      return { success: false, message: 'Firestore client is offline. Check network and rules.' };
    }
    if (error?.code === 'permission-denied') {
      // Permission denied still verifies that firestore server was reached
      return { success: true, message: 'Firestore reached (Security rules active).' };
    }
    return { success: false, message: error?.message || 'Connection failed.' };
  }
}
