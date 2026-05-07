import { z } from "zod";
import { AuthError } from "./auth-token";

const clockSkewSeconds = 60;
const maxSubjectLength = 128;

export const firebaseJwtHeaderSchema = z.object({
  alg: z.literal("RS256"),
  kid: z.string().min(1),
});

export const firebaseJwtPayloadSchema = z.object({
  aud: z.string().min(1),
  iss: z.string().min(1),
  exp: z.number().int(),
  iat: z.number().int(),
  auth_time: z.number().int(),
  sub: z.string().min(1).max(maxSubjectLength),
  email: z.string().email().optional(),
  email_verified: z.boolean().optional(),
  name: z.string().optional(),
  picture: z.string().url().optional(),
});

export type FirebaseJwtHeader = z.infer<typeof firebaseJwtHeaderSchema>;
export type FirebaseJwtPayload = z.infer<typeof firebaseJwtPayloadSchema>;

export function assertFirebaseClaims(payload: FirebaseJwtPayload, projectId: string): void {
  const now = Math.floor(Date.now() / 1000);

  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new AuthError("AUTH_INVALID_AUDIENCE", "Firebase token audience is invalid");
  }

  if (payload.exp <= now - clockSkewSeconds || payload.iat > now + clockSkewSeconds || payload.auth_time > now + clockSkewSeconds) {
    throw new AuthError("AUTH_TOKEN_EXPIRED", "Firebase token time claims are invalid");
  }
}
