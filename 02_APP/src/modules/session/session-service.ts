import { createApiClient } from "../../shared/api/rpc-client";
import { getCurrentIdToken, signInWithGoogle, signOutCurrentUser } from "../../shared/firebase/firebase-auth";

async function requireIdToken(): Promise<string | null> {
  return getCurrentIdToken();
}

export async function loginWithGoogleAndLoadMember(): Promise<unknown> {
  await signInWithGoogle();
  return loadCurrentMember();
}

export async function loadCurrentMember(): Promise<unknown> {
  const token = await requireIdToken();
  if (!token) {
    return null;
  }

  const response = await createApiClient().api.v1.me.$get(
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.json();
}

export async function updateNickname(nickname: string): Promise<unknown> {
  const token = await requireIdToken();
  if (!token) {
    return null;
  }

  const response = await createApiClient().api.v1.me.$patch(
    { json: { nickname } },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.json();
}

export async function logout(): Promise<void> {
  await signOutCurrentUser();
}
