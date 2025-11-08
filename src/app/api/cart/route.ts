import { NextRequest, NextResponse } from "next/server";
import { getCart, addToCart, updateCartItem, removeFromCart } from "@/app/api/controllers/cartController";

export async function GET(req: NextRequest) {
  return getCart(req);
}

export async function POST(req: NextRequest) {
  return addToCart(req);
}

export async function PATCH(req: NextRequest) {
  console.log("=== PATCH ROUTE CALLED ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  
  try {
    const result = await updateCartItem(req);
    console.log("Controller returned:", result);
    return result;
  } catch (error) {
    console.error("Error in PATCH route:", error);
    return NextResponse.json(
      { success: false, message: "Route error: " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  return removeFromCart(req);
}
