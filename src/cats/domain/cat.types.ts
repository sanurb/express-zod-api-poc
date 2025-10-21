/**
 * @fileoverview
 * Cat domain types and interfaces for type-safe operations.
 * Provides additional type definitions beyond Zod schemas.
 */

import type { Cat, CreateCat, UpdateCat } from "./cat.schema.js";

/**
 * Repository type for cat data operations.
 * Defines the contract for cat data persistence.
 */
export type CatRepository = {
  readonly create: (cat: CreateCat) => Promise<Cat>;
  readonly findById: (id: string) => Promise<Cat | null>;
  readonly findAll: (query?: CatQueryOptions) => Promise<Cat[]>;
  readonly update: (
    id: string,
    updates: Partial<UpdateCat>
  ) => Promise<Cat | null>;
  readonly delete: (id: string) => Promise<boolean>;
  readonly count: (query?: CatQueryOptions) => Promise<number>;
};

/**
 * Query options for filtering and pagination.
 */
export type CatQueryOptions = {
  readonly page?: number;
  readonly limit?: number;
  readonly breed?: string;
  readonly isAdopted?: boolean;
};

/**
 * Service type for cat business logic.
 * Defines the contract for cat business operations.
 */
export type CatService = {
  readonly createCat: (data: CreateCat) => Promise<Cat>;
  readonly getCatById: (id: string) => Promise<Cat | null>;
  readonly getAllCats: (query?: CatQueryOptions) => Promise<CatListResult>;
  readonly updateCat: (
    id: string,
    data: Partial<UpdateCat>
  ) => Promise<Cat | null>;
  readonly deleteCat: (id: string) => Promise<boolean>;
};

/**
 * Result type for paginated cat list operations.
 */
export type CatListResult = {
  readonly cats: readonly Cat[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly totalPages: number;
  };
};

/**
 * Error types for cat operations.
 */
export class CatNotFoundError extends Error {
  constructor(id: string) {
    super(`Cat with ID ${id} not found`);
    this.name = "CatNotFoundError";
  }
}

export class CatValidationError extends Error {
  constructor(message: string) {
    super(`Cat validation failed: ${message}`);
    this.name = "CatValidationError";
  }
}

export class CatConflictError extends Error {
  constructor(message: string) {
    super(`Cat conflict: ${message}`);
    this.name = "CatConflictError";
  }
}
