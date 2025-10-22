/**
 * @fileoverview
 * zod2md configuration for generating Markdown documentation from Zod schemas.
 * Implements clean configuration with comprehensive schema documentation.
 */

import type { Config } from "zod2md";

const SCHEMA_SUFFIX_REGEX = /Schema$/;

const config: Config = {
  entry: "src/cats/domain/cat.schema.ts",
  title: "Cat Management API - Schema Documentation",
  output: "docs/schemas.md",
  format: "esm",
  tsconfig: "tsconfig.json",
  transformName: (name: string | undefined, path: string) => {
    if (name) {
      // Remove 'Schema' suffix and convert to PascalCase
      const cleanName = name.replace(SCHEMA_SUFFIX_REGEX, "");
      return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
    // Use file path for default exports
    const fileName = path.split("/").pop()?.replace(".ts", "") || "Unknown";
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
  },
};

export default config;
