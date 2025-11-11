"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import ProductCard, { ProductCardData } from "./ProductCard";

export default function ProductsShowcase() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch 15 random products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/routes/products?active=true&limit=50");
        const data = await response.json();

        if (data.success && data.data.products) {
          // Get random 15 products
          const allProducts = data.data.products;
          const shuffled = allProducts.sort(() => 0.5 - Math.random());
          const selectedProducts = shuffled.slice(0, 15);

          // Transform to ProductCardData format
          const transformedProducts: ProductCardData[] = selectedProducts.map((product: any) => ({
            id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.comparePrice,
            rating: product.rating || 4.0,
            reviews: product.reviewCount || 0,
            image: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image",
            category: product.category?.name || "Uncategorized",
            brand: product.vendor?.businessName || "Unknown Brand",
            inStock: product.stock > 0,
            discount: product.comparePrice 
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : undefined
          }));

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Just For You</h3>
        <button className="text-sm font-semibold text-rose-600 hover:underline">View all</button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No products available</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {products.map((product, idx) => (
            <div key={product.id} style={{animationDelay: `${idx * 0.03}s`}}>
              <ProductCard
                product={product}
                className="animate-slideUp"
              />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
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
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
