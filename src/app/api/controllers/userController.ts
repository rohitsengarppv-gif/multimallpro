import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import User from "@/app/api/models/User";

// GET /api/users -> list users
export const listUsers = async (_req: NextRequest) => {
  try {
    await connectDB();
    const users = await User.find().select("-password");
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error("List users error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// POST /api/users -> create user (admin or open create)
export const createUser = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, role = "user", avatar, phone, address } = body || {};

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide name, email, and password" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({ name, email, password, role, avatar, phone, address });
    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// GET /api/users/[id]
export const getUserById = async (_req: NextRequest, id: string) => {
  try {
    await connectDB();
    const user = await User.findById(id).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PATCH /api/users/[id] -> update user including avatar
export const updateUser = async (req: NextRequest, id: string) => {
  try {
    await connectDB();
    const body = await req.json();
    const allowed = ["name", "email", "role", "avatar", "phone", "address", "isVerified", "password"];
    const updateData: any = {};
    for (const key of allowed) {
      if (key in body) updateData[key] = body[key];
    }

    // Note: password will be hashed by pre-save only on save(); using findByIdAndUpdate won't trigger it
    // Handle password update safely
    if (updateData.password) {
      const userDoc = await User.findById(id).select("+password");
      if (!userDoc) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }
      userDoc.password = updateData.password; // will be hashed by pre-save on save()
      if (updateData.name !== undefined) userDoc.name = updateData.name;
      if (updateData.email !== undefined) userDoc.email = updateData.email;
      if (updateData.role !== undefined) userDoc.role = updateData.role;
      if (updateData.avatar !== undefined) userDoc.avatar = updateData.avatar;
      if (updateData.phone !== undefined) userDoc.phone = updateData.phone;
      if (updateData.address !== undefined) userDoc.address = updateData.address;
      if (updateData.isVerified !== undefined) userDoc.isVerified = updateData.isVerified;
      await userDoc.save();
      const { password, ...rest } = userDoc.toObject();
      return NextResponse.json({ success: true, data: rest });
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// DELETE /api/users/[id]
export const deleteUser = async (_req: NextRequest, id: string) => {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// GET /api/users/me
export const getMe = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = req.headers.get("x-user-id"); // simple header-based for now; replace with JWT middleware
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Get me error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PATCH /api/users/me
export const updateMe = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = req.headers.get("x-user-id"); // replace with JWT middleware later
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const allowed = ["name", "avatar", "phone", "address"];
    const updateData: any = {};
    for (const key of allowed) {
      if (key in body) updateData[key] = body[key];
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Update me error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

