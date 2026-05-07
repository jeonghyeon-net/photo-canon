import { z } from "zod";
import { decodeBase64Url, decodeBase64UrlJson } from "./base64-url";
import { AuthError, type AuthenticatedIdentity } from "./auth-token";
import { assertFirebaseClaims, firebaseJwtHeaderSchema, firebaseJwtPayloadSchema } from "./firebase-token-policy";
import { getFirebasePublicKey } from "./firebase-public-keys";

function parseJwtPart<T>(schema: z.ZodType<T>, value: string, code: string, message: string): T {
  try {
    return schema.parse(decodeBase64UrlJson<unknown>(value));
  } catch {
    throw new AuthError(code, message);
  }
}

export async function verifyFirebaseIdToken(token: string, projectId: string): Promise<AuthenticatedIdentity> {
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new AuthError("AUTH_INVALID_TOKEN", "Firebase token must be a JWT");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJwtPart(firebaseJwtHeaderSchema, encodedHeader, "AUTH_INVALID_HEADER", "Firebase token header is invalid");
  const payload = parseJwtPart(firebaseJwtPayloadSchema, encodedPayload, "AUTH_INVALID_PAYLOAD", "Firebase token payload is invalid");
  const publicKey = await getFirebasePublicKey(header.kid);

  if (!publicKey) {
    throw new AuthError("AUTH_UNKNOWN_KEY", "Firebase token key is unknown");
  }

  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    decodeBase64Url(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );

  if (!valid) {
    throw new AuthError("AUTH_INVALID_SIGNATURE", "Firebase token signature is invalid");
  }

  assertFirebaseClaims(payload, projectId);

  return {
    provider: "firebase",
    subject: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified === true,
    displayName: payload.name,
    avatarUrl: payload.picture,
  };
}
