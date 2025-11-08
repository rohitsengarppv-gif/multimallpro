import { NextRequest, NextResponse } from "next/server";
import Vendor from "@/app/api/models/Vendor";
import connectDB from "@/app/api/config/mongoose";

export const registerVendor = async (req: NextRequest) => {
  try {
    await connectDB();

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      businessName,
      businessType,
      businessAddress,
      city,
      state,
      zipCode,
      country,
      website,
      businessDescription,
      productCategories,
      productTypes,
      averageOrderValue,
      monthlyVolume,
      businessLicense,
      taxId,
      bankAccount,
      termsAccepted,
      marketingConsent,
    } = await req.json();

    console.log('Received vendor data:', {
      email,
      website,
      businessLicense: businessLicense ? 'present' : 'missing'
    });

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !businessName ||
      !businessType ||
      !businessAddress ||
      !city ||
      !state ||
      !businessDescription ||
      !productCategories ||
      !taxId ||
      !bankAccount ||
      termsAccepted !== true
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    if (productCategories.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please select at least one product category" },
        { status: 400 }
      );
    }

    if (!taxId || !bankAccount) {
      return NextResponse.json(
        { success: false, message: "Tax ID and bank account information are required" },
        { status: 400 }
      );
    }

    if (!termsAccepted) {
      return NextResponse.json(
        { success: false, message: "Please accept the terms and conditions" },
        { status: 400 }
      );
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return NextResponse.json(
        { success: false, message: "Vendor with this email already exists" },
        { status: 400 }
      );
    }

    // Create vendor
    const vendor = await Vendor.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      businessName,
      businessType,
      businessAddress,
      city,
      state,
      zipCode,
      country: country || "United States",
      website,
      businessDescription,
      productCategories,
      productTypes,
      averageOrderValue,
      monthlyVolume,
      businessLicense,
      taxId,
      bankAccount,
      termsAccepted,
      marketingConsent: marketingConsent || false,
      status: "pending", // Vendor starts with pending status
    });

    // Generate JWT token
    const token = vendor.getSignedJwtToken();

    // Remove password from response
    const vendorResponse = {
      _id: vendor._id,
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      email: vendor.email,
      phone: vendor.phone,
      businessName: vendor.businessName,
      businessType: vendor.businessType,
      status: vendor.status,
      createdAt: vendor.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Vendor registration submitted successfully. Please check your email for verification.",
        data: vendorResponse,
        token,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Vendor registration error:", error);

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

export const loginVendor = async (req: NextRequest) => {
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

    // Check if vendor exists and get password
    const vendor = await Vendor.findOne({ email }).select("+password");
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if vendor is approved
    if (vendor.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Your account is pending approval. Please contact support." },
        { status: 403 }
      );
    }

    // Check password
    const isPasswordValid = await vendor.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = vendor.getSignedJwtToken();

    // Remove password from response
    const vendorResponse = {
      _id: vendor._id,
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      email: vendor.email,
      phone: vendor.phone,
      businessName: vendor.businessName,
      businessType: vendor.businessType,
      status: vendor.status,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: vendorResponse,
        token,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Vendor login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

export const getVendors = async (req: NextRequest) => {
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

    const vendors = await Vendor.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Vendor.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: vendors,
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
    console.error("Get vendors error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};
