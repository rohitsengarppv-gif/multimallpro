import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/api/models/Order";
import connectDB from "@/app/api/config/mongoose";

export const getOrders = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const customer = searchParams.get("customer");
    const vendor = searchParams.get("vendor");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    let query: any = {};

    if (customer) {
      query.customer = customer;
    }

    if (vendor) {
      query.vendor = vendor;
    }

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Execute query
    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("customer", "name email")
      .populate("vendor", "name email")
      .populate("items.product", "name sku images")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

export const createOrder = async (req: NextRequest) => {
  try {
    await connectDB();

    const body = await req.json();
    const {
      customer,
      items,
      subtotal,
      tax,
      shipping,
      discount,
      total,
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes,
      vendor,
    } = body;

    // Basic validation
    if (!customer || !items || items.length === 0 || !vendor) {
      return NextResponse.json(
        { success: false, message: "Please provide customer, items, and vendor" },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create({
      customer,
      items,
      subtotal,
      tax: tax || 0,
      shipping: shipping || 0,
      discount: discount || 0,
      total,
      paymentMethod,
      shippingAddress,
      billingAddress,
      notes,
      vendor,
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
