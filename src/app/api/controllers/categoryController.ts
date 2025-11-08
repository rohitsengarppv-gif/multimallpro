import { NextRequest, NextResponse } from "next/server";
import Category from "@/app/api/models/Category";
import Vendor from "@/app/api/models/Vendor";
import connectDB from "@/app/api/config/mongoose";

// Get all categories (with optional vendor filter)
export const getCategories = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");
    const role = searchParams.get("role") || "vendor";
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    let query: any = { status };

    // Filter by vendor if provided
    if (vendorId) {
      query.$or = [
        { vendor: vendorId },
        { role: { $in: ["admin", "master-admin"] } },
        { isDefault: true }
      ];
    } else if (role === "vendor") {
      // For vendor role, only show their categories plus system defaults
      query.$or = [
        { role: { $in: ["admin", "master-admin"] } },
        { isDefault: true }
      ];
    }

    const categories = await Category.find(query)
      .populate("vendor", "businessName")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Category.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get categories error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// Create a new category
export const createCategory = async (req: NextRequest) => {
  try {
    await connectDB();

    const {
      name,
      description,
      image,
      parentCategory,
      vendorId,
      role = "vendor"
    } = await req.json();

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Category name is required" },
        { status: 400 }
      );
    }

    // Get vendor information if vendorId is provided
    let vendorName = "";
    let vendor = null;

    if (vendorId && role === "vendor") {
      vendor = await Vendor.findById(vendorId).select("businessName");
      if (!vendor) {
        return NextResponse.json(
          { success: false, message: "Vendor not found" },
          { status: 404 }
        );
      }
      vendorName = vendor.businessName;
    }

    // Check if parent category exists and get its level
    let level = 1;
    let parent = null;

    // Handle parentCategory - convert empty string to null
    const processedParentCategory = parentCategory && parentCategory.trim() ? parentCategory : null;

    if (processedParentCategory) {
      parent = await Category.findById(processedParentCategory);
      if (!parent) {
        return NextResponse.json(
          { success: false, message: "Parent category not found" },
          { status: 404 }
        );
      }
      level = parent.level + 1;

      if (level > 3) {
        return NextResponse.json(
          { success: false, message: "Maximum category depth exceeded (3 levels max)" },
          { status: 400 }
        );
      }
    }

    // Generate slug manually to ensure it's set before validation
    const baseSlug = name.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    // Add vendor identifier to slug for vendor-specific categories
    const slug = role === "vendor" && vendorId
      ? `${baseSlug}-${vendorId.toString().slice(-6)}`
      : baseSlug;

    // Create the category
    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description?.trim(),
      image,
      vendor: vendorId && role === "vendor" ? vendorId : undefined,
      vendorName: vendorName || undefined,
      role,
      parentCategory: processedParentCategory,
      level,
      isDefault: role !== "vendor", // Admin/master-admin categories are default
    });

    // If this is a subcategory, add it to parent's subcategories array
    if (processedParentCategory) {
      await Category.findByIdAndUpdate(processedParentCategory, {
        $push: { subcategories: category._id }
      });
    }

    const populatedCategory = await Category.findById(category._id)
      .populate("vendor", "businessName");

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: populatedCategory,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Create category error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category with this name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// Update a category
export const updateCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const {
      name,
      description,
      image,
      status,
      sortOrder,
      vendorId,
      role = "vendor"
    } = await req.json();

    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check ownership for vendor role - vendors can only edit their own categories
    if (role === "vendor" && category.vendor?.toString() !== vendorId) {
      return NextResponse.json(
        { success: false, message: "You can only edit your own categories" },
        { status: 403 }
      );
    }

    // System categories can only be edited by admins/master-admins
    if (category.isDefault && !["admin", "master-admin"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "System categories can only be edited by administrators" },
        { status: 403 }
      );
    }

    // Update fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("vendor", "businessName");

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update category error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Category with this name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// Delete a category
export const deleteCategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const { vendorId, role = "vendor" } = await req.json();

    // Find the category
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Check ownership for vendor role - vendors can only delete their own categories
    if (role === "vendor" && category.vendor?.toString() !== vendorId) {
      return NextResponse.json(
        { success: false, message: "You can only delete your own categories" },
        { status: 403 }
      );
    }

    // System categories can only be deleted by master-admins
    if (category.isDefault && role !== "master-admin") {
      return NextResponse.json(
        { success: false, message: "System categories can only be deleted by master administrators" },
        { status: 403 }
      );
    }

    // Check if category has subcategories
    if (category.subcategories && category.subcategories.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete category with subcategories. Please delete or move subcategories first."
        },
        { status: 400 }
      );
    }

    // Remove this category from parent's subcategories array if it has a parent
    if (category.parentCategory) {
      await Category.findByIdAndUpdate(category.parentCategory, {
        $pull: { subcategories: category._id }
      });
    }

    // Delete the category
    await Category.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};
