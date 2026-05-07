import { cors } from "hono/cors";

const fallbackOrigins = ["http://localhost:5173", "http://localhost", "capacitor://localhost"];

function parseOrigins(value: string | undefined): string[] {
  return value
    ? value.split(",").map((origin) => origin.trim()).filter(Boolean)
    : fallbackOrigins;
}

export const corsMiddleware = cors({
  origin: (origin, c) => {
    const allowedOrigins = parseOrigins(c.env.CORS_ORIGIN);
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "OPTIONS"],
  maxAge: 600,
});
