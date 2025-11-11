import { NextRequest, NextResponse } from "next/server";
import Discount from "@/app/api/models/Discount";

import connectDB from "@/app/api/config/mongoose";

// Get all discounts for a vendor
export const getDiscounts = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vendor = searchParams.get("vendor");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const query: any = {};
    
    if (vendor) {
      query.vendor = vendor;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const discounts = await Discount.find(query)
      .populate('vendor', 'businessName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Discount.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: discounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Get discounts error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Get single discount by ID
export const getDiscount = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const discount = await Discount.findById(id);

    if (!discount) {
      return NextResponse.json(
        { success: false, message: "Discount not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: discount,
    });
  } catch (error: any) {
    console.error("Get discount error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Create new discount
export const createDiscount = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const {
      code,
      name,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      usageCount,
      startDate,
      endDate,
      status,
      isActive,
      image,
      vendor,
      applicableProducts,
      applicableCategories,
      firstTimeCustomersOnly,
    } = body;

    // Check if code already exists
    const existingDiscount = await Discount.findOne({ code: code.toUpperCase() });
    if (existingDiscount) {
      return NextResponse.json(
        { success: false, message: "Discount code already exists" },
        { status: 400 }
      );
    }

    // Validate dates
    if (new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { success: false, message: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Create discount
    const discount = await Discount.create({
      code: code.toUpperCase(),
      name,
      description,
      type,
      value,
      minOrderAmount: minOrderAmount || 0,
      maxDiscount,
      usageLimit,
      usageCount: usageCount || 0,
      startDate,
      endDate,
      status: status || "draft",
      isActive: isActive !== undefined ? isActive : true,
      image: image ? { public_id: image, url: image } : undefined,
      vendor,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      firstTimeCustomersOnly: firstTimeCustomersOnly || false,
    });

    return NextResponse.json({
      success: true,
      data: discount,
      message: "Discount created successfully",
    });
  } catch (error: any) {
    console.error("Create discount error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Update discount
export const updateDiscount = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const body = await req.json();
    const {
      code,
      name,
      description,
      type,
      value,
      minOrderAmount,
      maxDiscount,
      usageLimit,
      usageCount,
      startDate,
      endDate,
      status,
      isActive,
      image,
      applicableProducts,
      applicableCategories,
      firstTimeCustomersOnly,
    } = body;

    // Check if discount exists
    const existingDiscount = await Discount.findById(id);
    if (!existingDiscount) {
      return NextResponse.json(
        { success: false, message: "Discount not found" },
        { status: 404 }
      );
    }

    // Check if code is being changed and if it conflicts
    if (code && code.toUpperCase() !== existingDiscount.code) {
      const codeExists = await Discount.findOne({ 
        code: code.toUpperCase(), 
        _id: { $ne: id } 
      });
      if (codeExists) {
        return NextResponse.json(
          { success: false, message: "Discount code already exists" },
          { status: 400 }
        );
      }
    }

    // Validate dates if provided
    const newStartDate = startDate ? new Date(startDate) : existingDiscount.startDate;
    const newEndDate = endDate ? new Date(endDate) : existingDiscount.endDate;
    
    if (newEndDate <= newStartDate) {
      return NextResponse.json(
        { success: false, message: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: any = {
      code: code ? code.toUpperCase() : existingDiscount.code,
      name: name || existingDiscount.name,
      description,
      type: type || existingDiscount.type,
      value: value !== undefined ? value : existingDiscount.value,
      minOrderAmount: minOrderAmount !== undefined ? minOrderAmount : existingDiscount.minOrderAmount,
      maxDiscount,
      usageLimit,
      usageCount: usageCount !== undefined ? usageCount : existingDiscount.usageCount,
      startDate: newStartDate,
      endDate: newEndDate,
      status: status || existingDiscount.status,
      image: image ? { public_id: image, url: image } : existingDiscount.image,
      applicableProducts: applicableProducts || existingDiscount.applicableProducts,
      applicableCategories: applicableCategories || existingDiscount.applicableCategories,
      firstTimeCustomersOnly: firstTimeCustomersOnly !== undefined ? firstTimeCustomersOnly : existingDiscount.firstTimeCustomersOnly,
    };

    // Only update isActive if explicitly provided
    if (isActive !== undefined) {
      updateData.isActive = isActive;
    }

    // Update discount
    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedDiscount,
      message: "Discount updated successfully",
    });
  } catch (error: any) {
    console.error("Update discount error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Delete discount
export const deleteDiscount = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const discount = await Discount.findById(id);

    if (!discount) {
      return NextResponse.json(
        { success: false, message: "Discount not found" },
        { status: 404 }
      );
    }

    await Discount.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Discount deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete discount error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// Validate discount code (for customers)
export const validateDiscountCode = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const { code, orderAmount, customerId } = body;

    const discount = await Discount.findOne({ 
      code: code.toUpperCase(),
      status: "active",
      isActive: true,
    });

    if (!discount) {
      return NextResponse.json(
        { success: false, message: "Invalid discount code" },
        { status: 404 }
      );
    }

    // Check if discount is within valid date range
    const now = new Date();
    if (now < discount.startDate || now > discount.endDate) {
      return NextResponse.json(
        { success: false, message: "Discount code has expired" },
        { status: 400 }
      );
    }

    // Check usage limit
    if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
      return NextResponse.json(
        { success: false, message: "Discount code usage limit reached" },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Minimum order amount of $${discount.minOrderAmount} required` 
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = (orderAmount * discount.value) / 100;
      if (discount.maxDiscount && discountAmount > discount.maxDiscount) {
        discountAmount = discount.maxDiscount;
      }
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }

    return NextResponse.json({
      success: true,
      data: {
        discount,
        discountAmount,
        finalAmount: orderAmount - discountAmount,
      },
    });
  } catch (error: any) {
    console.error("Validate discount error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
