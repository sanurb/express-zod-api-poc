/**
 * @fileoverview
 * Update cat endpoint controller using express-zod-api.
 * Handles PUT requests for updating an existing cat.
 */

import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import { z } from "zod";
import { catService } from "../application/cat.service.js";
import { CAT_CONSTANTS, CAT_HTTP_STATUS } from "../domain/cat.constants.js";
import { CatParamsSchema, CatSchema } from "../domain/cat.schema.js";
import {
  CatConflictError,
  CatNotFoundError,
  CatValidationError,
} from "../domain/cat.types.js";

/**
 * Update cat input schema combining path params and body.
 */
const UpdateCatInputSchema = CatParamsSchema.extend({
  name: z
    .string()
    .min(CAT_CONSTANTS.name.minLength)
    .max(CAT_CONSTANTS.name.maxLength)
    .trim()
    .optional(),
  age: z
    .number()
    .int()
    .min(CAT_CONSTANTS.age.min)
    .max(CAT_CONSTANTS.age.max)
    .optional(),
  breed: z
    .string()
    .min(CAT_CONSTANTS.breed.minLength)
    .max(CAT_CONSTANTS.breed.maxLength)
    .trim()
    .optional(),
  color: z
    .string()
    .min(CAT_CONSTANTS.color.minLength)
    .max(CAT_CONSTANTS.color.maxLength)
    .trim()
    .optional(),
  isAdopted: z.boolean().optional(),
});

/**
 * Update cat endpoint with comprehensive validation and error handling.
 *
 * @example
 * PUT /api/v1/cats/123e4567-e89b-12d3-a456-426614174000
 * {
 *   "name": "Whiskers Updated",
 *   "age": 4,
 *   "isAdopted": true
 * }
 */
export const updateCatEndpoint = defaultEndpointsFactory.build({
  method: "put",
  tag: "cats",
  shortDescription: "Update a cat by ID",
  description:
    "Updates an existing cat with the provided information. Only provided fields will be updated. Returns 404 if the cat is not found.",
  input: UpdateCatInputSchema,
  output: CatSchema,
  handler: async ({ input, logger }) => {
    try {
      const { id, ...updateData } = input;

      logger.info("Updating cat", {
        id,
        updates: Object.keys(updateData),
      });

      const updatedCat = await catService.updateCat(id, updateData);

      if (!updatedCat) {
        logger.warn("Cat not found for update", { id });
        throw createHttpError(
          CAT_HTTP_STATUS.notFound,
          `Cat with ID ${id} not found`
        );
      }

      logger.info("Cat updated successfully", {
        id: updatedCat.id,
        name: updatedCat.name,
      });

      return updatedCat;
    } catch (error) {
      logger.error("Failed to update cat", {
        id: input.id,
        error: (error as Error).message,
      });

      if (error instanceof CatNotFoundError) {
        throw createHttpError(CAT_HTTP_STATUS.notFound, error.message);
      }

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
