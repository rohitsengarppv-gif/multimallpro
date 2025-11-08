"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Plus,
  Minus,
  ArrowRight
} from "lucide-react";

type WishlistItem = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  discount?: number;
  dateAdded: string;
};

const wishlistItems: WishlistItem[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "TechSound",
    inStock: true,
    discount: 31,
    dateAdded: "2024-11-01"
  },
  {
    id: "2", 
    name: "Modern Office Chair",
    price: 299.00,
    originalPrice: 399.00,
    rating: 4.8,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop",
    category: "Furniture",
    brand: "ComfortPlus",
    inStock: true,
    discount: 25,
    dateAdded: "2024-10-28"
  },
  {
    id: "3",
    name: "Designer Table Lamp",
    price: 65.50,
    rating: 4.2,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
    category: "Home & Garden",
    brand: "LightCraft",
    inStock: true,
    dateAdded: "2024-10-25"
  },
  {
    id: "4",
    name: "Premium Coffee Maker",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.7,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    category: "Kitchen",
    brand: "BrewMaster",
    inStock: false,
    discount: 20,
    dateAdded: "2024-10-20"
  },
  {
    id: "5",
    name: "Smart Fitness Watch",
    price: 249.00,
    originalPrice: 299.00,
    rating: 4.6,
    reviews: 445,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "FitTech",
    inStock: true,
    discount: 17,
    dateAdded: "2024-10-15"
  }
];

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>(wishlistItems);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const removeSelected = () => {
    setItems(prev => prev.filter(item => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  };

  const addSelectedToCart = () => {
    const selectedProducts = items.filter(item => selectedItems.has(item.id) && item.inStock);
    console.log("Adding to cart:", selectedProducts);
    // Add to cart logic here
  };

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const selectedValue = items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Save items for later and never lose track of what you love</p>
        </div>

        {items.length === 0 ? (
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
                    <p className="text-2xl font-bold text-rose-600">${totalValue.toFixed(2)}</p>
                  </div>
                  {selectedItems.size > 0 && (
                    <div>
                      <p className="text-sm text-gray-600">Selected Value</p>
                      <p className="text-2xl font-bold text-green-600">${selectedValue.toFixed(2)}</p>
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
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Checkbox & Image */}
                    <div className="relative sm:w-48 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                        className="absolute top-3 left-3 z-10 h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 sm:h-full object-cover"
                      />
                      {item.discount && (
                        <div className="absolute top-3 right-3 bg-rose-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          -{item.discount}%
                        </div>
                      )}
                      {!item.inStock && (
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
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-4">{item.name}</h3>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{item.brand} • {item.category}</p>
                          
                          <div className="flex items-center gap-1 mb-3">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(item.rating) 
                                      ? 'text-amber-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({item.reviews})</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl font-bold text-gray-900">${item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500">Added on {item.dateAdded}</p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col gap-3 lg:ml-6">
                          <button
                            disabled={!item.inStock}
                            className="w-full lg:w-auto px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {item.inStock ? "Add to Cart" : "Out of Stock"}
                          </button>
                          
                          <button
                            onClick={() => removeItem(item.id)}
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
