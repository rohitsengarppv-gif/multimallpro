import { NextRequest } from "next/server";
import { getSubcategories, createSubcategory } from "@/app/api/controllers/subCategoryController";

// Get subcategories (all subcategories or filtered by parentId)
export const GET = getSubcategories;

// Create a subcategory
export const POST = createSubcategory;
