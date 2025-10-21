/**
 * @fileoverview
 * Get all cats endpoint controller using express-zod-api.
 * Handles GET requests for retrieving cats with pagination and filtering.
 */

import { defaultEndpointsFactory } from "express-zod-api";
import { catService } from "../application/cat.service.js";
import { CatListResponseSchema, CatQuerySchema } from "../domain/cat.schema.js";

/**
 * Get all cats endpoint with pagination and filtering support.
 *
 * @example
 * GET /api/v1/cats?page=1&limit=10&breed=Persian&isAdopted=false
 */
export const getAllCatsEndpoint = defaultEndpointsFactory.build({
  method: "get",
  tag: "cats",
  shortDescription: "Get all cats with pagination and filtering",
  input: CatQuerySchema,
  output: CatListResponseSchema,
  handler: async ({ input, logger }) => {
    try {
      logger.info("Retrieving cats", {
        page: input.page,
        limit: input.limit,
        breed: input.breed,
        isAdopted: input.isAdopted,
      });

      const result = await catService.getAllCats({
        page: input.page,
        limit: input.limit,
        breed: input.breed,
        isAdopted: input.isAdopted,
      });

      logger.info("Cats retrieved successfully", {
        count: result.cats.length,
        total: result.pagination.total,
        page: result.pagination.page,
      });

      return {
        cats: [...result.cats],
        pagination: result.pagination,
      };
    } catch (error) {
      logger.error("Failed to retrieve cats", {
        error: (error as Error).message,
        input,
      });

      // Re-throw unexpected errors
      throw error;
    }
  },
});
