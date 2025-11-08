"use client";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import ProductCard, { ProductCardData } from "./ProductCard";

const products: ProductCardData[] = [
  {
    id: "p1",
    name: "Tuvalu Solid Pine Pre-Slotted Slat Wooden Mahagany",
    price: 269.00,
    originalPrice: 359.00,
    rating: 4.5,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    brand: "WoodCraft",
    category: "Furniture",
    inStock: true,
    discount: 25
  },
  {
    id: "p2",
    name: "Mediaeval Square Pillow Bag, Duck Blue, White",
    price: 459.50,
    originalPrice: 656.43,
    rating: 4.3,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=400&h=400&fit=crop",
    brand: "HomeDecor",
    category: "Home & Garden",
    inStock: true,
    discount: 30
  },
  {
    id: "p3",
    name: "Mediaeval Square Throw Pillow Bag, Dark Blue, White",
    price: 569.00,
    originalPrice: 669.00,
    rating: 4.7,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=400&h=400&fit=crop",
    brand: "ComfortPlus",
    category: "Home & Garden",
    inStock: true,
    discount: 15
  },
  {
    id: "p4",
    name: "Mediaeval Square Throw Pillow Bag, Duck Blue, White",
    price: 599.00,
    originalPrice: 665.56,
    rating: 4.2,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=400&h=400&fit=crop",
    brand: "LuxuryHome",
    category: "Home & Garden",
    inStock: true,
    discount: 10
  },
  {
    id: "p5",
    name: "Bulky Plaid Alternative Wicker Globe Bronze",
    price: 499.00,
    originalPrice: 665.33,
    rating: 4.6,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    brand: "ArtisanCraft",
    category: "Home & Garden",
    inStock: true,
    discount: 25
  },
  {
    id: "p6",
    name: "Modern Square Throw Pillow Bag",
    price: 399.00,
    originalPrice: 499.00,
    rating: 4.4,
    reviews: 145,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    brand: "ModernHome",
    category: "Home & Garden",
    inStock: true,
    discount: 20
  },
  {
    id: "p7",
    name: "Wicker Globe Bronze Decor",
    price: 299.00,
    originalPrice: 399.00,
    rating: 4.8,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop",
    brand: "DecorPlus",
    category: "Furniture",
    inStock: true,
    discount: 25
  },
  {
    id: "p8",
    name: "Mediaeval Square Throw Pillow Bag, Duck Blue, White",
    price: 599.00,
    originalPrice: 731.71,
    image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&h=600&fit=crop",
    brand: "LuxuryHome",
    category: "Home & Garden",
    inStock: true,
    rating: 4.2,
    reviews: 178,
    discount: 18
  },
];

