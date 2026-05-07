import type { AuthenticatedIdentity } from "../auth/auth-token";

export const nicknameMinLength = 1;
export const nicknameMaxLength = 30;
export const nicknamePattern = /^(?!\.)(?!.*\.$)(?!.*\.\.)[a-z0-9._]+$/;

function stripInvalidCharacters(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9._]+/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, nicknameMaxLength)
    .replace(/\.+$/g, "");
}

export function normalizeNicknameInput(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidNickname(value: string): boolean {
  return value.length >= nicknameMinLength
    && value.length <= nicknameMaxLength
    && nicknamePattern.test(value);
}

export function initialNicknameFromIdentity(identity: AuthenticatedIdentity): string {
  const emailLocalPart = identity.email?.split("@")[0];
  const candidates = [emailLocalPart, identity.displayName, "user"];

  for (const candidate of candidates) {
    const nickname = stripInvalidCharacters(candidate ?? "");
    if (isValidNickname(nickname)) {
      return nickname;
    }
  }

  return "user";
}
