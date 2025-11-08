import { NextRequest, NextResponse } from "next/server";
import Review2 from "@/app/api/models/Review2";
import Product from "@/app/api/models/Product";
import connectDB from "@/app/api/config/mongoose";

/**
 * @desc    Create a new review
 * @route   POST /api/reviews2
 * @access  Public
 */
export const createReview = async (req: NextRequest) => {
  try {
    await connectDB();

    const { productId, vendorId, user, rating, title, comment, images } = await req.json();

    // Validation
    if (!productId || !vendorId || !user?.name || !user?.email || !rating || !title || !comment) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review2.findOne({
      product: productId,
      "user.email": user.email,
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, message: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review2.create({
      product: productId,
      vendor: vendorId,
      user: {
        name: user.name,
        email: user.email,
        userId: user.userId,
      },
      rating,
      title,
      comment,
      images: images || [],
      verified: false, // Can be updated based on purchase verification
      status: "pending", // Reviews need approval
    });

    // Update product rating and review count
    await updateProductRating(productId);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted successfully and is pending approval",
        data: review,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

/**
 * @desc    Get reviews for a product
 * @route   GET /api/reviews2?productId=xxx
 * @access  Public
 */
export const getReviews = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const vendorId = searchParams.get("vendorId");
    const status = searchParams.get("status") || "approved";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let query: any = {};

    if (productId) {
      query.product = productId;
    }

    if (vendorId) {
      query.vendor = vendorId;
    }

    if (status) {
      query.status = status;
    }

    const reviews = await Review2.find(query)
      .populate({ path: "product", select: "name slug mainImage" })
      .populate({ path: "vendor", select: "businessName" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review2.countDocuments(query);

    // Calculate rating distribution
    const ratingDistribution = await Review2.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const averageRating = await Review2.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
        stats: {
          averageRating: averageRating[0]?.avgRating || 0,
          totalReviews: total,
          ratingDistribution,
        },
      },
    });
  } catch (error: any) {
    console.error("Get reviews error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

/**
 * @desc    Update review (approve/reject)
 * @route   PUT /api/reviews2/:id
 * @access  Private (Admin/Vendor)
 */
export const updateReview = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const { status, vendorReply } = await req.json();

    const review = await Review2.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    if (status) {
      review.status = status;
    }

    if (vendorReply) {
      review.vendorReply = {
        message: vendorReply,
        repliedAt: new Date(),
      };
    }

    await review.save();

    // Update product rating if status changed
    if (status === "approved" || status === "rejected") {
      await updateProductRating(review.product.toString());
    }

    return NextResponse.json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error: any) {
    console.error("Update review error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

/**
 * @desc    Mark review as helpful
 * @route   POST /api/reviews2/:id/helpful
 * @access  Public
 */
export const markHelpful = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const { userId, helpful } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const review = await Review2.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user already marked this review
    const alreadyMarked = review.helpfulBy.includes(userId);

    if (alreadyMarked) {
      return NextResponse.json(
        { success: false, message: "You have already marked this review" },
        { status: 400 }
      );
    }

    // Update helpful count
    if (helpful) {
      review.helpful += 1;
    } else {
      review.notHelpful += 1;
    }

    review.helpfulBy.push(userId);
    await review.save();

    return NextResponse.json({
      success: true,
      message: "Thank you for your feedback",
      data: {
        helpful: review.helpful,
        notHelpful: review.notHelpful,
      },
    });
  } catch (error: any) {
    console.error("Mark helpful error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews2/:id
 * @access  Private (Admin/User who created it)
 */
export const deleteReview = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const review = await Review2.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    const productId = review.product.toString();
    await review.deleteOne();

    // Update product rating after deletion
    await updateProductRating(productId);

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

/**
 * Helper function to update product rating
 */
async function updateProductRating(productId: string) {
  try {
    const stats = await Review2.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const rating = stats[0]?.avgRating || 0;
    const reviewCount = stats[0]?.count || 0;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(rating * 10) / 10, // Round to 1 decimal
      reviewCount,
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
}

import mongoose from "mongoose";