export default function TrendingGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      {/* Header row */}
      <div className="mb-6 flex items-center justify-between animate-fadeIn">
        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white uppercase tracking-wide shadow-md">
            TRENDING ITEMS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          {[
            "All",
            "Furniture",
            "Electronics",
            "Fashion",
            "Beauty",
            "Food",
          ].map((t, i) => (
            <button 
              key={t} 
              className={`font-semibold transition-all duration-200 hover:text-rose-600 hover:scale-105 ${
                i === 0 ? "text-rose-600" : "text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: Service Cards and Promo Banner in Row, Mobile: Service Cards Carousel */}
      <div className="mb-8">
        {/* Desktop Layout - Service Cards in 2x2 Grid */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 animate-slideIn">
          {/* Service Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Free Delivery Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col items-center text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  🚚
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">FREE DELIVERY</p>
                  <p className="text-gray-500 text-xs">From $89.00</p>
                </div>
              </div>
            </div>

            {/* Order Protection Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col items-center text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  🛡️
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">ORDER PROTECTION</p>
                  <p className="text-gray-500 text-xs">Refund/Resent 120 Day</p>
                </div>
              </div>
            </div>

            {/* Payment Security Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col items-center text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  💳
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">PAYMENT SECURITY</p>
                  <p className="text-gray-500 text-xs">SSL Secure Payment</p>
                </div>
              </div>
            </div>

            {/* 24/7 Support Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex flex-col items-center text-center">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                  🎧
                </span>
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">24/7 SUPPORT</p>
                  <p className="text-gray-500 text-xs">Dedicated Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg group">
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&h=800&fit=crop"
                alt="Armchair furniture"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute left-5 bottom-5">
                <p className="text-xs text-white/90 font-semibold mb-1">up to 50% OFF</p>
                <h4 className="max-w-[200px] text-xl font-bold text-white leading-tight mb-3">
                  ARMCHAIR<br />FURNITURE
                </h4>
                <button className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-rose-600 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md">
                  Shop now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Service Cards Carousel */}
        <div className="lg:hidden mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 pb-4" style={{width: 'max-content'}}>
              <div className="flex-shrink-0 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-lg">
                    🚚
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">FREE DELIVERY</p>
                    <p className="text-gray-500 text-xs">From $89.00</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-lg">
                    🛡️
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">ORDER PROTECTION</p>
                    <p className="text-gray-500 text-xs">Refund/Resent 120 Day</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-lg">
                    💳
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">PAYMENT SECURITY</p>
                    <p className="text-gray-500 text-xs">SSL Secure Payment</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-rose-50 to-pink-50 text-lg">
                    🎧
                  </span>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">24/7 SUPPORT</p>
                    <p className="text-gray-500 text-xs">Dedicated Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Promo Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg group mt-4">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&h=800&fit=crop"
                alt="Armchair furniture"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute left-4 bottom-4">
                <p className="text-xs text-white/90 font-semibold mb-1">up to 50% OFF</p>
                <h4 className="text-lg font-bold text-white leading-tight mb-2">
                  ARMCHAIR<br />FURNITURE
                </h4>
                <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-gray-50 transition-all duration-200 shadow-md">
                  Shop now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - 5 products in 1 row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {products.slice(0, 5).map((product, idx) => (
          <div key={product.id} style={{animationDelay: `${idx * 0.05}s`}}>
            <ProductCard
              product={product}
              className="animate-slideUp mobile-optimized"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.7s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Mobile optimizations for ProductCard in TrendingGrid */
        @media (max-width: 768px) {
          /* Hide mobile add to cart button completely */
          .mobile-optimized .mobile-cart-button {
            display: none !important;
          }
          
          /* Hide rating stars and reviews */
          .mobile-optimized .mobile-rating {
            display: none !important;
          }
          
          .mobile-optimized .mobile-reviews {
            display: none !important;
          }
          
          /* Hide any element with md:hidden class (mobile cart button) */
          .mobile-optimized .md\\:hidden {
            display: none !important;
          }
          
          /* Make product titles smaller and limit to 2 lines */
          .mobile-optimized h3 {
            font-size: 0.75rem !important;
            line-height: 1rem !important;
            margin-bottom: 0.25rem !important;
            -webkit-line-clamp: 2 !important;
            display: -webkit-box !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          
          /* Reduce padding */
          .mobile-optimized .p-4 {
            padding: 0.5rem !important;
          }
          
          /* Adjust margins */
          .mobile-optimized .mb-2 {
            margin-bottom: 0.25rem !important;
          }
          
          .mobile-optimized .mb-3 {
            margin-bottom: 0.25rem !important;
          }
          
          /* Make price text smaller */
          .mobile-optimized .text-lg {
            font-size: 0.875rem !important;
          }
          
          /* Make brand text smaller */
          .mobile-optimized .text-sm {
            font-size: 0.75rem !important;
          }
          
          /* Hide hover buttons on mobile */
          .mobile-optimized .opacity-0 {
            display: none !important;
          }
          
          /* Ensure no cart buttons show on mobile */
          .mobile-optimized button[class*="cart"],
          .mobile-optimized button[class*="Cart"] {
            display: none !important;
          }
        }
        
        /* Ensure 5 products layout on larger screens */
        @media (min-width: 1024px) {
          .grid-cols-2.sm\\:grid-cols-3.md\\:grid-cols-4.lg\\:grid-cols-5 {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </section>
  );
}