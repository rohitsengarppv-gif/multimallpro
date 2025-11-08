import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/api/config/mongoose";
import Cart from "@/app/api/models/Cart";
import Product from "@/app/api/models/Product";

// Helper function to get user ID from request (temporary header-based auth)
const getUserId = (req: NextRequest) => {
  return req.headers.get("x-user-id");
};

// GET /api/cart -> Get user's cart
export const getCart = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.productId",
      select: "name price stock isActive",
    });

    if (!cart) {
      // Return empty cart structure
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error: any) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// POST /api/cart -> Add item to cart
export const addToCart = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, name, price, originalPrice, quantity = 1, image, brand, discount, variant } = await req.json();

    console.log("Cart API received:", { productId, variant, hasVariant: !!variant });

    if (!productId || !name || !price || !image || !brand) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Product not found or unavailable" },
        { status: 404 }
      );
    }

    // Check stock availability
    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 400 }
      );
    }

    // Get vendor ID from product
    const vendorId = product.vendor;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        user: userId,
        items: [{
          productId,
          name,
          price,
          originalPrice,
          quantity,
          image,
          brand,
          discount,
          vendor: vendorId,
          variant,
        }],
      });
    } else {
      // Check if item with same product and variant already exists
      const existingItemIndex = cart.items.findIndex((item: any) => {
        const sameProduct = item.productId.toString() === productId;
        // Check if variants match (both undefined or same values)
        const sameVariant = JSON.stringify(item.variant || {}) === JSON.stringify(variant || {});
        return sameProduct && sameVariant;
      });

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newQuantity = cart.items[existingItemIndex].quantity + quantity;

        // Check if new quantity exceeds stock
        if (product.stock < newQuantity) {
          return NextResponse.json(
            { success: false, message: "Insufficient stock for requested quantity" },
            { status: 400 }
          );
        }

        cart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Add new item (different variant or first time)
        cart.items.push({
          productId,
          name,
          price,
          originalPrice,
          quantity,
          image,
          brand,
          discount,
          vendor: vendorId,
          variant,
        });
      }
    }

    await cart.save();

    console.log("Cart saved. Items:", cart.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      variant: item.variant,
    })));

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      data: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// PATCH /api/cart -> Update item quantity
export const updateCartItem = async (req: NextRequest) => {
  console.log("=== UPDATE CART ITEM CALLED ===");
  try {
    await connectDB();
    const userId = getUserId(req);

    console.log("User ID:", userId);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);
    
    const { productId, quantity, variant } = body;

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, message: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    if (quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Verify product stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Product not found or unavailable" },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: "Insufficient stock" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Find item by productId AND variant
    const itemIndex = cart.items.findIndex((item: any) => {
      const sameProduct = item.productId.toString() === productId;
      const sameVariant = JSON.stringify(item.variant || {}) === JSON.stringify(variant || {});
      return sameProduct && sameVariant;
    });

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Item not found in cart" },
        { status: 404 }
      );
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      data: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error: any) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// DELETE /api/cart -> Remove item from cart
export const removeFromCart = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { productId, variant } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Filter out item by productId AND variant
    cart.items = cart.items.filter((item: any) => {
      const sameProduct = item.productId.toString() === productId;
      const sameVariant = JSON.stringify(item.variant || {}) === JSON.stringify(variant || {});
      return !(sameProduct && sameVariant);
    });

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
      data: {
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error: any) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};

// DELETE /api/cart/all -> Clear entire cart
export const clearCart = async (req: NextRequest) => {
  try {
    await connectDB();
    const userId = getUserId(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    cart.items = [];
    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Cart cleared",
      data: {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      },
    });
  } catch (error: any) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
};
