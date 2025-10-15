import { lens } from "@lensjs/express";
import consola from "consola";
import express from "express";
import { isProduction } from "std-env";
import { GlobalConfig } from "./config/index.js";
import { HTTP_STATUS } from "./shared/core/constants/http_status.js";

const app = express();
const PORT = GlobalConfig.port;

// Lens.js for Request & Response tracking
if (!isProduction) {
  await lens({ app });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req: express.Request, res: express.Response) => {
  res
    .status(HTTP_STATUS.ok)
    .json({ status: "ok", timestamp: new Date().toISOString() });
});

// Basic route
app.get("/", (_req: express.Request, res: express.Response) => {
  res.json({ message: "Express server is running!" });
});

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    consola.error("Unhandled error:", err);
    res
      .status(HTTP_STATUS.internalServerError)
      .json({ error: "Internal server error" });
  }
);

// 404 handler
app.use((_req: express.Request, res: express.Response) => {
  res.status(HTTP_STATUS.notFound).json({ error: "Not found" });
});

// Start server
app.listen(PORT, () => {
  consola.info(`${GlobalConfig.appInfo} is running on port ${PORT}`);
  consola.info(`Health check available at http://localhost:${PORT}/health`);
  if (!isProduction) {
    consola.info(`Lens available at http://localhost:${PORT}/lens`);
  }
});
