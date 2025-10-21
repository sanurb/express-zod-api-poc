/**
 * @fileoverview
 * Main server entry point using express-zod-api with vertical slicing architecture.
 * Implements screaming architecture with clean separation of concerns.
 */

import { apiReference } from "@scalar/express-api-reference";
import consola from "consola";
import {
  createConfig,
  createServer,
  Documentation,
  defaultEndpointsFactory,
} from "express-zod-api";
import { isProduction } from "std-env";
import { z } from "zod";
import { catRoutes } from "./cats/routes.js";
import { GlobalConfig } from "./config/index.js";
import { healthEndpoint } from "./health/health.controller.js";

/**
 * Express Zod API server configuration.
 * Provides comprehensive API setup with validation, CORS, and logging.
 */
export const config = createConfig({
  http: {
    listen: GlobalConfig.port,
  },
  cors: true,
  compression: true,
  logger: {
    level: isProduction ? "info" : "debug",
    color: !isProduction,
  },
  ...(isProduction
    ? {}
    : {
        logger: {
          level: "debug",
          color: true,
        },
      }),
  // Scalar API documentation integration
  beforeRouting: ({ app, getLogger }) => {
    const logger = getLogger();
    logger.info("Serving the API reference at /docs");

    // Generate OpenAPI documentation
    const documentation = new Documentation({
      routing,
      config,
      version: "1.0.0",
      title: "Cat Management API",
      serverUrl: `http://localhost:${GlobalConfig.port}`,
      composition: "components",
      tags: {
        cats: {
          description: "Cat management endpoints for CRUD operations",
          url: "https://github.com/sanurb/typescript-node-esm-skeleton",
        },
        system: {
          description: "System health and information endpoints",
        },
      },
    });

    app.use(
      "/docs",
      apiReference({
        content: documentation.getSpecAsJson(),
      })
    );
  },
});

/**
 * Root endpoint using express-zod-api.
 */
const rootEndpoint = defaultEndpointsFactory.build({
  method: "get",
  tag: "system",
  shortDescription: "API information",
  description: "Returns information about the API and available endpoints",
  input: z.object({}),
  output: z.object({
    message: z.string(),
    version: z.string(),
    endpoints: z.array(z.string()),
  }),
  handler: async () => ({
    message: "Express Zod API Server is running!",
    version: "1.0.0",
    endpoints: [
      "GET /api/v1/health - Health check",
      "GET /api/v1/cats - List all cats",
      "POST /api/v1/cats - Create a new cat",
      "GET /api/v1/cats/:id - Get a specific cat",
      "PUT /api/v1/cats/:id - Update a specific cat",
      "DELETE /api/v1/cats/:id - Delete a specific cat",
    ],
  }),
});

/**
 * API routing configuration with vertical slicing.
 * Implements screaming architecture by organizing routes by feature.
 */
export const routing = {
  // Root endpoint
  "": rootEndpoint,

  // API versioning
  "api/v1": {
    // Health check endpoint
    health: healthEndpoint,

    // Cat feature routes
    ...catRoutes,
  },
};

/**
 * Start the Express Zod API server.
 * Provides comprehensive API with automatic validation and documentation.
 */
const startServer = async () => {
  try {
    consola.info("Starting Express Zod API server...");

    // Create and start the server
    const server = await createServer(config, routing);

    consola.success(
      `${GlobalConfig.appInfo} is running on port ${GlobalConfig.port}`
    );
    consola.info(
      `API Documentation available at http://localhost:${GlobalConfig.port}/docs`
    );
    consola.info(
      `API endpoints available at http://localhost:${GlobalConfig.port}/api/v1`
    );
    consola.info(
      `Health check available at http://localhost:${GlobalConfig.port}/api/v1/health`
    );

    if (!isProduction) {
      consola.info(
        `Lens available at http://localhost:${GlobalConfig.port}/lens`
      );
    }

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      consola.info(`Received ${signal}. Starting graceful shutdown...`);

      // Close all servers
      for (const serverInstance of server.servers) {
        serverInstance.close();
      }

      consola.info("Server closed successfully");
      process.exit(0);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    consola.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
