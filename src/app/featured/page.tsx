"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Award,
  TrendingUp,
  Crown,
  Filter,
  Grid3X3,
  List,
  Zap
} from "lucide-react";

type FeaturedProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  category: string;
  brand: string;
  inStock: boolean;
  badge: "bestseller" | "trending" | "premium" | "new";
  description: string;
  features: string[];
  discount?: number;
};

const featuredProducts: FeaturedProduct[] = [
  {
    id: "1",
    name: "Premium Wireless Noise-Canceling Headphones",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviews: 2847,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop"
    ],
    category: "Electronics",
    brand: "AudioTech Pro",
    inStock: true,
    badge: "bestseller",
    description: "Experience superior sound quality with advanced noise cancellation technology.",
    features: ["40-hour battery life", "Quick charge", "Premium materials", "Wireless connectivity"],
    discount: 25
  },
  {
    id: "2",
    name: "Smart Home Security System Pro",
    price: 449.99,
    rating: 4.8,
    reviews: 1923,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop"
    ],
    category: "Smart Home",
    brand: "SecureHome",
    inStock: true,
    badge: "trending",
    description: "Complete home security solution with AI-powered monitoring and mobile alerts.",
    features: ["24/7 monitoring", "Mobile app control", "AI detection", "Cloud storage"]
  },
  {
    id: "3",
    name: "Luxury Ergonomic Office Chair",
    price: 899.99,
    originalPrice: 1199.99,
    rating: 4.7,
    reviews: 1456,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop"
    ],
    category: "Furniture",
    brand: "ErgoLux",
    inStock: true,
    badge: "premium",
    description: "Ultimate comfort and support for long work sessions with premium materials.",
    features: ["Lumbar support", "Adjustable height", "Premium leather", "10-year warranty"],
    discount: 25
  },
  {
    id: "4",
    name: "Professional 4K Drone with Gimbal",
    price: 1299.99,
    rating: 4.6,
    reviews: 892,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=600&fit=crop"
    ],
    category: "Electronics",
    brand: "SkyTech",
    inStock: true,
    badge: "new",
    description: "Capture stunning aerial footage with professional-grade 4K camera and stabilization.",
    features: ["4K video recording", "3-axis gimbal", "30-minute flight time", "GPS navigation"]
  },
  {
    id: "5",
    name: "Smart Fitness Mirror with AI Trainer",
    price: 1999.99,
    originalPrice: 2499.99,
    rating: 4.8,
    reviews: 1234,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=600&fit=crop"
    ],
    category: "Fitness",
    brand: "FitMirror",
    inStock: true,
    badge: "trending",
    description: "Revolutionary home gym experience with AI-powered personal training.",
    features: ["AI personal trainer", "Live classes", "Form correction", "Progress tracking"],
    discount: 20
  },
  {
    id: "6",
    name: "Premium Espresso Machine Deluxe",
    price: 799.99,
    originalPrice: 999.99,
    rating: 4.9,
    reviews: 1678,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop"
    ],
    category: "Kitchen",
    brand: "CoffeeMaster",
    inStock: true,
    badge: "bestseller",
    description: "Barista-quality espresso at home with precision temperature control.",
    features: ["15-bar pressure", "Milk frother", "Programmable", "Stainless steel"],
    discount: 20
  }
];

const badges = [
  { key: "all", label: "All Featured", icon: Star },
  { key: "bestseller", label: "Best Sellers", icon: Award },
  { key: "trending", label: "Trending", icon: TrendingUp },
  { key: "premium", label: "Premium", icon: Crown },
  { key: "new", label: "New Arrivals", icon: Zap }
];

export default function FeaturedPage() {
  const [selectedBadge, setSelectedBadge] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
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

  const filteredProducts = featuredProducts.filter(product => {
    if (selectedBadge === "all") return true;
    return product.badge === selectedBadge;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "rating": return b.rating - a.rating;
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "reviews": return b.reviews - a.reviews;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "bestseller": return "bg-yellow-100 text-yellow-800";
      case "trending": return "bg-green-100 text-green-800";
      case "premium": return "bg-purple-100 text-purple-800";
      case "new": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "bestseller": return <Award className="h-3 w-3" />;
      case "trending": return <TrendingUp className="h-3 w-3" />;
      case "premium": return <Crown className="h-3 w-3" />;
      case "new": return <Zap className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Star className="h-10 w-10 text-yellow-500 fill-current" />
            Featured Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products, trending items, and customer favorites.
          </p>
        </div>

        {/* Badge Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedBadge(key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedBadge === key
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
              {sortedProducts.length} featured products
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
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

        {/* Products Grid */}
        <div className={`grid gap-8 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {sortedProducts.map(product => (
            <div
              key={product.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div className={`relative ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "list" ? "h-64" : "h-80"
                  }`}
                />
                
                {/* Badge */}
                <div className={`absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(product.badge)}`}>
                  {getBadgeIcon(product.badge)}
                  {product.badge.charAt(0).toUpperCase() + product.badge.slice(1)}
                </div>
                
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-4 right-12 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}
                
                {/* Like Button */}
                <button
                  onClick={() => toggleLike(product.id)}
                  className={`absolute top-4 right-4 h-10 w-10 rounded-full backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 ${
                    likedItems.has(product.id) ? 'bg-rose-600 text-white' : 'bg-white/90 text-gray-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${likedItems.has(product.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Quick View */}
                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Quick View
                </button>
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 pr-2">{product.name}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{product.brand} • {product.category}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) 
                            ? 'text-amber-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                  <span className="text-sm text-gray-600">({product.reviews.toLocaleString()} reviews)</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                    {product.features.length > 3 && (
                      <span className="text-gray-500 text-xs">+{product.features.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      <span className="text-sm text-green-600 font-semibold">
                        Save ${(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 bg-rose-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Star className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured products found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}

        {/* Why Choose Featured */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Our Featured Products?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-rose-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h4>
              <p className="text-gray-600">Handpicked products that meet our highest quality standards.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-rose-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Trending Items</h4>
              <p className="text-gray-600">Stay ahead with the latest trends and customer favorites.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-rose-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Selection</h4>
              <p className="text-gray-600">Curated collection of premium and exclusive products.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
