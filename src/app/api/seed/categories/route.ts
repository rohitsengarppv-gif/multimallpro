import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Category from "@/app/api/models/Category";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const defaultCategories = [
      {
        name: "Electronics",
        description: "Electronic devices and gadgets",
        role: "admin",
        isDefault: true,
        status: "active",
        level: 1,
      },
      {
        name: "Clothing",
        description: "Fashion and apparel",
        role: "admin",
        isDefault: true,
        status: "active",
        level: 1,
      },
      {
        name: "Home & Garden",
        description: "Home improvement and garden supplies",
        role: "admin",
        isDefault: true,
        status: "active",
        level: 1,
      },
      {
        name: "Books",
        description: "Books and publications",
        role: "admin",
        isDefault: true,
        status: "active",
        level: 1,
      },
      {
        name: "Sports",
        description: "Sports equipment and accessories",
        role: "admin",
        isDefault: true,
        status: "active",
        level: 1,
      },
      {
        name: "Health & Beauty",
        description: "Health and beauty products",
        role: "admin",
        isDefault: true,
        status: "active",
        level: 1,
      },
    ];

    const createdCategories = [];

    for (const catData of defaultCategories) {
      // Check if category already exists
      const existing = await Category.findOne({
        name: catData.name,
        isDefault: true
      });

      if (!existing) {
        const category = await Category.create(catData);
        createdCategories.push(category);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Created ${createdCategories.length} default categories`,
      data: createdCategories,
    }, { status: 201 });

  } catch (error: any) {
    console.error("Seed categories error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to create categories"
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const categories = await Category.find({ isDefault: true, status: "active" });

    return NextResponse.json({
      success: true,
      message: "Default categories retrieved",
      data: categories,
    });

  } catch (error: any) {
    console.error("Get categories error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to retrieve categories"
    }, { status: 500 });
  }
}
