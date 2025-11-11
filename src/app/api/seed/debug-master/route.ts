import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Admin from "@/app/api/models/Admin";
import bcrypt from "bcryptjs";

// GET endpoint to debug master admin
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Find master admin with password field
    const masterAdmin = await Admin.findOne({ 
      email: "rohitsengar02@gmail.com" 
    }).select("+password");

    if (!masterAdmin) {
      return NextResponse.json({
        success: false,
        message: "Master admin not found"
      });
    }

    // Test password manually
    const testPassword = "ROhit@#602";
    const passwordMatch = await bcrypt.compare(testPassword, masterAdmin.password);

    return NextResponse.json({
      success: true,
      debug: {
        email: masterAdmin.email,
        role: masterAdmin.role,
        status: masterAdmin.status,
        firstName: masterAdmin.firstName,
        lastName: masterAdmin.lastName,
        name: masterAdmin.name,
        department: masterAdmin.department,
        isVerified: masterAdmin.isVerified,
        passwordHashLength: masterAdmin.password?.length || 0,
        passwordStartsWith: masterAdmin.password?.substring(0, 7) || "",
        passwordTestResult: passwordMatch,
        hasCompareMethod: typeof masterAdmin.comparePassword === "function",
      }
    });

  } catch (error: any) {
    console.error("Debug master admin error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to debug master admin",
        error: error.toString()
      },
      { status: 500 }
    );
  }
}
