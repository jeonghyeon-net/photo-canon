import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { authenticateRequest } from "../auth/auth-service";
import { AuthError } from "../auth/auth-token";
import { updateMemberSchema } from "./member-contract";
import { getOrCreateActiveMember, MemberAccessError, updateActiveMember } from "./member-service";
import type { AppEnv } from "../../types/app-env";

const memberRoutes = new Hono<AppEnv>()
  .get("/api/v1/me", async (c) => {
    try {
      const identity = await authenticateRequest(c.req.raw, c.env);
      const member = await getOrCreateActiveMember(c.env.DB, identity);
      return c.json({ ok: true, data: member }, 200);
    } catch (error) {
      if (error instanceof AuthError) {
        return c.json({ ok: false, error: { code: error.code, message: error.message } }, 401);
      }
      if (error instanceof MemberAccessError) {
        return c.json({ ok: false, error: { code: error.code, message: error.message } }, 403);
      }
      throw error;
    }
  })
  .patch("/api/v1/me", zValidator("json", updateMemberSchema, (result, c) => {
    if (!result.success) {
      return c.json({ ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid nickname" } }, 400);
    }
  }), async (c) => {
    try {
      const identity = await authenticateRequest(c.req.raw, c.env);
      const member = await updateActiveMember(c.env.DB, identity, c.req.valid("json"));
      return c.json({ ok: true, data: member }, 200);
    } catch (error) {
      if (error instanceof AuthError) {
        return c.json({ ok: false, error: { code: error.code, message: error.message } }, 401);
      }
      if (error instanceof MemberAccessError) {
        return c.json({ ok: false, error: { code: error.code, message: error.message } }, 403);
      }
      throw error;
    }
  });

export default memberRoutes;
