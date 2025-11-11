import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Admin from "@/app/api/models/Admin";

// DELETE endpoint to remove existing master admin (for testing/reset purposes)
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    // Delete any existing master admin
    const result = await Admin.deleteMany({ 
      $or: [
        { role: "master" },
        { email: "rohitsengar02@gmail.com" }
      ]
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} master admin(s)`,
      deletedCount: result.deletedCount
    });

  } catch (error: any) {
    console.error("Delete master admin error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to delete master admin" 
      },
      { status: 500 }
    );
  }
}
