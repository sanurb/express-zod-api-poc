/**
 * @fileoverview
 * TypeScript type definitions for configuration.
 * Provides type safety for the configuration system.
 */

/**
 * Application configuration type.
 * Defines the structure of the validated configuration object
 * that will be available throughout the application.
 */
export type Config = {
  /**
   * Server configuration.
   */
  readonly server: {
    /**
     * Port number for the server to listen on.
     * Must be a valid port number (1-65535).
     */
    readonly port: number;
  };

  /**
   * Application configuration.
   */
  readonly app: {
    /**
     * Application name for logging and display purposes.
     */
    readonly name: string;
  };
};
