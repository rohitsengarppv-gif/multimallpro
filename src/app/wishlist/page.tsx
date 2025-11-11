"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useCart } from "../../contexts/CartContext";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Plus,
  Minus,
  ArrowRight,
  Loader2
} from "lucide-react";

type WishlistItem = {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    price: number;
    comparePrice?: number;
    mainImage?: { url: string };
    images?: { url: string }[];
    stock: number;
    rating?: number;
    reviewCount?: number;
    category?: { name: string };
    vendor?: { businessName: string };
  };
  addedAt: string;
};

export default function WishlistPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Check authentication and fetch wishlist
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!userData || !token) {
      router.push("/auth/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchWishlist(parsedUser.id);
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login");
    }
  }, [router]);

  const fetchWishlist = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/routes/wishlist", {
        headers: {
          "x-user-id": userId,
        },
      });

      const data = await response.json();
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch("/api/routes/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (data.success) {
        setItems(prev => prev.filter(item => item.productId._id !== productId));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const toggleSelectItem = (productId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.productId._id)));
    }
  };

  const removeSelected = async () => {
    if (!user) return;
    
    const selectedProductIds = Array.from(selectedItems);
    
    try {
      // Remove each selected item
      await Promise.all(
        selectedProductIds.map(productId =>
          fetch("/api/routes/wishlist", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user.id,
            },
            body: JSON.stringify({ productId }),
          })
        )
      );
      
      setItems(prev => prev.filter(item => !selectedItems.has(item.productId._id)));
      setSelectedItems(new Set());
    } catch (error) {
      console.error("Error removing selected items:", error);
    }
  };

  const addSelectedToCart = async () => {
    if (!user) return;
    
    const selectedProducts = items.filter(item => 
      selectedItems.has(item.productId._id) && item.productId.stock > 0
    );
    
    try {
      // Add each selected item to cart
      await Promise.all(
        selectedProducts.map(item =>
          fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": user.id,
            },
            body: JSON.stringify({
              productId: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              originalPrice: item.productId.comparePrice,
              quantity: 1,
              image: item.productId.mainImage?.url || item.productId.images?.[0]?.url || "https://via.placeholder.com/400",
              brand: item.productId.vendor?.businessName || "Unknown",
              discount: item.productId.comparePrice 
                ? Math.round(((item.productId.comparePrice - item.productId.price) / item.productId.comparePrice) * 100)
                : undefined,
            }),
          })
        )
      );
      
      // Also add to local cart context
      selectedProducts.forEach(item => {
        addItem({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          originalPrice: item.productId.comparePrice,
          image: item.productId.mainImage?.url || item.productId.images?.[0]?.url || "https://via.placeholder.com/400",
          brand: item.productId.vendor?.businessName || "Unknown",
          inStock: item.productId.stock > 0,
          discount: item.productId.comparePrice 
            ? Math.round(((item.productId.comparePrice - item.productId.price) / item.productId.comparePrice) * 100)
            : undefined,
        });
      });
      
      alert(`${selectedProducts.length} items added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const addSingleItemToCart = async (item: WishlistItem) => {
    if (!user) return;
    
    try {
      // Add to cart via API
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          productId: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          originalPrice: item.productId.comparePrice,
          quantity: 1,
          image: item.productId.mainImage?.url || item.productId.images?.[0]?.url || "https://via.placeholder.com/400",
          brand: item.productId.vendor?.businessName || "Unknown",
          discount: item.productId.comparePrice 
            ? Math.round(((item.productId.comparePrice - item.productId.price) / item.productId.comparePrice) * 100)
            : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Also add to local cart context for immediate UI update
        addItem({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          originalPrice: item.productId.comparePrice,
          image: item.productId.mainImage?.url || item.productId.images?.[0]?.url || "https://via.placeholder.com/400",
          brand: item.productId.vendor?.businessName || "Unknown",
          inStock: item.productId.stock > 0,
          discount: item.productId.comparePrice 
            ? Math.round(((item.productId.comparePrice - item.productId.price) / item.productId.comparePrice) * 100)
            : undefined,
        });
        
        alert("Item added to cart!");
      } else {
        alert("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  const totalValue = items.reduce((sum, item) => sum + item.productId.price, 0);
  const selectedValue = items
    .filter(item => selectedItems.has(item.productId._id))
    .reduce((sum, item) => sum + item.productId.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save items for later and never lose track of what you love</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your wishlist...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Heart className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding items you love to keep track of them</p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <>
            {/* Wishlist Stats & Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-rose-600">₹{totalValue.toFixed(2)}</p>
                  </div>
                  {selectedItems.size > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Selected Value</p>
                      <p className="text-2xl font-bold text-green-600">₹{selectedValue.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={selectAll}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {selectedItems.size === items.length ? "Deselect All" : "Select All"}
                  </button>
                  
                  {selectedItems.size > 0 && (
                    <>
                      <button
                        onClick={removeSelected}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove Selected
                      </button>
                      
                      <button
                        onClick={addSelectedToCart}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors flex items-center gap-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add Selected to Cart
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid gap-6">
              {items.map(item => (
                <div
                  key={item.productId._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Checkbox & Image */}
                    <div className="relative sm:w-48 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.productId._id)}
                        onChange={() => toggleSelectItem(item.productId._id)}
                        className="absolute top-3 left-3 z-10 h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <img
                        src={item.productId.mainImage?.url || item.productId.images?.[0]?.url}
                        alt={item.productId.name}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                      {item.productId.comparePrice && (
                        <div className="absolute top-3 right-3 bg-rose-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          -{Math.round(((item.productId.comparePrice - item.productId.price) / item.productId.comparePrice) * 100)}%
                        </div>
                      )}
                      {item.productId.stock <= 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-3 py-1 rounded-lg font-semibold text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between h-full">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-4">{item.productId.name}</h3>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{item.productId.vendor?.businessName || 'Unknown Brand'} • {item.productId.category?.name || 'Uncategorized'}</p>
                          
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(item.productId.rating || 0) 
                                      ? 'text-amber-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({item.productId.reviewCount || 0})</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-gray-900">₹{item.productId.price}</span>
                            {item.productId.comparePrice && (
                              <span className="text-sm text-gray-500 line-through">₹{item.productId.comparePrice}</span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500">Added on {new Date(item.addedAt).toLocaleDateString()}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-3 lg:ml-6">
                          <button
                            onClick={() => addSingleItemToCart(item)}
                            disabled={item.productId.stock <= 0}
                            className="w-full lg:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {item.productId.stock > 0 ? "Add to Cart" : "Out of Stock"}
                          </button>
                          
                          <button
                            onClick={() => removeItem(item.productId._id)}
                            className="w-full lg:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8 text-center">
              <a
                href="/shop"
                className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold transition-colors"
              >
                <Plus className="h-4 w-4" />
                Continue Shopping
              </a>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
