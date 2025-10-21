/**
 * @fileoverview
 * Documentation generation script.
 * Implements clean script structure with proper error handling.
 */

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import consola from "consola";
import { createConfig, defaultEndpointsFactory } from "express-zod-api";
import { z } from "zod";
import { catRoutes } from "../cats/routes.js";
import { GlobalConfig } from "../config/index.js";
import { DocumentationGenerator } from "../docs/generator.js";
import { healthEndpoint } from "../health/health.controller.js";

/**
 * Root endpoint for documentation.
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
 * API routing configuration for documentation.
 */
const routing = {
  "": rootEndpoint,
  "api/v1": {
    health: healthEndpoint,
    ...catRoutes,
  },
};

/**
 * Server configuration for documentation.
 */
const config = createConfig({
  http: {
    listen: GlobalConfig.port,
  },
  cors: true,
  compression: true,
  logger: {
    level: "info",
    color: false,
  },
});

/**
 * Main documentation generation function.
 * Implements clean error handling and user feedback.
 */
const generateDocumentation = async (): Promise<void> => {
  try {
    consola.info("Starting documentation generation...");

    // Ensure docs directory exists
    const docsDir = "docs";
    await mkdir(docsDir, { recursive: true });

    // Create documentation generator
    const generator = new DocumentationGenerator({
      version: "1.0.0",
      title: "Cat Management API",
      serverUrl: "http://localhost:3000",
      composition: "components",
      outputDir: docsDir,
    });

    // Generate complete documentation
    await generator.generateAll(routing, config);

    consola.success("Documentation generation completed successfully!");
    consola.info(
      `Documentation files written to: ${join(process.cwd(), docsDir)}`
    );
  } catch (error) {
    consola.error(
      "Failed to generate documentation:",
      (error as Error).message
    );
    process.exit(1);
  }
};

// Run documentation generation
generateDocumentation();
