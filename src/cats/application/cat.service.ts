/**
 * @fileoverview
 * Cat service layer implementing business logic for cat operations.
 * Provides the application layer between controllers and repository.
 */

import { CAT_CONSTANTS, CAT_NAME_REGEX } from "../domain/cat.constants.js";
import type { Cat, CreateCat, UpdateCat } from "../domain/cat.schema.js";
import type {
  CatListResult,
  CatQueryOptions,
  CatService,
} from "../domain/cat.types.js";
import { CatNotFoundError, CatValidationError } from "../domain/cat.types.js";
import { catRepository } from "../infrastructure/cat.repository.js";

/**
 * Cat service implementation with business logic.
 * Handles validation, business rules, and coordinates with repository.
 */
export class CatServiceImpl implements CatService {
  /**
   * Creates a new cat with business validation.
   */
  async createCat(data: CreateCat): Promise<Cat> {
    // Business validation
    this.validateCatData(data);

    // Check for duplicate names (business rule)
    const existingCats = await catRepository.findAll();
    const nameExists = existingCats.some(
      (cat) => cat.name.toLowerCase() === data.name.toLowerCase()
    );

    if (nameExists) {
      throw new CatValidationError("A cat with this name already exists");
    }

    return catRepository.create(data);
  }

  /**
   * Retrieves a cat by ID with error handling.
   */
  async getCatById(id: string): Promise<Cat | null> {
    const cat = await catRepository.findById(id);
    return cat;
  }

  /**
   * Retrieves all cats with pagination and filtering.
   */
  async getAllCats(query?: CatQueryOptions): Promise<CatListResult> {
    const cats = await catRepository.findAll(query);
    const total = await catRepository.count(query);

    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const totalPages = Math.ceil(total / limit);

    return {
      cats,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Updates an existing cat with validation.
   */
  async updateCat(id: string, data: Partial<UpdateCat>): Promise<Cat | null> {
    // Check if cat exists
    const existingCat = await catRepository.findById(id);
    if (!existingCat) {
      throw new CatNotFoundError(id);
    }

    // Validate update data
    if (data.name !== undefined) {
      this.validateCatName(data.name);
    }

    if (data.age !== undefined) {
      this.validateCatAge(data.age);
    }

    // Check for name conflicts if name is being updated
    if (data.name && data.name !== existingCat.name) {
      const allCats = await catRepository.findAll();
      const nameExists = allCats.some(
        (cat) =>
          cat.id !== id && cat.name.toLowerCase() === data?.name?.toLowerCase()
      );

      if (nameExists) {
        throw new CatValidationError("A cat with this name already exists");
      }
    }

    return catRepository.update(id, data);
  }

  /**
   * Deletes a cat by ID.
   */
  async deleteCat(id: string): Promise<boolean> {
    const existingCat = await catRepository.findById(id);
    if (!existingCat) {
      throw new CatNotFoundError(id);
    }

    return catRepository.delete(id);
  }

  /**
   * Validates cat data for business rules.
   */
  private validateCatData(data: CreateCat): void {
    this.validateCatName(data.name);
    this.validateCatAge(data.age);
    this.validateCatBreed(data.breed);
    this.validateCatColor(data.color);
  }

  /**
   * Validates cat name according to business rules.
   */
  private validateCatName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new CatValidationError("Cat name is required");
    }

    if (name.length > CAT_CONSTANTS.name.maxLength) {
      throw new CatValidationError("Cat name must be 50 characters or less");
    }

    // Check for invalid characters
    if (!CAT_NAME_REGEX.test(name)) {
      throw new CatValidationError("Cat name contains invalid characters");
    }
  }

  /**
   * Validates cat age according to business rules.
   */
  private validateCatAge(age: number): void {
    if (age < CAT_CONSTANTS.age.min) {
      throw new CatValidationError("Cat age cannot be negative");
    }

    if (age > CAT_CONSTANTS.age.max) {
      throw new CatValidationError("Cat age cannot exceed 30 years");
    }

    if (!Number.isInteger(age)) {
      throw new CatValidationError("Cat age must be an integer");
    }
  }

  /**
   * Validates cat breed according to business rules.
   */
  private validateCatBreed(breed: string): void {
    if (!breed || breed.trim().length === 0) {
      throw new CatValidationError("Cat breed is required");
    }

    if (breed.length > CAT_CONSTANTS.breed.maxLength) {
      throw new CatValidationError("Cat breed must be 30 characters or less");
    }
  }

  /**
   * Validates cat color according to business rules.
   */
  private validateCatColor(color: string): void {
    if (!color || color.trim().length === 0) {
      throw new CatValidationError("Cat color is required");
    }

    if (color.length > CAT_CONSTANTS.color.maxLength) {
      throw new CatValidationError("Cat color must be 20 characters or less");
    }
  }
}

/**
 * Singleton instance of the cat service.
 * Provides a single source of truth for cat business logic.
 */
export const catService = new CatServiceImpl();
