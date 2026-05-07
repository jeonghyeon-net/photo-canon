import { Hono } from "hono";
import memberRoutes from "../modules/member/member-routes";
import systemRoutes from "../modules/system/system-routes";
import { corsMiddleware } from "../shared/http/cors-middleware";
import { notFound } from "../shared/http/error-response";
import type { AppEnv } from "../types/app-env";

const appShell = new Hono<AppEnv>();

appShell.use("*", corsMiddleware);

export const app = appShell.route("/", systemRoutes).route("/", memberRoutes).notFound(notFound);
export type AppType = typeof app;
