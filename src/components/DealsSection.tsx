"use client";
import { useEffect, useMemo, useState } from "react";
import { Heart, Eye, RefreshCw, Clock } from "lucide-react";
import { useCart } from "../contexts/CartContext";

type Deal = {
  id: string;
  title: string;
  price: number;
  currency: string;
  img: string;
  available: number;
  sold: number;
  discount: number;
};

// Sample data
const sampleData = {
  banner: {
    title: "Gift Special",
    message: "Shop now and get extra 20% off with code",
    coupon: "GIFT20",
    cta: "Shop Now"
  },
  dailyDeals: [
    {
      id: "1",
      title: "Sweetheart Homecoming Dresses",
      price: 115.20,
      currency: "$",
      img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop",
      available: 36,
      sold: 24,
      discount: 40
    },
    {
      id: "2",
      title: "Modern Minimalist Vase Set",
      price: 89.99,
      currency: "$",
      img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=300&fit=crop",
      available: 42,
      sold: 18,
      discount: 35
    },
    {
      id: "3",
      title: "Elegant Pink Accent Chair",
      price: 299.00,
      currency: "$",
      img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop",
      available: 15,
      sold: 10,
      discount: 45
    },
    {
      id: "4",
      title: "Designer Table Lamp",
      price: 65.50,
      currency: "$",
      img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop",
      available: 28,
      sold: 22,
      discount: 30
    }
  ],
  midBanner: {
    badge: "🔥 Hot Deal",
    title: "Summer Sale - Up to 50% Off on Selected Items",
    cta: "Explore Now",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop"
  },
  trendingTabs: ["All", "Fashion", "Home", "Electronics", "Beauty", "Sports"]
};

