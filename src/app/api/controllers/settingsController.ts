import { NextRequest, NextResponse } from "next/server";
import Vendor from "@/app/api/models/Vendor";
import connectDB from "@/app/api/config/mongoose";
import bcrypt from "bcryptjs";

/**
 * @desc    Get vendor profile settings
 * @route   GET /api/settings/profile
 * @access  Private
 */
export const getVendorProfile = async (req: NextRequest) => {
  try {
    await connectDB();

    // Get vendor ID from request (you'll need to add authentication middleware)
    const vendorId = req.headers.get("x-vendor-id");
    
    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required" },
        { status: 401 }
      );
    }

    const vendor = await Vendor.findById(vendorId).select("-password");

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: vendor,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Get vendor profile error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

/**
 * @desc    Update vendor profile (name, avatar, bio)
 * @route   PUT /api/settings/profile
 * @access  Private
 */
export const updateVendorProfile = async (req: NextRequest) => {
  try {
    await connectDB();

    const vendorId = req.headers.get("x-vendor-id");
    console.log("Update vendor profile - Vendor ID:", vendorId);
    
    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required" },
        { status: 401 }
      );
    }

    const { firstName, lastName, avatar, bio } = await req.json();
    console.log("Update data:", { firstName, lastName, hasAvatar: !!avatar, bioLength: bio?.length || 0 });

    // Validation
    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: "First name and last name are required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      firstName,
      lastName,
    };

    if (avatar) {
      console.log("Avatar data received:", JSON.stringify(avatar));
      updateData.avatar = {
        public_id: avatar.public_id,
        url: avatar.url
      };
    }

    if (bio !== undefined) {
      updateData.bio = bio;
    }

    console.log("Final update data:", JSON.stringify(updateData, null, 2));

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!vendor) {
      console.error("Vendor not found with ID:", vendorId);
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    console.log("Vendor profile updated successfully. Avatar saved:", !!vendor.avatar);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: vendor,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update vendor profile error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

/**
 * @desc    Update store settings (name, description, categories, address)
 * @route   PUT /api/settings/store
 * @access  Private
 */
export const updateStoreSettings = async (req: NextRequest) => {
  try {
    await connectDB();

    const vendorId = req.headers.get("x-vendor-id");
    console.log("Update store settings - Vendor ID:", vendorId);
    
    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required" },
        { status: 401 }
      );
    }

    const {
      businessName,
      businessDescription,
      businessType,
      website,
      productCategories,
      productTypes,
      averageOrderValue,
      monthlyVolume,
      businessAddress,
      city,
      state,
      zipCode,
    } = await req.json();
    
    console.log("Store update data:", { 
      businessName, 
      categoriesCount: productCategories?.length || 0,
      hasWebsite: !!website 
    });

    // Validation
    if (!businessName || !businessDescription) {
      return NextResponse.json(
        { success: false, message: "Store name and description are required" },
        { status: 400 }
      );
    }

    if (!productCategories || productCategories.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please select at least one category" },
        { status: 400 }
      );
    }

    if (!businessAddress || !city || !state) {
      return NextResponse.json(
        { success: false, message: "Complete address is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      businessName,
      businessDescription,
      productCategories,
      businessAddress,
      city,
      state,
      zipCode,
      country: "India", // Default country as per requirement
    };

    // Add optional fields if provided
    if (businessType) updateData.businessType = businessType;
    if (website) updateData.website = website;
    if (productTypes) updateData.productTypes = productTypes;
    if (averageOrderValue) updateData.averageOrderValue = averageOrderValue;
    if (monthlyVolume) updateData.monthlyVolume = monthlyVolume;

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!vendor) {
      console.error("Vendor not found with ID:", vendorId);
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    console.log("Store settings updated successfully for vendor:", vendorId);

    return NextResponse.json(
      {
        success: true,
        message: "Store settings updated successfully",
        data: vendor,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update store settings error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};

/**
 * @desc    Update vendor password
 * @route   PUT /api/settings/security
 * @access  Private
 */
export const updatePassword = async (req: NextRequest) => {
  try {
    await connectDB();

    const vendorId = req.headers.get("x-vendor-id");
    
    if (!vendorId) {
      return NextResponse.json(
        { success: false, message: "Vendor ID is required" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All password fields are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "New passwords do not match" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Get vendor with password
    const vendor = await Vendor.findById(vendorId).select("+password");

    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "Vendor not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isPasswordValid = await vendor.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Update password
    vendor.password = newPassword;
    await vendor.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Update password error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
};
