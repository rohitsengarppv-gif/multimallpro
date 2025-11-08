"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Zap, 
  Clock, 
  Heart, 
  ShoppingCart, 
  Star,
  Filter,
  Grid3X3,
  List,
  Tag,
  Percent,
  Timer,
  TrendingUp
} from "lucide-react";

type Deal = {
  id: string;
  name: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  timeLeft: string;
  dealType: "flash" | "daily" | "weekly" | "clearance";
  sold: number;
  available: number;
};

const deals: Deal[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones Pro",
    originalPrice: 199.99,
    salePrice: 79.99,
    discount: 60,
    rating: 4.8,
    reviews: 1250,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "TechSound",
    inStock: true,
    timeLeft: "2h 15m",
    dealType: "flash",
    sold: 89,
    available: 150
  },
  {
    id: "2",
    name: "Smart Fitness Watch Series X",
    originalPrice: 299.99,
    salePrice: 179.99,
    discount: 40,
    rating: 4.6,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "FitTech",
    inStock: true,
    timeLeft: "1d 5h",
    dealType: "daily",
    sold: 156,
    available: 200
  },
  {
    id: "3",
    name: "Premium Coffee Maker Deluxe",
    originalPrice: 249.99,
    salePrice: 149.99,
    discount: 40,
    rating: 4.7,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    category: "Kitchen",
    brand: "BrewMaster",
    inStock: true,
    timeLeft: "3d 12h",
    dealType: "weekly",
    sold: 78,
    available: 120
  },
  {
    id: "4",
    name: "Modern Office Chair Ergonomic",
    originalPrice: 399.99,
    salePrice: 199.99,
    discount: 50,
    rating: 4.5,
    reviews: 432,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop",
    category: "Furniture",
    brand: "ComfortPlus",
    inStock: true,
    timeLeft: "5d 8h",
    dealType: "weekly",
    sold: 45,
    available: 80
  },
  {
    id: "5",
    name: "Designer Table Lamp LED",
    originalPrice: 89.99,
    salePrice: 39.99,
    discount: 56,
    rating: 4.3,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    category: "Home & Garden",
    brand: "LightCraft",
    inStock: false,
    timeLeft: "Sold Out",
    dealType: "clearance",
    sold: 200,
    available: 200
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    originalPrice: 129.99,
    salePrice: 69.99,
    discount: 46,
    rating: 4.4,
    reviews: 678,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "SoundWave",
    inStock: true,
    timeLeft: "6h 30m",
    dealType: "flash",
    sold: 123,
    available: 180
  }
];

const dealTypes = [
  { key: "all", label: "All Deals", icon: Tag },
  { key: "flash", label: "Flash Sale", icon: Zap },
  { key: "daily", label: "Daily Deals", icon: Clock },
  { key: "weekly", label: "Weekly Offers", icon: TrendingUp },
  { key: "clearance", label: "Clearance", icon: Percent }
];

export default function DealsPage() {
  const [selectedDealType, setSelectedDealType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("discount");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

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

  const filteredDeals = deals.filter(deal => {
    if (selectedDealType === "all") return true;
    return deal.dealType === selectedDealType;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case "discount": return b.discount - a.discount;
      case "price-low": return a.salePrice - b.salePrice;
      case "price-high": return b.salePrice - a.salePrice;
      case "rating": return b.rating - a.rating;
      case "time": return a.timeLeft.localeCompare(b.timeLeft);
      default: return 0;
    }
  });

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case "flash": return "bg-red-100 text-red-800";
      case "daily": return "bg-blue-100 text-blue-800";
      case "weekly": return "bg-green-100 text-green-800";
      case "clearance": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Zap className="h-10 w-10 text-yellow-500" />
            Hot Deals & Offers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers with incredible savings.
          </p>
        </div>

        {/* Deal Type Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {dealTypes.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedDealType(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedDealType === key
                    ? "bg-rose-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {sortedDeals.length} deals found
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="discount">Highest Discount</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="time">Time Left</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-rose-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-rose-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {sortedDeals.map(deal => (
            <div
              key={deal.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div className={`relative ${viewMode === "list" ? "w-64 flex-shrink-0" : ""}`}>
                <img
                  src={deal.image}
                  alt={deal.name}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "list" ? "h-48" : "h-64"
                  }`}
                />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  -{deal.discount}%
                </div>
                
                {/* Deal Type Badge */}
                <div className={`absolute top-3 right-12 px-2 py-1 rounded-full text-xs font-medium ${getDealTypeColor(deal.dealType)}`}>
                  {deal.dealType.charAt(0).toUpperCase() + deal.dealType.slice(1)}
                </div>
                
                {/* Like Button */}
                <button
                  onClick={() => toggleLike(deal.id)}
                  className={`absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 ${
                    likedItems.has(deal.id) ? 'bg-rose-600 text-white' : 'bg-white/90 text-gray-400'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${likedItems.has(deal.id) ? 'fill-current' : ''}`} />
                </button>

                {!deal.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 line-clamp-2 pr-2">{deal.name}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{deal.brand} • {deal.category}</p>
                
                <div className="flex items-center gap-1 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(deal.rating) 
                            ? 'text-amber-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({deal.reviews})</span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-rose-600">${deal.salePrice}</span>
                  <span className="text-lg text-gray-500 line-through">${deal.originalPrice}</span>
                  <span className="text-sm text-green-600 font-semibold">
                    Save ${(deal.originalPrice - deal.salePrice).toFixed(2)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Sold: {deal.sold}</span>
                    <span>Available: {deal.available}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (deal.sold / (deal.sold + deal.available)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Time Left */}
                {deal.inStock && (
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Timer className="h-4 w-4 text-red-500" />
                    <span className="text-red-600 font-semibold">
                      {deal.timeLeft === "Sold Out" ? "Sold Out" : `${deal.timeLeft} left`}
                    </span>
                  </div>
                )}
                
                <button
                  disabled={!deal.inStock}
                  className="w-full bg-rose-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {deal.inStock ? "Add to Cart" : "Sold Out"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {sortedDeals.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Tag className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600">Try selecting a different deal type</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Never Miss a Deal!</h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Get notified about flash sales, exclusive offers, and limited-time deals before anyone else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" />
              Get Alerts
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
