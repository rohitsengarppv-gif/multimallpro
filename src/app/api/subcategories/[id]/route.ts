import { NextRequest } from "next/server";
import { updateSubcategory, deleteSubcategory } from "@/app/api/controllers/subCategoryController";

// Update a subcategory
export const PUT = updateSubcategory;

// Delete a subcategory
export const DELETE = deleteSubcategory;
