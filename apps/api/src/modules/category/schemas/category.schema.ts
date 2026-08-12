import { Schema, model } from "mongoose";
import { CategoryType } from "../../../common/enums/category-type.enum";
import { CategoryLevel } from "../../../common/enums/category-level.enum";
import { ICategory } from "../interfaces/category.interface";

const categorySchema = new Schema<ICategory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    parentCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    level: {
      type: Number,
      enum: [CategoryLevel.PARENT, CategoryLevel.SUBCATEGORY],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    type: {
      type: String,
      enum: Object.values(CategoryType),
      required: true,
    },

    icon: {
      type: String,
      required: true,
      trim: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    isSystem: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  },
);

/**
 * Frequently used queries
 */
categorySchema.index({
  userId: 1,
  type: 1,
  isDeleted: 1,
});

categorySchema.index({
  parentCategoryId: 1,
});

categorySchema.index({
  isSystem: 1,
});

categorySchema.index({
  name: "text",
});

categorySchema.index(
  {
    userId: 1,
    parentCategoryId: 1,
    type: 1,
    name: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
    },
  },
);

export const Category = model<ICategory>("Category", categorySchema);
