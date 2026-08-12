import dotenv from "dotenv";
import mongoose from "mongoose";
import { SYSTEM_CATEGORIES } from "./system-categories";
import { Category } from "../schemas/category.schema";
import { CategoryLevel } from "../../../common/enums/category-level.enum";
import { connectDatabase } from "../../../database/connection";



dotenv.config();

async function seedCategories() {
  try {
   await connectDatabase();

    console.log("🌱 Seeding categories...");

    for (const parent of SYSTEM_CATEGORIES) {
      // Check if parent already exists
      let parentCategory = await Category.findOne({
        name: parent.name,
        type: parent.type,
        level: parent.level,
        isSystem: true,
        isDeleted: false,
      });

      // Create parent if it doesn't exist
      if (!parentCategory) {
        parentCategory = await Category.create({
          userId: null,
          parentCategoryId: null,
          name: parent.name,
          type: parent.type,
          level: parent.level,
          icon: parent.icon,
          color: parent.color,
          isSystem: true,
          isDeleted: false,
        });

        console.log(`✅ Created category: ${parent.name}`);
      } else {
        console.log(`⏩ Category already exists: ${parent.name}`);
      }

      // Create subcategories
      for (const sub of parent.subcategories) {
        const existingSubcategory = await Category.findOne({
          parentCategoryId: parentCategory._id,
          name: sub.name,
          isSystem: true,
          isDeleted: false,
        });

        if (existingSubcategory) {
          console.log(`   ⏩ Subcategory already exists: ${sub.name}`);
          continue;
        }

        await Category.create({
          userId: null,
          parentCategoryId: parentCategory._id,
          level: CategoryLevel.SUBCATEGORY,
          name: sub.name,
          type: parent.type,
          icon: sub.icon,
          color: sub.color,
          isSystem: true,
          isDeleted: false,
        });

        console.log(`   ✅ Created subcategory: ${sub.name}`);
      }
    }

    console.log("\n🎉 Category seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Category seeding failed");
    console.error(error);
    process.exit(1);
  }
}

seedCategories();