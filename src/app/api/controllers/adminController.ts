import { NextRequest, NextResponse } from "next/server";
import Admin from "@/app/api/models/Admin";
import connectDB from "@/app/api/config/mongoose";

// @desc    Register admin
// @route   POST /api/admins/register
// @access  Public
export const registerAdmin = async (req: NextRequest) => {
  try {
    await connectDB();

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      department,
    } = await req.json();

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !department
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin with this email already exists" },
        { status: 400 }
      );
    }

    // Create admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      department,
      role: "admin",
      status: "pending", // Admin starts with pending status
    });

    // Remove password from response
    const adminResponse = {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      department: admin.department,
      role: admin.role,
      status: admin.status,
      createdAt: admin.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Admin registration submitted successfully. Please wait for master admin approval.",
        data: adminResponse,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Admin registration error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// @desc    Login admin
// @route   POST /api/admins/login
// @access  Public
export const loginAdmin = async (req: NextRequest) => {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide email and password" },
        { status: 400 }
      );
    }

    // Check if admin exists and get password
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if admin is approved
    if (admin.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Your account is pending approval. Please contact the master admin." },
        { status: 403 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = admin.getSignedJwtToken();

    // Remove password from response
    const adminResponse = {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      department: admin.department,
      role: admin.role,
      status: admin.status,
      lastLogin: admin.lastLogin,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: adminResponse,
        token,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// @desc    Get all admins
// @route   GET /api/admins
// @access  Private (Master Admin only)
export const getAdmins = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    let query: any = {};
    if (status) {
      query.status = status;
    }

    const admins = await Admin.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Admin.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: admins,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get admins error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// @desc    Get single admin
// @route   GET /api/admins/:id
// @access  Private
export const getAdminById = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: admin,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get admin error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// @desc    Approve admin
// @route   PUT /api/admins/:id/approve
// @access  Private (Master Admin only)
export const approveAdmin = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    admin.status = "approved";
    admin.isVerified = true;
    await admin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Admin approved successfully",
        data: {
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          status: admin.status,
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Approve admin error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// @desc    Reject admin
// @route   PUT /api/admins/:id/reject
// @access  Private (Master Admin only)
export const rejectAdmin = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    admin.status = "rejected";
    await admin.save();

    return NextResponse.json(
      {
        success: true,
        message: "Admin rejected successfully",
        data: {
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          status: admin.status,
        },
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Reject admin error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// @desc    Update admin
// @route   PUT /api/admins/:id
// @access  Private
export const updateAdmin = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const updateData = await req.json();

    // Don't allow updating password, role, or status through this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData.status;

    const admin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Admin updated successfully",
        data: admin,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update admin error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

// @desc    Delete admin
// @route   DELETE /api/admins/:id
// @access  Private (Master Admin only)
export const deleteAdmin = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();

    const { id } = await params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin not found" },
        { status: 404 }
      );
    }

    // Prevent deleting master admin
    if (admin.role === "master_admin") {
      return NextResponse.json(
        { success: false, message: "Cannot delete master admin" },
        { status: 403 }
      );
    }

    await Admin.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Admin deleted successfully",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Delete admin error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};
