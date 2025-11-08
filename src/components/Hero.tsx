"use client";

import { useEffect, useState } from "react";
import { ChevronRight, ShoppingBag, Sparkles } from "lucide-react";

const categories = [
  { name: "Industrial Parts & Tools", icon: "🔧" },
  { name: "Health & Beauty", icon: "💄" },
  { name: "Gifts, Sports & Toys", icon: "🎁" },
  { name: "Textiles & Accessories", icon: "👗" },
  { name: "Packaging & Office", icon: "📦" },
  { name: "Metals, Chemicals", icon: "⚗️" },
  { name: "Optimum Electronics", icon: "💻" },
  { name: "Lights & Extinctions", icon: "💡" },
  { name: "Computers & Telecom", icon: "📱" },
  { name: "Jewelry, Bags & Shoes", icon: "👜" },
  { name: "More Categories", icon: "➕", special: true },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  
  const slides = [
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="grid grid-cols-12 gap-6">
        {/* Categories - Hidden on mobile */}
        <aside 
          className={`hidden lg:block col-span-12 lg:col-span-3 border-2 border-gray-200 rounded-2xl bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-[500px] ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              All Categories
            </h3>
          </div>
          <ul className="divide-y divide-gray-100 overflow-y-auto h-[calc(100%-60px)] custom-scrollbar">
            {categories.map((c, i) => (
              <li
                key={i}
                className={`group flex items-center justify-between px-5 py-3.5 text-sm cursor-pointer transition-all duration-300 ${
                  c.special ? "bg-rose-50" : "hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50"
                } ${hoveredCategory === i ? "pl-6" : ""}`}
                onMouseEnter={() => setHoveredCategory(i)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  animationDelay: `${i * 0.05}s`
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl transition-transform duration-300 group-hover:scale-125">
                    {c.icon}
                  </span>
                  <span className={`font-medium transition-colors duration-200 ${
                    c.special ? "text-rose-600 font-bold" : "text-gray-800 group-hover:text-rose-600"
                  }`}>
                    {c.name}
                  </span>
                </div>
                <ChevronRight className={`h-4 w-4 transition-all duration-300 ${
                  c.special ? "text-rose-600" : "text-gray-400 group-hover:text-rose-600"
                } ${hoveredCategory === i ? "translate-x-1" : ""}`} />
              </li>
            ))}
          </ul>
        </aside>

        {/* Main carousel */}
        <div 
          className={`col-span-12 lg:col-span-6 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } transition-all duration-700 delay-100`}
        >
          <div className="relative h-[260px] lg:h-[500px] w-full overflow-hidden rounded-lg lg:rounded-2xl border-2 border-gray-200 bg-gray-50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-1000 ${
                  idx === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              >
                <div className="group relative h-full w-full">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-start text-left px-8 py-8 animate-slideUp">
                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-sm font-bold text-white shadow-lg mb-3 animate-pulse">
                      <Sparkles className="h-4 w-4" />
                      {slide.badge}
                    </div>
                    <p className="text-white/90 font-semibold text-sm uppercase tracking-wider mb-1">
                      {slide.title}
                    </p>
                    <h2 className="text-3xl md:text-3xl font-black tracking-tight text-white drop-shadow-2xl mb-3">
                      {slide.subtitle}
                    </h2>
                    <p className="max-w-md text-sm text-white/90 leading-relaxed mb-5">
                      {slide.desc}
                    </p>
                  
                  </div>
                </div>
              </div>
            ))}
            
            {/* Navigation arrows */}
            
            {/* Carousel indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
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
          className={`col-span-12 lg:col-span-3 flex flex-col gap-6 h-[360px] lg:h-[500px] ${
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
      `}</style>
    </section>
  );
}