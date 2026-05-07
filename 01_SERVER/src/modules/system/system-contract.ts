import { z } from "zod";

export const pingBodySchema = z.object({
  message: z.string().min(1).max(200),
});
