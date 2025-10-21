/**
 * @fileoverview
 * Documentation generation system for Express Zod API.
 * Implements OpenAPI specification generation and TypeScript client creation.
 */

import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { Routing } from "express-zod-api";
import { Documentation, Integration } from "express-zod-api";
import consola from "consola";

/**
 * Tag overrides interface for proper endpoint categorization.
 * Implements screaming architecture by organizing endpoints by domain.
 */
declare module "express-zod-api" {
  interface TagOverrides {
    readonly cats: unknown;
    readonly system: unknown;
  }
}

/**
 * Documentation configuration interface.
 * Implements Single Responsibility Principle for documentation settings.
 */
export type DocumentationConfig = {
  readonly version: string;
  readonly title: string;
  readonly serverUrl: string;
  readonly composition: "inline" | "components";
  readonly outputDir: string;
};

/**
 * Default documentation configuration.
 * Implements DRY principle by centralizing configuration.
 */
const DEFAULT_DOC_CONFIG: DocumentationConfig = {
  version: "1.0.0",
  title: "Cat Management API",
  serverUrl: "http://localhost:3000",
  composition: "components",
  outputDir: "docs",
} as const;

/**
 * Tag descriptions for API documentation.
 * Implements clean documentation with meaningful descriptions.
 */
const TAG_DESCRIPTIONS = {
  cats: {
    description: "Cat management endpoints for CRUD operations",
    url: "https://github.com/sanurb/typescript-node-esm-skeleton",
  },
  system: {
    description: "System health and information endpoints",
  },
} as const;

/**
 * OpenAPI specification generator.
 * Implements Single Responsibility Principle for OpenAPI generation.
 */
export class OpenAPIGenerator {
  private readonly config: DocumentationConfig;

  constructor(config: Partial<DocumentationConfig> = {}) {
    this.config = { ...DEFAULT_DOC_CONFIG, ...config };
  }

  /**
   * Generates OpenAPI 3.1 specification.
   * Implements clean code with comprehensive error handling.
   */
  async generateSpec(routing: Routing, serverConfig: unknown): Promise<string> {
    try {
      const documentation = new Documentation({
        routing,
        config: {
          cors: true,
          logger: {
            level: "info",
            color: false,
          },
          ...(serverConfig as Record<string, unknown>),
        },
        version: this.config.version,
        title: this.config.title,
        serverUrl: this.config.serverUrl,
        composition: this.config.composition,
        tags: TAG_DESCRIPTIONS,
      });

      return documentation.getSpecAsYaml();
    } catch (error) {
      throw new Error(
        `Failed to generate OpenAPI spec: ${(error as Error).message}`
      );
    }
  }

  /**
   * Writes OpenAPI specification to file.
   * Implements clean file handling with proper error management.
   */
  async writeSpec(
    routing: Routing,
    serverConfig: unknown,
    filename = "openapi.yaml"
  ): Promise<void> {
    try {
      const spec = await this.generateSpec(routing, serverConfig);
      const filePath = join(this.config.outputDir, filename);

      await writeFile(filePath, spec, "utf-8");
      consola.success(`OpenAPI specification written to ${filePath}`);
    } catch (error) {
      throw new Error(
        `Failed to write OpenAPI spec: ${(error as Error).message}`
      );
    }
  }
}

/**
 * TypeScript client generator.
 */
export class TypeScriptClientGenerator {
  private readonly config: DocumentationConfig;

  constructor(config: Partial<DocumentationConfig> = {}) {
    this.config = { ...DEFAULT_DOC_CONFIG, ...config };
  }

  /**
   * Generates TypeScript client code.
   */
  async generateClient(
    routing: Routing,
    serverConfig: unknown
  ): Promise<string> {
    try {
      const integration = new Integration({
        routing,
        variant: "client",
        serverUrl: this.config.serverUrl,
      });

      return await integration.printFormatted();
    } catch (error) {
      throw new Error(
        `Failed to generate TypeScript client: ${(error as Error).message}`
      );
    }
  }

  /**
   * Writes TypeScript client to file.
   */
  async writeClient(
    routing: Routing,
    serverConfig: unknown,
    filename = "api-client.ts"
  ): Promise<void> {
    try {
      const clientCode = await this.generateClient(routing, serverConfig);
      const filePath = join(this.config.outputDir, filename);

      await writeFile(filePath, clientCode, "utf-8");
      consola.success(`TypeScript client written to ${filePath}`);
    } catch (error) {
      throw new Error(
        `Failed to write TypeScript client: ${(error as Error).message}`
      );
    }
  }
}

/**
 * Comprehensive documentation generator.
 * Implements Facade pattern for simplified documentation generation.
 */
export class DocumentationGenerator {
  private readonly openApiGenerator: OpenAPIGenerator;
  private readonly clientGenerator: TypeScriptClientGenerator;

  constructor(config: Partial<DocumentationConfig> = {}) {
    this.openApiGenerator = new OpenAPIGenerator(config);
    this.clientGenerator = new TypeScriptClientGenerator(config);
  }

  /**
   * Generates complete documentation suite.
   */
  async generateAll(routing: Routing, serverConfig: unknown): Promise<void> {
    try {
      consola.info("Generating complete documentation...");

      await this.openApiGenerator.writeSpec(routing, serverConfig);

      await this.clientGenerator.writeClient(routing, serverConfig);

      consola.success("Documentation generation completed successfully!");
    } catch (error) {
      throw new Error(
        `Failed to generate documentation: ${(error as Error).message}`
      );
    }
  }

  /**
   * Generates only OpenAPI specification.
   */
  async generateOpenAPI(routing: Routing, serverConfig: unknown): Promise<void> {
    await this.openApiGenerator.writeSpec(routing, serverConfig);
  }

  /**
   * Generates only TypeScript client.
   */
  async generateClient(routing: Routing, serverConfig: unknown): Promise<void> {
    await this.clientGenerator.writeClient(routing, serverConfig);
  }
}
