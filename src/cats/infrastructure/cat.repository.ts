/**
 * @fileoverview
 * In-memory cat repository implementation.
 * Provides data persistence layer for cat entities using in-memory storage.
 */

import { v4 as uuidv4 } from "uuid";
import type { Cat, CreateCat, UpdateCat } from "../domain/cat.schema.js";
import type { CatQueryOptions, CatRepository } from "../domain/cat.types.js";

/**
 * In-memory cat repository implementation.
 * Stores cat data in memory with full CRUD operations.
 */
export class InMemoryCatRepository implements CatRepository {
  private readonly cats = new Map<string, Cat>();

  /**
   * Creates a new cat in the repository.
   */
  create(catData: CreateCat): Promise<Cat> {
    const cat: Cat = {
      id: uuidv4(),
      ...catData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.cats.set(cat.id, cat);
    return Promise.resolve(cat);
  }

  /**
   * Finds a cat by its ID.
   */
  findById(id: string): Promise<Cat | null> {
    const cat = this.cats.get(id);
    return Promise.resolve(cat ?? null);
  }

  /**
   * Retrieves all cats with optional filtering and pagination.
   */
  findAll(query?: CatQueryOptions): Promise<Cat[]> {
    let filteredCats = Array.from(this.cats.values());

    // Apply filters
    if (query?.breed) {
      const breedFilter = query.breed.toLowerCase();
      filteredCats = filteredCats.filter((cat) =>
        cat.breed.toLowerCase().includes(breedFilter)
      );
    }

    if (query?.isAdopted !== undefined) {
      filteredCats = filteredCats.filter(
        (cat) => cat.isAdopted === query.isAdopted
      );
    }

    // Apply pagination
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return Promise.resolve(filteredCats.slice(startIndex, endIndex));
  }

  /**
   * Updates an existing cat.
   */
  update(id: string, updates: Partial<UpdateCat>): Promise<Cat | null> {
    const existingCat = this.cats.get(id);
    if (!existingCat) {
      return Promise.resolve(null);
    }

    const updatedCat: Cat = {
      ...existingCat,
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date(),
    };

    this.cats.set(id, updatedCat);
    return Promise.resolve(updatedCat);
  }

  /**
   * Deletes a cat by its ID.
   */
  delete(id: string): Promise<boolean> {
    return Promise.resolve(this.cats.delete(id));
  }

  /**
   * Counts cats matching the query criteria.
   */
  count(query?: CatQueryOptions): Promise<number> {
    let filteredCats = Array.from(this.cats.values());

    // Apply filters (same logic as findAll)
    if (query?.breed) {
      const breedFilter = query.breed.toLowerCase();
      filteredCats = filteredCats.filter((cat) =>
        cat.breed.toLowerCase().includes(breedFilter)
      );
    }

    if (query?.isAdopted !== undefined) {
      filteredCats = filteredCats.filter(
        (cat) => cat.isAdopted === query.isAdopted
      );
    }

    return Promise.resolve(filteredCats.length);
  }

  /**
   * Clears all cats from the repository (useful for testing).
   */
  clear(): void {
    this.cats.clear();
  }

  /**
   * Gets the total number of cats in the repository.
   */
  size(): number {
    return this.cats.size;
  }
}

/**
 * Singleton instance of the in-memory cat repository.
 * Provides a single source of truth for cat data.
 */
export const catRepository = new InMemoryCatRepository();
