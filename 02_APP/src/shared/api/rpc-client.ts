import { hc } from "hono/client";
import type { AppType } from "photo-canon-server/rpc";
import { resolveApiBaseUrl } from "./api-base-url";

export type ApiClient = ReturnType<typeof hc<AppType>>;

export function createApiClient(baseUrl = resolveApiBaseUrl()): ApiClient {
  return hc<AppType>(baseUrl);
}
