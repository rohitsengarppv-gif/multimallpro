import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Admin from "@/app/api/models/Admin";

// GET endpoint to check master admin status and test connection
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Check for any master admin
    const masterAdmin = await Admin.findOne({ role: "master" });
    
    // Check for admin with the email
    const emailAdmin = await Admin.findOne({ email: "rohitsengar02@gmail.com" });
    
    // Count all admins
    const totalAdmins = await Admin.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        masterExists: !!masterAdmin,
        masterData: masterAdmin ? {
          id: masterAdmin._id,
          email: masterAdmin.email,
          name: masterAdmin.name,
          role: masterAdmin.role,
          status: masterAdmin.status
        } : null,
        emailExists: !!emailAdmin,
        emailData: emailAdmin ? {
          id: emailAdmin._id,
          email: emailAdmin.email,
          role: emailAdmin.role,
          status: emailAdmin.status
        } : null,
        totalAdmins
      }
    });

  } catch (error: any) {
    console.error("Test master admin error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to test master admin",
        error: error.toString()
      },
      { status: 500 }
    );
  }
}
