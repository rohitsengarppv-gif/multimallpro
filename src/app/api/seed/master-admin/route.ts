import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Admin from "@/app/api/models/Admin";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Check if master admin already exists
    const existingMaster = await Admin.findOne({ role: "master" });
    
    if (existingMaster) {
      return NextResponse.json({
        success: true,
        message: "Master admin already exists",
        data: {
          email: existingMaster.email,
          exists: true
        }
      });
    }

    // Default master admin credentials
    const masterEmail = "rohitsengar02@gmail.com";
    const masterPassword = "ROhit@#602";

    // Create master admin (password will be hashed by the model's pre-save hook)
    const masterAdmin = await Admin.create({
      firstName: "Master",
      lastName: "Administrator",
      name: "Master Administrator",
      email: masterEmail,
      phone: "+91-0000000000",
      password: masterPassword, // Plain password - will be hashed by pre-save hook
      role: "master",
      department: "IT",
      status: "approved",
      isVerified: true,
      permissions: {
        canManageAdmins: true,
        canManageVendors: true,
        canManageProducts: true,
        canManageOrders: true,
        canManageUsers: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canManagePayments: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Master admin created successfully",
      data: {
        email: masterAdmin.email,
        name: masterAdmin.name,
        role: masterAdmin.role,
        created: true
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Seed master admin error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to create master admin" 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check if master admin exists
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const masterExists = await Admin.findOne({ role: "master" });

    return NextResponse.json({
      success: true,
      exists: !!masterExists,
      message: masterExists ? "Master admin exists" : "No master admin found"
    });

  } catch (error: any) {
    console.error("Check master admin error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to check master admin" 
      },
      { status: 500 }
    );
  }
}
