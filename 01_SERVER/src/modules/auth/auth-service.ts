import { readBearerToken, type AuthenticatedIdentity } from "./auth-token";
import { verifyFirebaseIdToken } from "./firebase-token-verifier";

export async function authenticateRequest(request: Request, env: Env): Promise<AuthenticatedIdentity> {
  const token = readBearerToken(request);
  return verifyFirebaseIdToken(token, env.FIREBASE_PROJECT_ID);
}
