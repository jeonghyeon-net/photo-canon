import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { readFirebaseConfig } from "./firebase-config";

export function getFirebaseApp(): FirebaseApp {
  return getApps()[0] ?? initializeApp(readFirebaseConfig());
}
