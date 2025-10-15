/**
 * @fileoverview
 * Configuration module for environment variables validation and management.
 * Provides type-safe access to validated environment variables through a singleton pattern.
 */

import { config } from "dotenv";
import { Singleton } from "tstl";
import { z } from "zod";
import { envSchema } from "./env.schema.js";
import type { Config } from "./types.js";

/**
 * Global configuration singleton.
 * Provides access to validated environment variables through a singleton pattern.
 */
export const GlobalConfig = {
  /**
   * Get validated configuration object.
   * This will throw an error on first access if validation fails.
   */
  get config(): Config {
    return environments.get();
  },

  /**
   * Get application information for logging and display purposes.
   */
  get appInfo(): string {
    return GlobalConfig.config.app.name;
  },

  /**
   * Get server port.
   */
  get port(): number {
    return GlobalConfig.config.server.port;
  },
} as const;

/**
 * Singleton instance for configuration.
 * Loads and validates environment variables on first access.
 */
const environments = new Singleton(() => {
  // Load environment variables from .env file
  config();

  // Map environment variables to schema format
  const envForSchema = {
    port: process.env.PORT,
    appName: process.env.APP_NAME,
  } as const;

  try {
    const validatedEnv = envSchema.parse(envForSchema);
    return transformEnvToConfig(validatedEnv);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        `Environment validation failed:\n${errorMessages.join("\n")}`
      );
    }
    throw error;
  }
});

/**
 * Transforms validated environment variables into the application configuration.
 */
function transformEnvToConfig(env: z.infer<typeof envSchema>): Config {
  return {
    server: {
      port: env.port,
    },
    app: {
      name: env.appName,
    },
  };
}
