import mongoose from "mongoose";
import Category from "@/app/api/models/Category";
import connectDB from "@/app/api/config/mongoose";

export async function GET() {
  try {
    await connectDB();

    // Check total categories
    const totalCategories = await Category.countDocuments();
    const totalSubcategories = await Category.countDocuments({
      parentCategory: { $ne: null }
    });
    const totalMainCategories = await Category.countDocuments({
      parentCategory: null
    });

    // Get a sample of each type
    const sampleMain = await Category.findOne({ parentCategory: null }).select('name parentCategory');
    const sampleSub = await Category.findOne({ parentCategory: { $ne: null } }).select('name parentCategory');

    return Response.json({
      success: true,
      data: {
        totalCategories,
        totalSubcategories,
        totalMainCategories,
        sampleMainCategory: sampleMain,
        sampleSubcategory: sampleSub,
        message: "All categories and subcategories are in the same 'categories' collection"
      }
    });

  } catch (error: any) {
    console.error("Database check error:", error);
    return Response.json(
      { success: false, message: "Database check failed", error: error.message },
      { status: 500 }
    );
  }
}
