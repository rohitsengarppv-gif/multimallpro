import { NextRequest, NextResponse } from "next/server";
import HomeSetting from "@/app/api/models/HomeSetting";
import connectDB from "@/app/api/config/mongoose";
import { deleteFromCloudinary } from "@/app/api/utils/cloudinary";

// GET /api/routes/home-settings - Get home settings (single document)
export const getHomeSettings = async (req: NextRequest) => {
  try {
    await connectDB();

    // Get the first (and only) document
    let settings = await HomeSetting.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await HomeSetting.create({
        name: "MultiVendor",
        tagline: "Where Great Products Meet Happy Customers",
        supportEmail: "support@multivendor.com",
        supportPhone: "+1 (555) 123-4567",
        footerMessage: "© 2024 MultiVendor. All rights reserved.",
        announcement: {
          enabled: false,
          message: "",
          link: "",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: settings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get home settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PUT /api/routes/home-settings - Update home settings
export const updateHomeSettings = async (req: NextRequest) => {
  try {
    await connectDB();

    const {
      name,
      tagline,
      logo,
      favicon,
      supportEmail,
      supportPhone,
      footerMessage,
      announcement,
    } = await req.json();

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Marketplace name is required" },
        { status: 400 }
      );
    }

    if (!tagline || !tagline.trim()) {
      return NextResponse.json(
        { success: false, message: "Tagline is required" },
        { status: 400 }
      );
    }

    if (!supportEmail || !supportEmail.trim()) {
      return NextResponse.json(
        { success: false, message: "Support email is required" },
        { status: 400 }
      );
    }

    if (!supportPhone || !supportPhone.trim()) {
      return NextResponse.json(
        { success: false, message: "Support phone is required" },
        { status: 400 }
      );
    }

    if (!footerMessage || !footerMessage.trim()) {
      return NextResponse.json(
        { success: false, message: "Footer message is required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(supportEmail)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Get existing settings or create new
    let settings = await HomeSetting.findOne();

    const updateData: any = {
      name: name.trim(),
      tagline: tagline.trim(),
      supportEmail: supportEmail.trim().toLowerCase(),
      supportPhone: supportPhone.trim(),
      footerMessage: footerMessage.trim(),
      announcement: {
        enabled: announcement?.enabled || false,
        message: announcement?.message?.trim() || "",
        link: announcement?.link?.trim() || "",
      },
    };

    // Update logo if provided and delete old one from Cloudinary
    if (logo && logo.url) {
      // Delete old logo from Cloudinary if it exists and is different
      if (settings?.logo?.public_id && settings.logo.public_id !== logo.public_id) {
        try {
          await deleteFromCloudinary(settings.logo.public_id);
          console.log('Old logo deleted from Cloudinary:', settings.logo.public_id);
        } catch (error) {
          console.error('Failed to delete old logo from Cloudinary:', error);
          // Continue even if deletion fails
        }
      }
      updateData.logo = logo;
    }

    // Update favicon if provided and delete old one from Cloudinary
    if (favicon && favicon.url) {
      // Delete old favicon from Cloudinary if it exists and is different
      if (settings?.favicon?.public_id && settings.favicon.public_id !== favicon.public_id) {
        try {
          await deleteFromCloudinary(settings.favicon.public_id);
          console.log('Old favicon deleted from Cloudinary:', settings.favicon.public_id);
        } catch (error) {
          console.error('Failed to delete old favicon from Cloudinary:', error);
          // Continue even if deletion fails
        }
      }
      updateData.favicon = favicon;
    }

    if (settings) {
      // Update existing settings
      settings = await HomeSetting.findByIdAndUpdate(
        settings._id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new settings
      settings = await HomeSetting.create(updateData);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Home settings updated successfully",
        data: settings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update home settings error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// DELETE /api/routes/home-settings - Reset to default settings
export const resetHomeSettings = async (req: NextRequest) => {
  try {
    await connectDB();

    // Delete existing settings
    await HomeSetting.deleteMany({});

    // Create default settings
    const defaultSettings = await HomeSetting.create({
      name: "MultiVendor",
      tagline: "Where Great Products Meet Happy Customers",
      supportEmail: "support@multivendor.com",
      supportPhone: "+1 (555) 123-4567",
      footerMessage: "© 2024 MultiVendor. All rights reserved.",
      announcement: {
        enabled: false,
        message: "",
        link: "",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Home settings reset to default",
        data: defaultSettings,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Reset home settings error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
