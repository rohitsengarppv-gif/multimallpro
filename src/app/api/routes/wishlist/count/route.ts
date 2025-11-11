import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Wishlist from "@/app/api/models/Wishlist";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Count wishlist items for the user
    const count = await Wishlist.countDocuments({ user: userId });

    return NextResponse.json({
      success: true,
      data: {
        count
      }
    });
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch wishlist count" },
      { status: 500 }
    );
  }
}
