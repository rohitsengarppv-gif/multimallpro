import { NextRequest, NextResponse } from "next/server";
import connectDB from "../config/mongoose";
import Wishlist from "../models/Wishlist";
import Product from "../models/Product";
import User from "../models/User";

// Add item to wishlist
export async function addToWishlist(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required"
      }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required"
      }, { status: 400 });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found"
      }, { status: 404 });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return NextResponse.json({
        success: false,
        message: "Product already in wishlist"
      }, { status: 409 });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      userId,
      productId
    });

    return NextResponse.json({
      success: true,
      message: "Product added to wishlist",
      data: wishlistItem
    }, { status: 201 });

  } catch (error: any) {
    console.error("Add to wishlist error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to add to wishlist"
    }, { status: 500 });
  }
}

// Remove item from wishlist
export async function removeFromWishlist(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required"
      }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID is required"
      }, { status: 400 });
    }

    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return NextResponse.json({
        success: false,
        message: "Item not found in wishlist"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist"
    });

  } catch (error: any) {
    console.error("Remove from wishlist error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to remove from wishlist"
    }, { status: 500 });
  }
}

// Get user's wishlist
export async function getWishlist(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User ID is required"
      }, { status: 401 });
    }

    const wishlistItems = await Wishlist.find({ userId })
      .populate({
        path: "productId",
        populate: {
          path: "vendor",
          select: "businessName"
        }
      })
      .sort({ addedAt: -1 });

    // Filter out items where product might have been deleted
    const validItems = wishlistItems.filter(item => item.productId);

    return NextResponse.json({
      success: true,
      data: validItems
    });

  } catch (error: any) {
    console.error("Get wishlist error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to get wishlist"
    }, { status: 500 });
  }
}

// Check if product is in wishlist
export async function checkWishlistStatus(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");

    if (!userId || !productId) {
      return NextResponse.json({
        success: false,
        message: "User ID and Product ID are required"
      }, { status: 400 });
    }

    const wishlistItem = await Wishlist.findOne({ userId, productId });

    return NextResponse.json({
      success: true,
      data: {
        inWishlist: !!wishlistItem
      }
    });

  } catch (error: any) {
    console.error("Check wishlist status error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to check wishlist status"
    }, { status: 500 });
  }
}
