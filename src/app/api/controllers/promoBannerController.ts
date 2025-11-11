import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import PromoBanner from "../models/PromoBanner";

// Get all promo banners (with filtering for active/admin)
export const getPromoBanners = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const position = searchParams.get("position"); // "top" or "bottom"
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    let query: any = {};

    if (!isAdmin) {
      // For public API, only show active banners within date range
      const now = new Date();
      query = {
        isActive: true,
        $or: [
          { startDate: { $lte: now }, endDate: null },
          { startDate: { $lte: now }, endDate: { $gte: now } }
        ]
      };
    }

    if (position) {
      query.position = position;
    }

    const banners = await PromoBanner.find(query)
      .sort({ position: 1, order: 1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await PromoBanner.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        banners,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching promo banners:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch promo banners" },
      { status: 500 }
    );
  }
};

// Create new promo banner
export const createPromoBanner = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const {
      title,
      subtitle,
      price,
      badge,
      image,
      buttonText,
      buttonLink,
      position,
      isActive,
      order,
      startDate,
      endDate
    } = body;

    // Validation
    if (!title || !badge?.text || !image?.url || !image?.public_id || !position) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["top", "bottom"].includes(position)) {
      return NextResponse.json(
        { success: false, message: "Position must be 'top' or 'bottom'" },
        { status: 400 }
      );
    }

    const banner = new PromoBanner({
      title,
      subtitle,
      price,
      badge: {
        text: badge.text,
        icon: badge.icon || "✨",
        color: badge.color || "rose"
      },
      image,
      buttonText: buttonText || "Shop now",
      buttonLink: buttonLink || "/shop",
      position,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
    });

    await banner.save();

    return NextResponse.json({
      success: true,
      message: "Promo banner created successfully",
      data: banner
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating promo banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create promo banner" },
      { status: 500 }
    );
  }
};

// Update promo banner
export const updatePromoBanner = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bannerId = searchParams.get("id");

    if (!bannerId) {
      return NextResponse.json(
        { success: false, message: "Banner ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updateData = { ...body };

    // Convert date strings to Date objects
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    // Validate position if provided
    if (updateData.position && !["top", "bottom"].includes(updateData.position)) {
      return NextResponse.json(
        { success: false, message: "Position must be 'top' or 'bottom'" },
        { status: 400 }
      );
    }

    const banner = await PromoBanner.findByIdAndUpdate(
      bannerId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Promo banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Promo banner updated successfully",
      data: banner
    });
  } catch (error) {
    console.error("Error updating promo banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update promo banner" },
      { status: 500 }
    );
  }
};

// Delete promo banner
export const deletePromoBanner = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bannerId = searchParams.get("id");

    if (!bannerId) {
      return NextResponse.json(
        { success: false, message: "Banner ID is required" },
        { status: 400 }
      );
    }

    const banner = await PromoBanner.findByIdAndDelete(bannerId);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Promo banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Promo banner deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting promo banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete promo banner" },
      { status: 500 }
    );
  }
};

// Get single promo banner
export const getPromoBanner = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const bannerId = searchParams.get("id");

    if (!bannerId) {
      return NextResponse.json(
        { success: false, message: "Banner ID is required" },
        { status: 400 }
      );
    }

    const banner = await PromoBanner.findById(bannerId);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Promo banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error("Error fetching promo banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch promo banner" },
      { status: 500 }
    );
  }
};
