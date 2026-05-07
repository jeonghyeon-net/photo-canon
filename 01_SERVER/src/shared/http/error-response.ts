import type { Context } from "hono";
import type { AppEnv } from "../../types/app-env";

export function notFound(c: Context<AppEnv>) {
  return c.json({ ok: false, error: { code: "NOT_FOUND", message: "Route not found" } }, 404);
}
