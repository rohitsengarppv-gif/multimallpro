"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Heart } from "lucide-react";
import { ProductCardData } from "./ProductCard";
import Link from "next/link";

const recentlyViewedProducts: ProductCardData[] = [
  {
    id: "rv1",
    name: "Premium Wireless Earbuds",
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.8,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    brand: "AudioMax",
    category: "Electronics",
    inStock: true,
    discount: 28
  },
  {
    id: "rv2",
    name: "Smart Fitness Tracker",
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.6,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop",
    brand: "FitTech",
    category: "Electronics",
    inStock: true,
    discount: 25
  },
  {
    id: "rv3",
    name: "Minimalist Desk Lamp",
    price: 45.99,
    rating: 4.4,
    reviews: 167,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    brand: "LightCraft",
    category: "Home & Garden",
    inStock: true
  },
  {
    id: "rv4",
    name: "Ergonomic Mouse Pad",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.3,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    brand: "ComfortDesk",
    category: "Accessories",
    inStock: true,
    discount: 29
  },
  {
    id: "rv5",
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.7,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    brand: "SoundWave",
    category: "Electronics",
    inStock: true,
    discount: 20
  }
];

export default function RecentlyViewedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [itemsPerView, setItemsPerView] = useState(4);

  // Update items per view based on screen size
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // Mobile: 2 items
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 items
      } else {
        setItemsPerView(4); // Desktop: 4 items
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= recentlyViewedProducts.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, recentlyViewedProducts.length - itemsPerView) : prev - 1
    );
  };

  const toggleLike = (productId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recently Viewed</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {recentlyViewedProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-1/2 sm:w-1/3 lg:w-1/4 px-1 sm:px-2">
              <div className="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{product.discount}%
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(product.id);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                        likedItems.has(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/80 text-gray-600 hover:bg-white'
                      }`}
                    >
                      <Heart className={`h-3 w-3 ${likedItems.has(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-2 sm:p-3">
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-rose-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-600 mb-1 sm:mb-2">{product.brand}</p>
                    
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-rose-600">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
