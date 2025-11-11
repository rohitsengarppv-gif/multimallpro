"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ShoppingBag, Sparkles, ArrowRight, Grid3X3 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  subcategories: SubCategory[];
  status: string;
  isDefault: boolean;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  parentCategory: string;
  status: string;
  isDefault: boolean;
}

interface HeroBanner {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  image: {
    url: string;
    public_id: string;
  };
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<{ [key: string]: SubCategory[] }>({});
  const [hoveredSubcategories, setHoveredSubcategories] = useState<SubCategory[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  
  // Fallback slides if no banners from database
  const fallbackSlides = [
    {
      img: "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
      title: "Office furniture",
      subtitle: "SALE UP TO 50% OFF",
      desc: "They're built to save energy, they help to clean up every door. We don't know them well, but we love them.",
      badge: "Hot Deal 🔥"
    },
    {
      img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop",
      title: "Modern Living",
      subtitle: "NEW COLLECTION",
      desc: "Discover our latest furniture collection designed for contemporary living spaces.",
      badge: "New Arrival ✨"
    },
    {
      img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop",
      title: "Home Essentials",
      subtitle: "UP TO 40% OFF",
      desc: "Transform your space with our carefully curated selection of home essentials.",
      badge: "Limited Time ⏰"
    },
  ];

  // Use banners from database or fallback
  const slides = banners.length > 0 
    ? banners.map(banner => ({
        img: banner.image.url,
        title: banner.title,
        subtitle: banner.subtitle,
        desc: banner.description,
        badge: banner.badge,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink
      }))
    : fallbackSlides;

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Fetch hero banners on component mount
  useEffect(() => {
    fetchHeroBanners();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchHeroBanners = async () => {
    try {
      setBannersLoading(true);
      const response = await fetch("/api/routes/hero-banners");
      const result = await response.json();
      
      if (result.success && result.data.banners) {
        setBanners(result.data.banners);
      }
    } catch (error) {
      console.error("Error fetching hero banners:", error);
      // Will use fallback slides
    } finally {
      setBannersLoading(false);
    }
  };

  // Debug: log categories state changes
  useEffect(() => {
    console.log("Categories state updated:", categories);
    console.log("Categories length:", categories.length);
  }, [categories]);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      // Use the same API endpoint as CategoriesManagementPage
      const response = await fetch("/api/routes/categories?role=admin&status=active&limit=12");
      const result = await response.json();
      console.log("Categories API response:", result);

      if (result.success) {
        // Handle different response structures like CategoriesManagementPage does
        const categoriesData = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.categories)
          ? result.data.categories
          : [];

        console.log("Setting categories:", categoriesData);
        setCategories(categoriesData);
      } else {
        console.log("API returned success: false - no categories found");
        // Don't show fallback categories - let user know there are no categories
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/subcategories?parentId=${categoryId}&status=active&limit=10`);
      const result = await response.json();
      if (result.success) {
        setSubcategories(prev => ({
          ...prev,
          [categoryId]: result.data
        }));
        return result.data;
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
    return [];
  };

  const handleCategoryHover = async (index: number) => {
    console.log("Hovering category at index:", index);
    console.log("Category data:", categories[index]);
    setHoveredCategory(index);
    const category = categories[index];
    if (category) {
      console.log("Category found:", category.name);
      if (!subcategories[category._id]) {
        console.log("Fetching subcategories for:", category._id);
        const subs = await fetchSubcategories(category._id);
        console.log("Fetched subcategories:", subs);
        setHoveredSubcategories(subs);
      } else {
        console.log("Using cached subcategories:", subcategories[category._id]);
        setHoveredSubcategories(subcategories[category._id] || []);
      }
    } else {
      console.log("No category found at index:", index);
    }
  };

  const handleCategoryLeave = () => {
    console.log("Leaving category hover");
    setHoveredCategory(null);
    setHoveredSubcategories([]);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="grid grid-cols-12 gap-6">
        {/* Categories - Hidden on mobile */}
        <aside 
          className={`hidden lg:block col-span-12 lg:col-span-3 border-2 border-gray-200 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-700 h-[400px] relative z-[1000] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-4 rounded-t-2xl">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              All Categories
            </h3>
            {/* Debug info */}
           
          </div>
          <ul className="divide-y divide-gray-100 overflow-y-auto h-[calc(100%-60px)] custom-scrollbar">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="px-5 py-3.5">
                  <div className="animate-pulse flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </li>
              ))
            ) : (
              categories.slice(0, 10).map((category, i) => (
                <li
                  key={category._id}
                  className={`group flex items-center justify-between px-5 py-3.5 text-sm cursor-pointer transition-all duration-300 relative ${
                    hoveredCategory === i ? "pl-6 bg-gradient-to-r from-rose-50 to-pink-50" : "hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50"
                  }`}
                  onMouseEnter={() => handleCategoryHover(i)}
                  onMouseLeave={handleCategoryLeave}
                  onClick={() => window.location.href = `/shop?category=${category.slug}`}
                  style={{
                    animationDelay: `${i * 0.05}s`
                  }}
                >
                  <div className="flex items-center gap-3">
                    {category.image?.url ? (
                      <img
                        src={category.image.url}
                        alt={category.name}
                        className="w-6 h-6 rounded-full object-cover transition-transform duration-300 group-hover:scale-125"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-xs transition-transform duration-300 group-hover:scale-125">
                        <Grid3X3 className="w-3 h-3 text-rose-600" />
                      </div>
                    )}
                    <span className="font-medium transition-colors duration-200 text-gray-800 group-hover:text-rose-600">
                      {category.name}
                    </span>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-all duration-300 text-gray-400 group-hover:text-rose-600 ${
                    hoveredCategory === i ? "translate-x-1" : ""
                  }`} />
                </li>
              ))
            )}
            {!loading && categories.length > 10 && (
              <li className="px-5 py-3.5 text-center">
                <button className="text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors">
                  View All Categories →
                </button>
              </li>
            )}
          </ul>
        </aside>

        {/* Main carousel */}
        <div 
          className={`col-span-12 lg:col-span-6 relative z-10 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700 delay-100`}
        >
          <div className="relative h-[220px] lg:h-[400px] w-full overflow-hidden rounded-lg lg:rounded-2xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ${
                  idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              >
                <div className="group absolute inset-0">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="absolute top-0 left-0 right-0 bottom-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start text-left px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6 pt-6 sm:pt-7 md:pt-8 animate-slideUp">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm font-bold text-white shadow-lg mb-2 sm:mb-2.5 md:mb-3 animate-pulse">
                      <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                      {slide.badge}
                    </div>
                    <p className="text-white/90 font-semibold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider mb-0.5 sm:mb-1">
                      {slide.title}
                    </p>
                    <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-3xl font-black tracking-tight text-white drop-shadow-2xl mb-1.5 sm:mb-2 md:mb-3">
                      {slide.subtitle}
                    </h2>
                    <p className="max-w-md text-[11px] sm:text-xs md:text-sm text-white/90 leading-relaxed mb-2 sm:mb-2.5 md:mb-3 line-clamp-2 sm:line-clamp-3">
                      {slide.desc}
                    </p>
                  
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation arrows */}
            
            {/* Carousel indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? "w-10 bg-white shadow-lg" 
                      : "w-2.5 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right promos */}
        <div 
          className={`col-span-12 lg:col-span-3 flex flex-col gap-2 h-[360px] lg:h-[400px] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700 delay-200`}
        >
          {/* Top promo card */}
          <div className="group relative flex-1 overflow-hidden rounded-lg lg:rounded-2xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <img
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop"
              alt="Colorful pillows"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white mb-2 shadow-md">
                <Sparkles className="h-3 w-3" />
                TRENDING
              </div>
              <p className="text-sm font-bold text-white mb-1 uppercase tracking-wide">
                COLORFUL PILLOWS
              </p>
              <p className="text-xs text-white/90">
                Starts at <span className="text-white font-bold text-lg">$29.99</span>
              </p>
              <button className="mt-3 text-xs text-white hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors duration-200">
                Shop now <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Bottom promo card */}
          <div className="group relative flex-1 overflow-hidden rounded-lg lg:rounded-2xl border-2 border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <img
              src="https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-PC-buying-guide-panel-4-feature?scl=1"
              alt="Interior design"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-3 py-1 text-xs font-bold text-white mb-2 shadow-md">
                <span>💎</span>
                PREMIUM
              </div>
              <p className="text-white font-black text-2xl mb-1">$49.99</p>
              <p className="text-sm font-bold text-white/90 uppercase tracking-wide mb-3">
                INTERIOR DESIGN
              </p>
              <button className="text-xs text-white hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors duration-200">
                Shop now <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f43f5e, #ec4899);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #e11d48, #db2777);
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
      `}</style>
    </section>
  );
}