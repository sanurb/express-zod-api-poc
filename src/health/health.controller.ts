import { defaultEndpointsFactory } from "express-zod-api";
import z from "zod";

export const healthEndpoint = defaultEndpointsFactory.build({
  method: "get",
  tag: "system",
  shortDescription: "Health check",
  description: "Returns the current status and timestamp of the API server",
  input: z.object({}),
  output: z.object({
    status: z.literal("ok"),
    timestamp: z.string(),
  }),
  handler: async () => ({
    status: "ok" as const,
    timestamp: new Date().toISOString(),
  }),
});
