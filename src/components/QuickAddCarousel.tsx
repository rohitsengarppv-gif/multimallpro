"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { ProductCardData } from "./ProductCard";
import Link from "next/link";

export default function QuickAddCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem } = useCart();
  const [itemsPerView, setItemsPerView] = useState(4);
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch random products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/routes/products?active=true&limit=12');
        const data = await response.json();

        if (data.success && data.data.products) {
          // Transform and randomize products
          const transformedProducts: ProductCardData[] = data.data.products.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.comparePrice || undefined,
            rating: product.rating || 4.0,
            reviews: product.reviewCount || 0,
            image: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image",
            category: product.category?.name || "Products",
            brand: product.vendor?.businessName || "Store",
            inStock: product.stock > 0,
            discount: product.comparePrice
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : undefined,
          }));

          // Shuffle array for random display
          const shuffled = transformedProducts.sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 8)); // Take first 8 random products
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const oldQuickAddProducts: ProductCardData[] = [
  {
    id: "qa1",
    name: "Wireless Mouse",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.5,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
    brand: "TechGear",
    category: "Electronics",
    inStock: true,
    discount: 25
  },
  {
    id: "qa2",
    name: "USB-C Cable",
    price: 15.99,
    originalPrice: 24.99,
    rating: 4.3,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    brand: "ConnectPro",
    category: "Electronics",
    inStock: true,
    discount: 36
  },
  {
    id: "qa3",
    name: "Phone Stand",
    price: 19.99,
    rating: 4.7,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400&h=400&fit=crop",
    brand: "StandCraft",
    category: "Accessories",
    inStock: true
  },
  {
    id: "qa4",
    name: "Bluetooth Adapter",
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.2,
    reviews: 178,
    image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=400&fit=crop",
    brand: "AudioLink",
    category: "Electronics",
    inStock: true,
    discount: 29
  },
  {
    id: "qa5",
    name: "Screen Cleaner Kit",
    price: 12.99,
    rating: 4.6,
    reviews: 312,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop",
    brand: "CleanTech",
    category: "Accessories",
    inStock: true
  }
];

  // Update items per view based on screen size
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // Mobile: 2 items
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 items
      } else {
        setItemsPerView(4); // Desktop: 4 items
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Add Items</h3>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const handleQuickAdd = (product: ProductCardData) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      brand: product.brand,
      inStock: product.inStock,
      discount: product.discount
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Quick Add Items</h3>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="flex-shrink-0 w-1/2 sm:w-1/3 lg:w-1/4 px-1 sm:px-2">
              <div className="group relative bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {product.discount && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{product.discount}%
                  </div>
                )}

                <div className="p-2 sm:p-3">
                  <h4 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 mb-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-600 mb-1 sm:mb-2">{product.brand}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-rose-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors"
                      title="Quick Add"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