export default function DealsSection() {
  const { addItem } = useCart();
  const pages = useMemo(() => {
    const arr: Deal[][] = [];
    for (let i = 0; i < sampleData.dailyDeals.length; i += 2) {
      arr.push(sampleData.dailyDeals.slice(i, i + 2));
    }
    return arr;
  }, []);
  
  const [page, setPage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const id = setInterval(() => {
      setPage((p) => (p + 1) % pages.length);
    }, 6000);
    return () => clearInterval(id);
  }, [pages.length]);

  const next = () => setPage((p) => (p + 1) % pages.length);
  const prev = () => setPage((p) => (p - 1 + pages.length) % pages.length);
  const toggleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddToCart = (deal: Deal) => {
    addItem({
      id: deal.id,
      name: deal.title,
      price: deal.price,
      originalPrice: deal.price * 1.67, // Calculate original price from discount
      image: deal.img,
      brand: "Daily Deal",
      inStock: true,
      discount: deal.discount
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 pt-8 bg-gradient-to-b from-gray-50 to-white">
      {/* Gift Special banner with animation */}
      <div className="mb-6 overflow-hidden rounded-xl lg:rounded-2xl border border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 px-4 sm:px-5 py-3 text-white">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-lg animate-bounce">🎁</span>
            <span className="font-bold text-base sm:text-lg">{sampleData.banner.title}</span>
          </div>
          <div className="ml-auto" />
          <button className="rounded-lg bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-rose-600 hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md">
            {sampleData.banner.cta}
          </button>
        </div>
        <div className="px-4 sm:px-5 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
          {sampleData.banner.message} <span className="font-bold text-rose-600 bg-rose-100 px-2 py-1 rounded">{sampleData.banner.coupon}</span>
        </div>
      </div>

      {/* Daily Deals heading + controls */}
      <div className="mb-4 flex items-center justify-between animate-fadeIn" style={{animationDelay: '0.1s'}}>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Daily Deals</h3>
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={prev} 
            aria-label="Previous" 
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transform hover:scale-110 transition-all duration-200 shadow-md font-bold text-base sm:text-lg"
          >
            ‹
          </button>
          <button 
            onClick={next} 
            aria-label="Next" 
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white border-2 border-gray-200 text-gray-700 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transform hover:scale-110 transition-all duration-200 shadow-md font-bold text-base sm:text-lg"
          >
            ›
          </button>
        </div>
      </div>

      {/* Carousel viewport */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((group, gi) => (
            <div key={gi} className="min-w-full grid grid-cols-1 gap-6 md:grid-cols-2">
              {group.map((deal, idx) => (
                <article 
                  key={deal.id} 
                  className="overflow-hidden rounded-xl lg:rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 animate-slideUp"
                  style={{animationDelay: `${idx * 0.1}s`}}
                  onMouseEnter={() => setHoveredCard(deal.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0">
                    <div className="relative sm:col-span-5 h-48 sm:h-48 md:h-56 overflow-hidden bg-gray-100">
                      <img 
                        src={deal.img} 
                        alt={deal.title} 
                        className={`h-full w-full object-cover transition-transform duration-500 ${hoveredCard === deal.id ? 'scale-110' : 'scale-100'}`}
                      />
                      <div className="absolute left-2 sm:left-3 top-2 sm:top-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-white shadow-lg animate-pulse">
                        -{deal.discount}%
                      </div>
                      <button
                        onClick={() => toggleLike(deal.id)}
                        className={`absolute right-2 sm:right-3 top-2 sm:top-3 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 ${likedItems.has(deal.id) ? 'text-rose-600' : 'text-gray-400'}`}
                      >
                        <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${likedItems.has(deal.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="sm:col-span-7 p-3 sm:p-5 flex flex-col">
                      <h4 className="line-clamp-2 text-sm sm:text-base font-bold text-gray-900 hover:text-rose-600 transition-colors duration-200">{deal.title}</h4>
                      <div className="mt-1 sm:mt-2 flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                        <span className="text-rose-600 font-bold text-base sm:text-lg">{deal.currency}{deal.price.toFixed(2)}</span>
                        <span className="text-xs sm:text-sm text-gray-400 line-through">{deal.currency}{(deal.price * 1.67).toFixed(2)}</span>
                      </div>
                      <p className="mt-1 sm:mt-2 line-clamp-2 text-xs text-gray-500 leading-relaxed">
                        They key to have more time is to them well, but we love them anyway. Premium quality guaranteed.
                      </p>
                      <div className="mt-2 sm:mt-4 flex items-center justify-between text-xs text-gray-600">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-gray-500 text-xs">Available</span>
                          <span className="font-bold text-gray-900 bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{deal.available}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-gray-500 text-xs">Sold</span>
                          <span className="font-bold text-rose-600 bg-rose-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs">{deal.sold}</span>
                        </div>
                      </div>
                      <div className="relative mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-1000 ease-out shadow-sm"
                          style={{ width: `${Math.min(100, (deal.sold / (deal.available + deal.sold)) * 100)}%` }}
                        />
                      </div>
                      <div className="mt-3 sm:mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200">
                            <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleAddToCart(deal)}
                          className="rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:from-rose-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-md"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-10 bg-gradient-to-r from-rose-500 to-pink-500" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      {/* Mid full banner */}
      <div className="mt-8 sm:mt-10 overflow-hidden rounded-xl lg:rounded-2xl border border-gray-200 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 animate-fadeIn" style={{animationDelay: '0.3s'}}>
        <div className="relative h-40 sm:h-52 w-full overflow-hidden">
          <img 
            src={sampleData.midBanner.img} 
            alt={sampleData.midBanner.title} 
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2">
            <div className="mb-2 sm:mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-lg animate-pulse">
              {sampleData.midBanner.badge}
            </div>
            <h3 className="max-w-xs sm:max-w-xl text-lg sm:text-2xl font-bold text-white drop-shadow-lg leading-tight">{sampleData.midBanner.title}</h3>
            <button className="mt-3 sm:mt-4 inline-flex rounded-lg bg-white px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold text-rose-600 shadow-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200">
              {sampleData.midBanner.cta}
            </button>
          </div>
        </div>
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
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}