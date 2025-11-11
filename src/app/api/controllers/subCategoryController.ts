import { NextRequest, NextResponse } from "next/server";
import SubCategory from "@/app/api/models/SubCategory";
import Category from "@/app/api/models/Category";
import Vendor from "@/app/api/models/Vendor";
import connectDB from "@/app/api/config/mongoose";

export const getSubcategories = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");
    const vendorId = searchParams.get("vendorId");
    const role = searchParams.get("role") || "vendor";
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const query: any = {};

    // Only filter by status if explicitly provided
    if (status) {
      query.status = status;
    }

    if (parentId) {
      query.parentCategory = parentId;
    }

    if (vendorId) {
      query.$or = [
        { vendor: vendorId },
        { role: { $in: ["admin", "master-admin"] } },
        { isDefault: true }
      ];
    } else if (role === "vendor") {
      query.$or = [
        { role: { $in: ["admin", "master-admin"] } },
        { isDefault: true }
      ];
    }
    // For admin/master-admin role, no additional filters - show all subcategories

    const subcategories = await SubCategory.find(query)
      .populate("vendor", "businessName")
      .populate("parentCategory", "name")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SubCategory.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: subcategories,
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
    console.error("Get subcategories error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

export const createSubcategory = async (req: NextRequest) => {
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

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Subcategory name is required" },
        { status: 400 }
      );
    }

    if (!parentCategory) {
      return NextResponse.json(
        { success: false, message: "Parent category is required for subcategories" },
        { status: 400 }
      );
    }

    const parent = await Category.findById(parentCategory);
    if (!parent) {
      return NextResponse.json(
        { success: false, message: "Parent category not found" },
        { status: 404 }
      );
    }

    let vendorName = "";
    if (vendorId && role === "vendor") {
      const vendor = await Vendor.findById(vendorId).select("businessName");
      if (!vendor) {
        return NextResponse.json(
          { success: false, message: "Vendor not found" },
          { status: 404 }
        );
      }
      vendorName = vendor.businessName;
    }

    const level = parent.level + 1;
    if (level > 3) {
      return NextResponse.json(
        { success: false, message: "Maximum category depth exceeded (3 levels max)" },
        { status: 400 }
      );
    }

    const slugBase = name.trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const slug = role === "vendor" && vendorId
      ? `${slugBase}-${vendorId.toString().slice(-6)}`
      : slugBase;

    const subcategory = await SubCategory.create({
      name: name.trim(),
      slug,
      description: description?.trim(),
      image,
      vendor: vendorId && role === "vendor" ? vendorId : undefined,
      vendorName: vendorName || undefined,
      role,
      parentCategory,
      level,
      isDefault: role !== "vendor",
    });

    await Category.findByIdAndUpdate(parentCategory, {
      $push: { subcategories: subcategory._id }
    });

    const populatedSubcategory = await SubCategory.findById(subcategory._id)
      .populate("vendor", "businessName")
      .populate("parentCategory", "name");

    return NextResponse.json(
      {
        success: true,
        message: "Subcategory created successfully",
        data: populatedSubcategory,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Create subcategory error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Subcategory with this name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

export const updateSubcategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const {
      name,
      description,
      image,
      status,
      sortOrder
    } = await req.json();

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return NextResponse.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (image !== undefined) updateData.image = image;
    if (status !== undefined) updateData.status = status;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const updatedSubcategory = await SubCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("vendor", "businessName")
     .populate("parentCategory", "name");

    return NextResponse.json(
      {
        success: true,
        message: "Subcategory updated successfully",
        data: updatedSubcategory,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update subcategory error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Subcategory with this name already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

export const deleteSubcategory = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;

    const subcategory = await SubCategory.findById(id);
    if (!subcategory) {
      return NextResponse.json(
        { success: false, message: "Subcategory not found" },
        { status: 404 }
      );
    }

    if (subcategory.parentCategory) {
      await Category.findByIdAndUpdate(subcategory.parentCategory, {
        $pull: { subcategories: subcategory._id }
      });
    }

    await SubCategory.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Subcategory deleted successfully",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Delete subcategory error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};
