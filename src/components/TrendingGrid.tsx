"use client";
import { Heart, Eye, ShoppingCart, Loader2, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import ProductCard, { ProductCardData } from "./ProductCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  status: string;
}

export default function TrendingGrid() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch random products from API
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/routes/products?active=true&limit=30");
        const data = await response.json();

        if (data.success && data.data.products) {
          // Get random 5 products for trending
          const allProducts = data.data.products;
          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          const selectedProducts = shuffled.slice(0, 5);

          // Transform to ProductCardData format
          const transformedProducts: ProductCardData[] = selectedProducts.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.comparePrice,
            rating: product.rating || 4.0,
            reviews: product.reviewCount || 0,
            image: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image",
            category: product.category?.name || "Uncategorized",
            brand: product.vendor?.businessName || "Unknown Brand",
            inStock: product.stock > 0,
            discount: product.comparePrice 
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : undefined
          }));

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching trending products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  // Fetch random categories
  useEffect(() => {
    const fetchRandomCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/routes/categories?role=admin&status=active&limit=20");
        const result = await response.json();
        
        if (result.success) {
          const categoriesData = Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.data?.categories)
            ? result.data.categories
            : [];
          
          // Get random 6 categories
          const shuffled = categoriesData.sort(() => 0.5 - Math.random());
          const selectedCategories = shuffled.slice(0, 6);
          
          setCategories(selectedCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchRandomCategories();
  }, []);

  const handleCategoryClick = (slug: string) => {
    window.location.href = `/shop?category=${slug}`;
  };
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
          <button 
            onClick={() => window.location.href = '/categories'}
            className="font-semibold transition-all duration-200 hover:text-rose-600 hover:scale-105 text-rose-600"
          >
            All
          </button>
          {categories.slice(0, 5).map((category) => (
            <button 
              key={category._id}
              onClick={() => handleCategoryClick(category.slug)}
              className="font-semibold transition-all duration-200 hover:text-rose-600 hover:scale-105 text-gray-600"
            >
              {category.name}
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
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading trending products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No trending products available</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {products.map((product, idx) => (
            <div key={product.id} style={{animationDelay: `${idx * 0.05}s`}}>
              <ProductCard
                product={product}
                className="animate-slideUp mobile-optimized"
              />
            </div>
          ))}
        </div>
      )}

  

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