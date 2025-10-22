/**
 * @fileoverview
 * Cat domain schema definitions using Zod for type-safe validation.
 * Implements screaming architecture with domain-driven design principles.
 */

import { z } from "zod";
import { CAT_CONSTANTS } from "./cat.constants.js";

/**
 * Base Cat schema with all required fields.
 * Uses strict validation for production-grade type safety.
 */
export const CatSchema = z.object({
  id: z
    .string()
    .uuid("Invalid cat ID format")
    .describe("Unique identifier for the cat (UUID format)"),
  name: z
    .string()
    .min(CAT_CONSTANTS.name.minLength, "Cat name is required")
    .max(CAT_CONSTANTS.name.maxLength, "Cat name must be 50 characters or less")
    .trim()
    .describe("The name of the cat (1-50 characters)"),
  age: z
    .number()
    .int("Cat age must be an integer")
    .min(CAT_CONSTANTS.age.min, "Cat age cannot be negative")
    .max(CAT_CONSTANTS.age.max, "Cat age cannot exceed 30 years")
    .describe("The age of the cat in years (0-30)"),
  breed: z
    .string()
    .min(CAT_CONSTANTS.breed.minLength, "Cat breed is required")
    .max(
      CAT_CONSTANTS.breed.maxLength,
      "Cat breed must be 30 characters or less"
    )
    .trim()
    .describe("The breed of the cat (1-30 characters)"),
  color: z
    .string()
    .min(CAT_CONSTANTS.color.minLength, "Cat color is required")
    .max(
      CAT_CONSTANTS.color.maxLength,
      "Cat color must be 20 characters or less"
    )
    .trim()
    .describe("The color of the cat (1-20 characters)"),
  isAdopted: z
    .boolean()
    .default(false)
    .describe("Whether the cat has been adopted (defaults to false)"),
  createdAt: z
    .date()
    .default(() => new Date())
    .describe("Timestamp when the cat was created (ISO 8601 format)"),
  updatedAt: z
    .date()
    .default(() => new Date())
    .describe("Timestamp when the cat was last updated (ISO 8601 format)"),
});

/**
 * Schema for creating a new cat (without system-generated fields).
 */
export const CreateCatSchema = CatSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema for updating an existing cat (all fields optional except id).
 */
export const UpdateCatSchema = CatSchema.partial().extend({
  id: z.string().uuid("Invalid cat ID format"),
});

/**
 * Schema for cat query parameters with pagination and filtering.
 */
export const CatQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) =>
      val ? Number.parseInt(val, 10) : CAT_CONSTANTS.pagination.defaultPage
    )
    .refine((val) => val > 0, "Page must be a positive number")
    .describe("Page number for pagination (starts from 1)"),
  limit: z
    .string()
    .optional()
    .transform((val) =>
      val ? Number.parseInt(val, 10) : CAT_CONSTANTS.pagination.defaultLimit
    )
    .refine(
      (val) => val > 0 && val <= CAT_CONSTANTS.pagination.maxLimit,
      "Limit must be between 1 and 100"
    )
    .describe("Number of items per page (max 100)"),
  breed: z.string().optional().describe("Filter cats by breed (optional)"),
  isAdopted: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .optional()
    .describe("Filter cats by adoption status"),
});

/**
 * Schema for cat path parameters.
 */
export const CatParamsSchema = z.object({
  id: z
    .string()
    .uuid("Invalid cat ID format")
    .describe("Unique identifier of the cat (UUID format)"),
});

/**
 * Response schema for paginated cat list.
 */
export const CatListResponseSchema = z.object({
  cats: z.array(CatSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

// Type exports for use throughout the application
export type Cat = z.infer<typeof CatSchema>;
export type CreateCat = z.infer<typeof CreateCatSchema>;
export type UpdateCat = z.infer<typeof UpdateCatSchema>;
export type CatQuery = z.infer<typeof CatQuerySchema>;
export type CatParams = z.infer<typeof CatParamsSchema>;
export type CatListResponse = z.infer<typeof CatListResponseSchema>;
