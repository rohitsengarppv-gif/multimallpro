import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Address from "@/app/api/models/Address";

// Helper function to get user ID from request
const getUserId = (req: NextRequest) => {
  return req.headers.get("x-user-id");
};

// GET /api/addresses - Get all addresses for a user
export const getAddresses = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const addresses = await Address.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error: any) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// POST /api/addresses - Create new address
export const createAddress = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      addressType,
      isDefault,
    } = body;

    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !city || !state || !zipCode) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // If this is the first address, make it default
    const addressCount = await Address.countDocuments({ user: userId });
    const shouldBeDefault = addressCount === 0 ? true : isDefault;

    const address = await Address.create({
      user: userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country: country || "India",
      addressType: addressType || "home",
      isDefault: shouldBeDefault,
    });

    return NextResponse.json({
      success: true,
      data: address,
      message: "Address created successfully",
    });
  } catch (error: any) {
    console.error("Create address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// GET /api/addresses/:id - Get single address
export const getAddressById = async (req: NextRequest, id: string) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const address = await Address.findOne({ _id: id, user: userId });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: address,
    });
  } catch (error: any) {
    console.error("Get address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PATCH /api/addresses/:id - Update address
export const updateAddress = async (req: NextRequest, id: string) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const address = await Address.findOne({ _id: id, user: userId });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      addressType,
      isDefault,
    } = body;

    // Update fields
    if (fullName !== undefined) address.fullName = fullName;
    if (phone !== undefined) address.phone = phone;
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;
    if (country !== undefined) address.country = country;
    if (addressType !== undefined) address.addressType = addressType;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    return NextResponse.json({
      success: true,
      data: address,
      message: "Address updated successfully",
    });
  } catch (error: any) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// DELETE /api/addresses/:id - Delete address
export const deleteAddress = async (req: NextRequest, id: string) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const address = await Address.findOne({ _id: id, user: userId });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // If deleting default address, set another address as default
    if (address.isDefault) {
      const nextAddress = await Address.findOne({
        user: userId,
        _id: { $ne: id },
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    await Address.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PATCH /api/addresses/:id/default - Set address as default
export const setDefaultAddress = async (req: NextRequest, id: string) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const address = await Address.findOne({ _id: id, user: userId });

    if (!address) {
      return NextResponse.json(
        { success: false, message: "Address not found" },
        { status: 404 }
      );
    }

    // Unset all other default addresses
    await Address.updateMany({ user: userId }, { isDefault: false });

    // Set this address as default
    address.isDefault = true;
    await address.save();

    return NextResponse.json({
      success: true,
      data: address,
      message: "Default address updated successfully",
    });
  } catch (error: any) {
    console.error("Set default address error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
