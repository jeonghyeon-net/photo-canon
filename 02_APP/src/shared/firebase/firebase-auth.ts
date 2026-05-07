import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type Auth, type User } from "firebase/auth";
import { getFirebaseApp } from "./firebase-app";

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export async function waitForCurrentUser(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    return auth.currentUser;
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
  return result.user;
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}

export async function getCurrentIdToken(): Promise<string | null> {
  const user = await waitForCurrentUser();
  return user ? user.getIdToken() : null;
}
