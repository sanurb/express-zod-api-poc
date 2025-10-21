/**
 * @fileoverview
 * Create cat endpoint controller using express-zod-api.
 * Handles POST requests for creating new cats with validation.
 */

import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import { catService } from "../application/cat.service.js";
import { CAT_HTTP_STATUS } from "../domain/cat.constants.js";
import { CatSchema, CreateCatSchema } from "../domain/cat.schema.js";
import { CatConflictError, CatValidationError } from "../domain/cat.types.js";

/**
 * Create cat endpoint
 *
 * @example
 * POST /api/v1/cats
 * {
 *   "name": "Whiskers",
 *   "age": 3,
 *   "breed": "Persian",
 *   "color": "White",
 *   "isAdopted": false
 * }
 */
export const createCatEndpoint = defaultEndpointsFactory.build({
  method: "post",
  tag: "cats",
  shortDescription: "Create a new cat",
  description:
    "Creates a new cat with the provided information. All fields are required except isAdopted which defaults to false. The cat will be assigned a unique ID and timestamps will be automatically set.",
  input: CreateCatSchema,
  output: CatSchema,
  handler: async ({ input, logger }) => {
    try {
      logger.info("Creating new cat", { name: input.name, breed: input.breed });

      const newCat = await catService.createCat(input);

      logger.info("Cat created successfully", {
        id: newCat.id,
        name: newCat.name,
      });

      return newCat;
    } catch (error) {
      logger.error("Failed to create cat", { error: (error as Error).message });

      if (error instanceof CatValidationError) {
        throw createHttpError(CAT_HTTP_STATUS.badRequest, error.message);
      }

      if (error instanceof CatConflictError) {
        throw createHttpError(CAT_HTTP_STATUS.conflict, error.message);
      }

      // Re-throw unexpected errors
      throw error;
    }
  },
});
