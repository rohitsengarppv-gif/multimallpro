import { NextRequest } from "next/server";
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlistStatus } from "../../controllers/wishlistController";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  
  if (productId) {
    // Check if specific product is in wishlist
    return checkWishlistStatus(req);
  } else {
    // Get full wishlist
    return getWishlist(req);
  }
}

export async function POST(req: NextRequest) {
  return addToWishlist(req);
}

export async function DELETE(req: NextRequest) {
  return removeFromWishlist(req);
}
