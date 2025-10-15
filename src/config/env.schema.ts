/**
 * @fileoverview
 * Environment variables schema definition using Zod.
 * Defines the structure and validation rules for all environment variables.
 */

import { z } from "zod";

// Constants for validation
const MIN_PORT = 1;
const MAX_PORT = 65_535;
const MAX_APP_NAME_LENGTH = 100;

/**
 * Environment variables schema with validation rules.
 *
 * Required:
 * - port: Server port (defaults to 3000 if not provided)
 *
 * Optional:
 * - appName: Application name (defaults to "Backend API")
 */
export const envSchema = z.object({
  /**
   * Server port number.
   * Must be a valid port number (1-65535).
   * Defaults to 3000 if not provided.
   */
  port: z
    .string()
    .optional()
    .default("3000")
    .transform((val) => {
      const port = Number.parseInt(val, 10);
      if (Number.isNaN(port) || port < MIN_PORT || port > MAX_PORT) {
        throw new Error(
          `PORT must be a valid port number (${MIN_PORT}-${MAX_PORT})`
        );
      }
      return port;
    }),

  /**
   * Application name for logging and display purposes.
   * Defaults to "Backend API" if not provided.
   */
  appName: z
    .string()
    .min(1, "APP_NAME cannot be empty")
    .max(
      MAX_APP_NAME_LENGTH,
      `APP_NAME must be ${MAX_APP_NAME_LENGTH} characters or less`
    )
    .optional()
    .default("Backend API"),
});

/**
 * Inferred type from the environment schema.
 * This provides type safety for the configuration object.
 */
export type EnvSchema = z.infer<typeof envSchema>;
