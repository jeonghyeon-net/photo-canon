export type AuthenticatedIdentity = {
  provider: "firebase";
  subject: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  avatarUrl?: string;
};

export class AuthError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

export function readBearerToken(request: Request): string {
  const authorization = request.headers.get("authorization") ?? "";
  const parts = authorization.trim().split(/\s+/);
  const [scheme, token] = parts;

  if (parts.length !== 2 || scheme.toLowerCase() !== "bearer" || !token) {
    throw new AuthError("AUTH_MISSING_TOKEN", "Bearer token is required");
  }

  return token;
}
