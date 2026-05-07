const publicKeysUrl = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

type FirebaseJwk = JsonWebKey & {
  kid: string;
};

type PublicKeyCache = {
  expiresAt: number;
  keys: Record<string, CryptoKey>;
};

let publicKeyCache: PublicKeyCache | undefined;

function maxAgeFrom(response: Response): number {
  const cacheControl = response.headers.get("cache-control") ?? "";
  const match = /max-age=(\d+)/.exec(cacheControl);
  return match ? Number(match[1]) : 3600;
}

async function importJwk(jwk: FirebaseJwk): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
}

async function fetchJwks(): Promise<{ maxAge: number; keys: FirebaseJwk[] }> {
  const cached = await caches.default.match(publicKeysUrl);
  if (cached) {
    const body = await cached.json<{ keys: FirebaseJwk[] }>();
    return { maxAge: 60, keys: body.keys };
  }

  const response = await fetch(publicKeysUrl);
  if (!response.ok) {
    throw new Error("Failed to load Firebase public keys");
  }

  await caches.default.put(publicKeysUrl, response.clone());
  const body = await response.json<{ keys: FirebaseJwk[] }>();
  return { maxAge: maxAgeFrom(response), keys: body.keys };
}

export async function getFirebasePublicKey(kid: string): Promise<CryptoKey | undefined> {
  const now = Date.now();
  if (publicKeyCache && publicKeyCache.expiresAt > now && publicKeyCache.keys[kid]) {
    return publicKeyCache.keys[kid];
  }

  const { maxAge, keys } = await fetchJwks();
  const entries = await Promise.all(keys.map(async (jwk) => [jwk.kid, await importJwk(jwk)]));

  publicKeyCache = {
    expiresAt: now + maxAge * 1000,
    keys: Object.fromEntries(entries),
  };

  return publicKeyCache.keys[kid];
}
