"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Copy, 
  Check, 
  Tag, 
  Clock, 
  Gift, 
  Percent, 
  Star,
  Calendar,
  Users,
  Zap,
  Heart,
  Share2
} from "lucide-react";

type Offer = {
  id: string;
  title: string;
  description: string;
  couponCode: string;
  discount: string;
  validUntil: string;
  minOrder?: number;
  maxDiscount?: number;
  usedCount: number;
  totalCount: number;
  category: string;
  image: string;
  featured: boolean;
  type: "percentage" | "fixed" | "bogo" | "shipping";
};

const offers: Offer[] = [
  {
    id: "1",
    title: "Black Friday Mega Sale",
    description: "Get massive discounts on electronics, fashion, and home essentials. Limited time offer!",
    couponCode: "BLACKFRIDAY50",
    discount: "50% OFF",
    validUntil: "Nov 30, 2024",
    minOrder: 100,
    maxDiscount: 200,
    usedCount: 1250,
    totalCount: 2000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=400&fit=crop",
    featured: true,
    type: "percentage"
  },
  {
    id: "2",
    title: "Free Shipping Weekend",
    description: "Enjoy free shipping on all orders above $50. No minimum purchase required for premium members.",
    couponCode: "FREESHIP",
    discount: "Free Shipping",
    validUntil: "Nov 15, 2024",
    minOrder: 50,
    usedCount: 890,
    totalCount: 1500,
    category: "Shipping",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=400&fit=crop",
    featured: false,
    type: "shipping"
  },
  {
    id: "3",
    title: "Buy 2 Get 1 Free",
    description: "Mix and match from our fashion collection. Perfect opportunity to refresh your wardrobe!",
    couponCode: "BOGO2024",
    discount: "Buy 2 Get 1",
    validUntil: "Dec 5, 2024",
    usedCount: 567,
    totalCount: 1000,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    featured: true,
    type: "bogo"
  },
  {
    id: "4",
    title: "New User Special",
    description: "Welcome bonus for first-time shoppers. Start your journey with amazing savings!",
    couponCode: "WELCOME25",
    discount: "$25 OFF",
    validUntil: "Dec 31, 2024",
    minOrder: 75,
    maxDiscount: 25,
    usedCount: 234,
    totalCount: 500,
    category: "Welcome",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    featured: false,
    type: "fixed"
  },
  {
    id: "5",
    title: "Flash Sale - 24 Hours Only",
    description: "Lightning deals on selected items. Hurry up, limited stock available!",
    couponCode: "FLASH24",
    discount: "40% OFF",
    validUntil: "Nov 8, 2024",
    minOrder: 30,
    maxDiscount: 100,
    usedCount: 1890,
    totalCount: 2500,
    category: "Flash Sale",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
    featured: true,
    type: "percentage"
  },
  {
    id: "6",
    title: "Home & Garden Bonanza",
    description: "Transform your living space with incredible deals on home decor and garden essentials.",
    couponCode: "HOME15",
    discount: "15% OFF",
    validUntil: "Nov 25, 2024",
    minOrder: 80,
    maxDiscount: 50,
    usedCount: 445,
    totalCount: 800,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop",
    featured: false,
    type: "percentage"
  }
];

const categories = ["All", "Electronics", "Fashion", "Home & Garden", "Shipping", "Welcome", "Flash Sale"];

export default function OffersPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedCodes, setCopiedCodes] = useState<Set<string>>(new Set());
  const [likedOffers, setLikedOffers] = useState<Set<string>>(new Set());

  const filteredOffers = selectedCategory === "All" 
    ? offers 
    : offers.filter(offer => offer.category === selectedCategory);

  const featuredOffers = offers.filter(offer => offer.featured);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodes(prev => new Set([...prev, code]));
      setTimeout(() => {
        setCopiedCodes(prev => {
          const newSet = new Set(prev);
          newSet.delete(code);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleLike = (id: string) => {
    setLikedOffers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage":
        return <Percent className="h-5 w-5" />;
      case "fixed":
        return <Tag className="h-5 w-5" />;
      case "bogo":
        return <Gift className="h-5 w-5" />;
      case "shipping":
        return <Zap className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
    }
  };

  const getProgressPercentage = (used: number, total: number) => {
    return Math.min((used / total) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Special Offers</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover amazing deals and exclusive coupon codes. Save big on your favorite products!
          </p>
        </div>

        {/* Featured Offers Banner */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500" />
            Featured Offers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOffers.map((offer) => (
              <div key={offer.id} className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    FEATURED
                  </span>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => toggleLike(offer.id)}
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                      likedOffers.has(offer.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${likedOffers.has(offer.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                      {getTypeIcon(offer.type)}
                    </div>
                    <span className="text-2xl font-bold text-red-600">{offer.discount}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{offer.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Coupon Code</span>
                      <button
                        onClick={() => copyToClipboard(offer.couponCode)}
                        className="flex items-center gap-1 text-sm text-rose-600 hover:text-rose-700 font-medium"
                      >
                        {copiedCodes.has(offer.couponCode) ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 text-center">
                      <span className="font-mono text-lg font-bold text-gray-900">{offer.couponCode}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Valid until {offer.validUntil}</span>
                    </div>
                    {offer.minOrder && (
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>Min order: ${offer.minOrder}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Used: {offer.usedCount}/{offer.totalCount}</span>
                      <span>{Math.round(getProgressPercentage(offer.usedCount, offer.totalCount))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(offer.usedCount, offer.totalCount)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* All Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
              <div className="relative">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                    offer.featured ? 'bg-red-500' : 'bg-gray-900/70'
                  }`}>
                    {offer.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleLike(offer.id)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                      likedOffers.has(offer.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likedOffers.has(offer.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                    {getTypeIcon(offer.type)}
                  </div>
                  <span className="text-xl font-bold text-red-600">{offer.discount}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{offer.title}</h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-2">{offer.description}</p>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Coupon Code</span>
                    <button
                      onClick={() => copyToClipboard(offer.couponCode)}
                      className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      {copiedCodes.has(offer.couponCode) ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-white border border-dashed border-gray-300 rounded p-2 text-center">
                    <span className="font-mono text-sm font-bold text-gray-900">{offer.couponCode}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>Valid until {offer.validUntil}</span>
                  </div>
                  {offer.minOrder && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3" />
                      <span>Min order: ${offer.minOrder}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>Used: {offer.usedCount}/{offer.totalCount}</span>
                  <span>{Math.round(getProgressPercentage(offer.usedCount, offer.totalCount))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage(offer.usedCount, offer.totalCount)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Never Miss a Deal!</h3>
          <p className="text-lg mb-6 opacity-90">Subscribe to get exclusive offers and early access to sales</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
