"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, Heart, Loader2 } from "lucide-react";
import { ProductCardData } from "./ProductCard";
import Link from "next/link";

export default function RecentlyViewedCarousel() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/routes/products?active=true&limit=15');
        const data = await response.json();

        if (data.success && data.data.products) {
          const transformed: ProductCardData[] = data.data.products.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.comparePrice,
            rating: product.rating || 4.0,
            reviews: product.reviewCount || 0,
            image: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400",
            category: product.category?.name || "Products",
            brand: product.vendor?.businessName || "Store",
            inStock: product.stock > 0,
            discount: product.comparePrice
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : undefined,
          }));

          setProducts(transformed.sort(() => 0.5 - Math.random()).slice(0, 10));
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Update items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recently Viewed</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

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
          {products.map((product: ProductCardData) => (
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
                      <span className="font-bold text-rose-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice}
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

