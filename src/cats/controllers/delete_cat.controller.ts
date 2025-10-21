/**
 * @fileoverview
 * Delete cat endpoint controller using express-zod-api.
 * Handles DELETE requests for removing a cat by ID.
 */

import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import { z } from "zod";
import { catService } from "../application/cat.service.js";
import { CAT_HTTP_STATUS } from "../domain/cat.constants.js";
import { CatParamsSchema } from "../domain/cat.schema.js";
import { CatNotFoundError } from "../domain/cat.types.js";

/**
 * Delete cat response schema.
 */
const DeleteCatResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  deletedId: z.string(),
});

/**
 * Delete cat endpoint.
 *
 * @example
 * DELETE /api/v1/cats/123e4567-e89b-12d3-a456-426614174000
 */
export const deleteCatEndpoint = defaultEndpointsFactory.build({
  method: "delete",
  tag: "cats",
  shortDescription: "Delete a cat by ID",
  description:
    "Permanently deletes a cat by its unique identifier. Returns 404 if the cat is not found.",
  input: CatParamsSchema,
  output: DeleteCatResponseSchema,
  handler: async ({ input, logger }) => {
    try {
      logger.info("Deleting cat", { id: input.id });

      const deleted = await catService.deleteCat(input.id);

      if (!deleted) {
        logger.warn("Cat not found for deletion", { id: input.id });
        throw createHttpError(
          CAT_HTTP_STATUS.notFound,
          `Cat with ID ${input.id} not found`
        );
      }

      logger.info("Cat deleted successfully", { id: input.id });

      return {
        success: true,
        message: `Cat with ID ${input.id} has been successfully deleted`,
        deletedId: input.id,
      };
    } catch (error) {
      logger.error("Failed to delete cat", {
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
