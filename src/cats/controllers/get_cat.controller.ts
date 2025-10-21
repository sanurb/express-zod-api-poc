/**
 * @fileoverview
 * Get cat by ID endpoint controller using express-zod-api.
 * Handles GET requests for retrieving a specific cat by ID.
 */

import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import { catService } from "../application/cat.service.js";
import { CAT_HTTP_STATUS } from "../domain/cat.constants.js";
import { CatParamsSchema, CatSchema } from "../domain/cat.schema.js";
import { CatNotFoundError } from "../domain/cat.types.js";

/**
 * Get cat by ID endpoint.
 *
 * @example
 * GET /api/v1/cats/123e4567-e89b-12d3-a456-426614174000
 */
export const getCatEndpoint = defaultEndpointsFactory.build({
  method: "get",
  tag: "cats",
  shortDescription: "Get a cat by ID",
  description:
    "Retrieves a specific cat by its unique identifier. Returns 404 if the cat is not found.",
  input: CatParamsSchema,
  output: CatSchema,
  handler: async ({ input, logger }) => {
    try {
      logger.info("Retrieving cat", { id: input.id });

      const cat = await catService.getCatById(input.id);

      if (!cat) {
        logger.warn("Cat not found", { id: input.id });
        throw createHttpError(
          CAT_HTTP_STATUS.notFound,
          `Cat with ID ${input.id} not found`
        );
      }

      logger.info("Cat retrieved successfully", {
        id: cat.id,
        name: cat.name,
      });

      return cat;
    } catch (error) {
      logger.error("Failed to retrieve cat", {
        id: input.id,
        error: (error as Error).message,
      });

      if (error instanceof CatNotFoundError) {
        throw createHttpError(CAT_HTTP_STATUS.notFound, error.message);
      }

      // Re-throw unexpected errors
      throw error;
    }
  },
});
