"use client";
import { useState, useEffect } from "react";
import { Star, Heart, ShoppingCart, GitCompare } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import Link from "next/link";

export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  brand: string;
  category: string;
  inStock: boolean;
  discount?: number;
  badge?: string;
};

type ProductCardProps = {
  product: ProductCardData;
  className?: string;
};

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { addItem } = useCart();

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      try {
        const user = JSON.parse(userData);
        const response = await fetch(`/api/routes/wishlist?productId=${product.id}`, {
          headers: {
            "x-user-id": user.id,
          },
        });
        const data = await response.json();
        if (data.success && data.data.inWishlist) {
          setIsWishlisted(true);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [product.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if card is wrapped in Link
    e.stopPropagation();
    
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Please login to add items to cart");
      window.location.href = "/auth/login";
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          image: product.image,
          brand: product.brand,
          discount: product.discount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Also add to local context for immediate UI update
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          brand: product.brand,
          inStock: product.inStock,
          discount: product.discount
        });
      } else {
        console.error("Failed to add to cart:", data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Please login to add items to wishlist");
      window.location.href = "/auth/login";
      return;
    }

    if (wishlistLoading) return;

    try {
      setWishlistLoading(true);
      const user = JSON.parse(userData);
      
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch("/api/routes/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({
            productId: product.id,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setIsWishlisted(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/routes/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({
            productId: product.id,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setIsWishlisted(true);
        } else if (data.message === "Product already in wishlist") {
          setIsWishlisted(true);
        }
      }
    } catch (error) {
      console.error("Error managing wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  return (
    <div className={`group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] ${className}`}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{product.discount}%
            </span>
          )}
          {product.badge && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlistToggle}
            className={`h-9 w-9 rounded-full flex items-center justify-center transition-colors shadow-md ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="h-9 w-9 rounded-full bg-white text-gray-600 hover:bg-rose-600 hover:text-white flex items-center justify-center transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:hover:text-gray-500"
            title={product.inStock ? "Add to Cart" : "Out of Stock"}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          
         
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          {/* Brand */}
          <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
          
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>
          
        
          
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
