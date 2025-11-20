"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../contexts/CartContext";
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
  TrendingUp,
  Loader2
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




export default function DealsPage() {
  const { addItem } = useCart();
  const [selectedDealType, setSelectedDealType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("discount");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  // Check wishlist status for all products
  const checkWishlistStatus = async (products: Deal[]) => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    try {
      const user = JSON.parse(userData);
      
      const wishlistChecks = await Promise.all(
        products.map(async (product) => {
          try {
            const response = await fetch(`/api/routes/wishlist?productId=${product.id}`, {
              headers: {
                "x-user-id": user.id,
              },
            });
            const data = await response.json();
            return {
              productId: product.id,
              inWishlist: data.success && data.data.inWishlist
            };
          } catch (error) {
            return {
              productId: product.id,
              inWishlist: false
            };
          }
        })
      );

      const wishlistedItems = new Set(
        wishlistChecks
          .filter(item => item.inWishlist)
          .map(item => item.productId)
      );
      
      setLikedItems(wishlistedItems);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  // Fetch random products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/routes/products?active=true&limit=50");
        const data = await response.json();

        if (data.success && data.data.products) {
          // Get random products
          const allProducts = data.data.products;
          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          
          // Transform to Deal format
          const transformedDeals: Deal[] = shuffled.map((product: any) => {
            const discount = product.comparePrice 
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : Math.floor(Math.random() * 40) + 10; // Random discount 10-50%
            
            // Assign random deal type based on discount
            let dealType: "flash" | "daily" | "weekly" | "clearance";
            if (discount >= 50) dealType = "flash";
            else if (discount >= 40) dealType = "daily";
            else if (discount >= 30) dealType = "weekly";
            else dealType = "clearance";

            // Calculate time left based on deal type
            let timeLeft: string;
            if (dealType === "flash") timeLeft = `${Math.floor(Math.random() * 6) + 1}h ${Math.floor(Math.random() * 60)}m`;
            else if (dealType === "daily") timeLeft = `${Math.floor(Math.random() * 2) + 1}d ${Math.floor(Math.random() * 24)}h`;
            else if (dealType === "weekly") timeLeft = `${Math.floor(Math.random() * 5) + 1}d ${Math.floor(Math.random() * 24)}h`;
            else timeLeft = product.stock > 0 ? "Limited Stock" : "Sold Out";

            return {
              id: product._id,
              name: product.name,
              originalPrice: product.comparePrice || product.price * 1.5,
              salePrice: product.price,
              discount,
              rating: product.rating || (Math.random() * 1.5 + 3.5),
              reviews: product.reviewCount || Math.floor(Math.random() * 1000) + 100,
              image: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image",
              category: product.category?.name || "Uncategorized",
              brand: product.vendor?.businessName || "Unknown Brand",
              inStock: product.stock > 0,
              timeLeft,
              dealType,
              sold: Math.floor(Math.random() * 150) + 50,
              available: product.stock
            };
          });

          setDeals(transformedDeals);
          
          // Check wishlist status for fetched products
          checkWishlistStatus(transformedDeals);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setDeals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToWishlist = async (deal: Deal) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Please login to add items to wishlist");
      window.location.href = "/auth/login";
      return;
    }

    try {
      const user = JSON.parse(userData);
      const isCurrentlyInWishlist = likedItems.has(deal.id);
      
      if (isCurrentlyInWishlist) {
        // Remove from wishlist
        const response = await fetch("/api/routes/wishlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({
            productId: deal.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Product removed from wishlist!");
          setLikedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(deal.id);
            return newSet;
          });
        } else {
          alert(data.message || "Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/routes/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": user.id,
          },
          body: JSON.stringify({
            productId: deal.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Product added to wishlist!");
          setLikedItems(prev => new Set([...prev, deal.id]));
        } else {
          if (data.message === "Product already in wishlist") {
            alert("Product is already in your wishlist!");
            setLikedItems(prev => new Set([...prev, deal.id]));
          } else {
            alert(data.message || "Failed to add to wishlist");
          }
        }
      }
    } catch (error) {
      console.error("Error managing wishlist:", error);
      alert("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (deal: Deal) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Please login to add items to cart");
      window.location.href = "/auth/login";
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          productId: deal.id,
          name: deal.name,
          price: deal.salePrice,
          originalPrice: deal.originalPrice,
          quantity: 1,
          image: deal.image,
          brand: deal.brand,
          discount: deal.discount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Also add to local context for immediate UI update
        addItem({
          id: deal.id,
          name: deal.name,
          price: deal.salePrice,
          originalPrice: deal.originalPrice,
          image: deal.image,
          brand: deal.brand,
          inStock: deal.inStock,
          discount: deal.discount
        });
        alert("Added to cart successfully!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const handleViewProduct = (deal: Deal) => {
    window.location.href = `/product/${deal.id}`;
  };

  const filteredDeals = deals.filter((deal: Deal) => {
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

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading amazing deals...</p>
            </div>
          </div>
        ) : sortedDeals.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals found</h3>
              <p className="text-gray-600">Try selecting a different deal type</p>
            </div>
          </div>
        ) : (
          /* Deals Grid */
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {sortedDeals.map(deal => (
            <div
              key={deal.id}
              className={`bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${
                viewMode === "list" ? "flex" : ""
              }`}
              onClick={() => handleViewProduct(deal)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToWishlist(deal);
                  }}
                  className={`absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200 ${
                    likedItems.has(deal.id) ? 'bg-rose-600 text-white' : 'bg-white/90 text-gray-400'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${likedItems.has(deal.id) ? 'fill-current' : ''}`} />
                </button>

               
              </div>
              
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 line-clamp-2 pr-2">{deal.name}</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{deal.brand} • {deal.category}</p>
                
              
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-rose-600">₹{deal.originalPrice}</span>
                  <span className="text-lg text-gray-500 line-through">₹{deal.salePrice}</span>
                 
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(deal);
                  }}
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
