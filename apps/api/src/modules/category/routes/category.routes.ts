  import { Router } from "express";

  import categoryController from "../controllers/category.controller";

  import { createCategorySchema } from "../validators/create-category.validator";
  import { createSubcategorySchema } from "../validators/create-subcategory.validator";
  import { updateCategorySchema } from "../validators/update-category.validator";
  import { updateSubcategorySchema } from "../validators/update-subcategory.validator";
  import { authenticate } from "../../../middleware/auth.middleware";
  import { validate } from "../../../middleware/validation.middleware";

  const router = Router();

  router.use(authenticate);

  /* -------------------------- Create -------------------------- */

  router.post(
    "/",
    validate(createCategorySchema),
    categoryController.createCategory,
  );

  router.post(
    "/subcategories",
    validate(createSubcategorySchema),
    categoryController.createSubcategory,
  );

  /* --------------------------- Read --------------------------- */

  router.get("/", categoryController.getCategories);

  router.get(
    "/subcategories",
    categoryController.getSubcategories,
  );

  router.get(
    "/:categoryId",
    categoryController.getCategoryById,
  );

  /* -------------------------- Update -------------------------- */

  router.patch(
    "/subcategories/:subcategoryId",
    validate(updateSubcategorySchema),
    categoryController.updateSubcategory,
  );

  router.patch(
    "/:categoryId",
    validate(updateCategorySchema),
    categoryController.updateCategory,
  );

  /* -------------------------- Delete -------------------------- */

  router.delete(
    "/subcategories/:subcategoryId",
    categoryController.deleteSubcategory,
  );

  router.delete(
    "/:categoryId",
    categoryController.deleteCategory,
  );

  export default router;