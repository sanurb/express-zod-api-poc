/**
 * @fileoverview
 * Cat routes configuration using express-zod-api routing.
 * Implements vertical slicing with screaming architecture for cat endpoints.
 */

import type { Routing } from "express-zod-api";
import { DependsOnMethod } from "express-zod-api";
import { createCatEndpoint } from "./controllers/create_cat.controller.js";
import { deleteCatEndpoint } from "./controllers/delete_cat.controller.js";
import { getAllCatsEndpoint } from "./controllers/get_all_cats.controller.js";
import { getCatEndpoint } from "./controllers/get_cat.controller.js";
import { updateCatEndpoint } from "./controllers/update_cat.controller.js";

/**
 * Cat routes configuration with RESTful API design.
 * Implements vertical slicing by organizing all cat-related endpoints.
 */
export const catRoutes: Routing = {
  /**
   * Cat collection endpoints using DependsOnMethod
   * GET /api/v1/cats - List all cats with pagination and filtering
   * POST /api/v1/cats - Create a new cat
   */
  cats: new DependsOnMethod({
    get: getAllCatsEndpoint,
    post: createCatEndpoint,
  }),

  /**
   * Individual cat endpoints using DependsOnMethod
   * GET /api/v1/cats/:id - Get a specific cat
   * PUT /api/v1/cats/:id - Update a specific cat
   * DELETE /api/v1/cats/:id - Delete a specific cat
   */
  "cats/:id": new DependsOnMethod({
    get: getCatEndpoint,
    put: updateCatEndpoint,
    delete: deleteCatEndpoint,
  }),
};
