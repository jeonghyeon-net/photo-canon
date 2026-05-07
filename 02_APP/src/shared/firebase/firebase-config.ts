export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

function readRequiredEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key]?.trim();
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
}

export function readFirebaseConfig(): FirebaseClientConfig {
  return {
    apiKey: readRequiredEnv("VITE_FIREBASE_API_KEY"),
    authDomain: readRequiredEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readRequiredEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readRequiredEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readRequiredEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readRequiredEnv("VITE_FIREBASE_APP_ID"),
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
}
