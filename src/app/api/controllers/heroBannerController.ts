import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import HeroBanner from "../models/HeroBanner";

// Get all hero banners (with filtering for active/admin)
export const getHeroBanners = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
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

    const banners = await HeroBanner.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await HeroBanner.countDocuments(query);

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
    console.error("Error fetching hero banners:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hero banners" },
      { status: 500 }
    );
  }
};

// Create new hero banner
export const createHeroBanner = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      badge,
      image,
      buttonText,
      buttonLink,
      isActive,
      order,
      startDate,
      endDate
    } = body;

    // Validation
    if (!title || !subtitle || !description || !badge || !image?.url || !image?.public_id) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const banner = new HeroBanner({
      title,
      subtitle,
      description,
      badge,
      image,
      buttonText: buttonText || "Shop Now",
      buttonLink: buttonLink || "/shop",
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
    });

    await banner.save();

    return NextResponse.json({
      success: true,
      message: "Hero banner created successfully",
      data: banner
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating hero banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create hero banner" },
      { status: 500 }
    );
  }
};

// Update hero banner
export const updateHeroBanner = async (req: NextRequest) => {
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

    const banner = await HeroBanner.findByIdAndUpdate(
      bannerId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Hero banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hero banner updated successfully",
      data: banner
    });
  } catch (error) {
    console.error("Error updating hero banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update hero banner" },
      { status: 500 }
    );
  }
};

// Delete hero banner
export const deleteHeroBanner = async (req: NextRequest) => {
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

    const banner = await HeroBanner.findByIdAndDelete(bannerId);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Hero banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hero banner deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting hero banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete hero banner" },
      { status: 500 }
    );
  }
};

// Get single hero banner
export const getHeroBanner = async (req: NextRequest) => {
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

    const banner = await HeroBanner.findById(bannerId);

    if (!banner) {
      return NextResponse.json(
        { success: false, message: "Hero banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error("Error fetching hero banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch hero banner" },
      { status: 500 }
    );
  }
};
