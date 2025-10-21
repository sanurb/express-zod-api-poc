/**
 * @fileoverview
 * Cat domain constants for validation and business rules.
 * Centralizes magic numbers and validation limits.
 */

/**
 * Cat validation constants.
 */
export const CAT_CONSTANTS = {
  name: {
    minLength: 1,
    maxLength: 50,
  },
  age: {
    min: 0,
    max: 30,
  },
  breed: {
    minLength: 1,
    maxLength: 30,
  },
  color: {
    minLength: 1,
    maxLength: 20,
  },
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
} as const;

/**
 * HTTP status codes for cat operations.
 */
export const CAT_HTTP_STATUS = {
  badRequest: 400,
  notFound: 404,
  conflict: 409,
} as const;

/**
 * Regular expression for cat name validation.
 */
export const CAT_NAME_REGEX = /^[a-zA-Z\s\-']+$/;
