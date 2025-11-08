"use client";
import { useState } from "react";
import { Star, Heart, ShoppingCart, Eye, GitCompare } from "lucide-react";
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
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if card is wrapped in Link
    e.stopPropagation();
    
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
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open quick view modal - implement later
    console.log("Quick view:", product.id);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to compare - implement later
    console.log("Add to compare:", product.id);
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
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              isWishlisted 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleQuickView}
            className="h-8 w-8 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-blue-500 flex items-center justify-center transition-colors"
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleCompare}
            className="h-8 w-8 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-purple-500 flex items-center justify-center transition-colors"
            title="Add to Compare"
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Add to Cart - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
