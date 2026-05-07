import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { pingBodySchema } from "./system-contract";
import { checkDatabase } from "./system-service";
import type { AppEnv } from "../../types/app-env";

const systemRoutes = new Hono<AppEnv>()
  .get("/health", (c) => c.json({ ok: true, service: "photo-canon-server" }, 200))
  .get("/api/v1/db/health", async (c) => {
    const ok = await checkDatabase(c.env.DB);
    return c.json({ ok, database: "D1" }, 200);
  })
  .post("/api/v1/ping", zValidator("json", pingBodySchema), (c) => {
    return c.json({ ok: true, data: c.req.valid("json") }, 200);
  });

export default systemRoutes;
