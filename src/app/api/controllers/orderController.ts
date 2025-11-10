import { NextRequest, NextResponse } from "next/server";
import Order from "@/app/api/models/Order";
import Cart from "@/app/api/models/Cart";
import User from "@/app/api/models/User";
import Product from "@/app/api/models/Product";
import Vendor from "@/app/api/models/Vendor";
import connectDB from "@/app/api/config/mongoose";

// Helper function to get user ID from request
const getUserId = (req: NextRequest) => {
  return req.headers.get("x-user-id");
};

// GET /api/orders - Get all orders
export const getOrders = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const vendor = searchParams.get("vendor");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build query
    let query: any = {};

    if (userId) {
      query.customer = userId;
    }

    if (vendor) {
      query["items.vendor"] = vendor;
    }

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Execute query
    const skip = (page - 1) * limit;

    console.log('Fetching orders with query:', query);
    
    const orders = await Order.find(query)
      .populate({ path: "customer", select: "name email phone", model: User })
      .populate({ path: "items.product", select: "name images", model: Product })
      .populate({ path: "items.vendor", select: "businessName email", model: Vendor })
      .sort("-createdAt")
      .skip(skip)
      .limit(limit);
    
    console.log(`Found ${orders.length} orders`);

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

// POST /api/orders - Create new order
export const createOrder = async (req: NextRequest) => {
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
      items,
      subtotal,
      tax,
      shipping,
      discount,
      discountCode,
      total,
      paymentMethod,
      shippingAddress,
      notes,
    } = body;

    // Basic validation
    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please provide order items" },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, message: "Please provide shipping address" },
        { status: 400 }
      );
    }

    // Calculate estimated delivery (7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    // Create order
    const order = await Order.create({
      customer: userId,
      items,
      subtotal,
      tax: tax || 0,
      shipping: shipping || 0,
      discount: discount || 0,
      discountCode,
      total,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
      shippingAddress,
      estimatedDelivery,
      notes,
    });

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalItems: 0, totalPrice: 0 }
    );

    // Populate order details
    const populatedOrder = await Order.findById(order._id)
      .populate({ path: "customer", select: "name email phone", model: User })
      .populate({ path: "items.product", select: "name images", model: Product })
      .populate({ path: "items.vendor", select: "businessName email", model: Vendor });

    return NextResponse.json({
      success: true,
      data: populatedOrder,
      message: "Order placed successfully",
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// GET /api/orders/:id - Get single order
export const getOrderById = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const order = await Order.findById(id)
      .populate({ path: "customer", select: "name email phone", model: User })
      .populate({ path: "items.product", select: "name images", model: Product })
      .populate({ path: "items.vendor", select: "businessName email", model: Vendor });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PATCH /api/orders/:id - Update order
export const updateOrder = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const body = await req.json();
    const { status, paymentStatus, trackingNumber, notes } = body;

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (status !== undefined) order.status = status;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (notes !== undefined) order.notes = notes;

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate({ path: "customer", select: "name email phone", model: User })
      .populate({ path: "items.product", select: "name images", model: Product })
      .populate({ path: "items.vendor", select: "businessName email", model: Vendor });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: "Order updated successfully",
    });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// DELETE /api/orders/:id - Delete order (admin only)
export const deleteOrder = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of pending or cancelled orders
    if (order.status !== "pending" && order.status !== "cancelled") {
      return NextResponse.json(
        { success: false, message: "Cannot delete order in current status" },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PATCH /api/orders/:id/status - Update order status
export const updateOrderStatus = async (req: NextRequest, id: string) => {
  try {
    await connectDB();

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, message: "Please provide status" },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    order.status = status;
    await order.save();

    return NextResponse.json({
      success: true,
      data: order,
      message: "Order status updated successfully",
    });
  } catch (error: any) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
