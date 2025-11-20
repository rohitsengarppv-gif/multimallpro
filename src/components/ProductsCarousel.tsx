"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Star, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";

type Item = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  img: string;
  rating: number;
  brand: string;
  inStock: boolean;
  discount?: number;
};

export default function ProductsCarousel() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Build duplicated list for seamless loop
  const items = useMemo(() => [...products, ...products], [products]);

  // Fetch 15 latest products from API
  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        // Fetch products sorted by creation date (latest first)
        const response = await fetch("/api/routes/products?active=true&limit=15&sort=createdAt&order=desc");
        const data = await response.json();

        if (data.success && data.data.products) {
          // Transform to Item format
          const transformedProducts: Item[] = data.data.products.map((product: any) => {
            const basePrice = Number(product.price) || 0;
            const comparePrice = typeof product.comparePrice === "number" ? Number(product.comparePrice) : undefined;
            const hasBoth = typeof comparePrice === "number" && comparePrice > 0;

            const effectivePrice = hasBoth
              ? Math.min(basePrice, comparePrice as number)
              : basePrice;

            const crossedPrice = hasBoth
              ? Math.max(basePrice, comparePrice as number)
              : undefined;

            const discount = crossedPrice && crossedPrice > effectivePrice
              ? Math.round(((crossedPrice - effectivePrice) / crossedPrice) * 100)
              : undefined;

            return {
              id: product._id,
              title: product.name,
              price: effectivePrice,
              originalPrice: crossedPrice,
              img: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400x300?text=No+Image",
              rating: product.rating || Math.floor(Math.random() * 2) + 4, // 4-5 stars for latest products
              brand: product.vendor?.businessName || "Latest",
              inStock: product.stock > 0,
              discount,
            } as Item;
          });

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching latest products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const handleAddToCart = async (item: Item) => {
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
          productId: item.id,
          name: item.title,
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: 1,
          image: item.img,
          brand: item.brand,
          discount: item.discount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Also add to local context for immediate UI update
        addItem({
          id: item.id,
          name: item.title,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.img,
          brand: item.brand,
          inStock: item.inStock,
          discount: item.discount,
        });
      } else {
        console.error("Failed to add to cart:", data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Latest Products</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-rose-600 mx-auto mb-3" />
            <p className="text-gray-600">Loading latest products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600">No products available</p>
          </div>
        </div>
      ) : (
        <div className="group relative overflow-hidden">
          <div className="flex gap-5 carousel-scroll">
            {items.map((item, idx) => (
            <article
              key={item.id + '-' + idx}
              className="basis-1/2 md:basis-1/3 lg:basis-1/5 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative h-36 w-full overflow-hidden">
                <img src={item.img} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <button
                  onClick={() => handleAddToCart(item)}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-700 hover:text-rose-600 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
              <div className="p-3">
                <h5 className="line-clamp-2 h-10 text-sm font-semibold text-gray-800">{item.title}</h5>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-rose-600 font-bold">₹{item.price.toFixed(0)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-gray-500 line-through">₹{item.originalPrice.toFixed(0)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`h-4 w-4 ${s < item.rating ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

          <style jsx global>{`
            @keyframes carousel-slide {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .carousel-scroll {
              animation: carousel-slide 40s linear infinite;
            }
            .group:hover .carousel-scroll {
              animation-play-state: paused;
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
