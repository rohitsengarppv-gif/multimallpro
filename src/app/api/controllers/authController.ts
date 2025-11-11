import { NextRequest, NextResponse } from "next/server";
import User from "@/app/api/models/User";
import Admin from "@/app/api/models/Admin";
import connectDB from "@/app/api/config/mongoose";

export const register = async (req: NextRequest) => {
  try {
    await connectDB();

    const { name, email, password, role = "user" } = await req.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide name, email, and password" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = user.getSignedJwtToken();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

export const login = async (req: NextRequest) => {
  try {
    await connectDB();

    const { email, password, role } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide email and password" },
        { status: 400 }
      );
    }

    // Handle master admin login
    if (role === "master") {
      const admin = await Admin.findOne({ email }).select("+password");

      if (!admin) {
        return NextResponse.json(
          { success: false, message: "Invalid master admin credentials" },
          { status: 401 }
        );
      }

      // Check if admin is approved
      if (admin.status !== "approved") {
        return NextResponse.json(
          { success: false, message: "Master admin account is not approved" },
          { status: 401 }
        );
      }

      // Check if password matches
      const isMatch = await admin.comparePassword(password);

      if (!isMatch) {
        return NextResponse.json(
          { success: false, message: "Invalid master admin credentials" },
          { status: 401 }
        );
      }

      const token = admin.getSignedJwtToken();

      // Update last login
      await Admin.findByIdAndUpdate(admin._id, { lastLogin: new Date() });

      return NextResponse.json({
        success: true,
        data: {
          id: admin._id,
          name: admin.name || `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || "Master Admin",
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          status: admin.status,
        },
        token,
      });
    }

    // Handle regular user login
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = user.getSignedJwtToken();

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
