"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProductCard, { ProductCardData } from "../../components/ProductCard";
import { 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown, 
  Star, 
  Heart, 
  ShoppingCart,
  Search,
  X,
  SlidersHorizontal
} from "lucide-react";

const products: ProductCardData[] = [
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
    discount: 31
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
    discount: 25
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
    inStock: true
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
    discount: 20
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
    discount: 17
  },
  {
    id: "6",
    name: "Minimalist Desk Organizer",
    price: 45.99,
    rating: 4.3,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
    category: "Office",
    brand: "OrganizeIt",
    inStock: true
  }
];

const categories = ["All", "Electronics", "Furniture", "Home & Garden", "Kitchen", "Office"];
const brands = ["All", "TechSound", "ComfortPlus", "LightCraft", "BrewMaster", "FitTech", "OrganizeIt"];
const priceRanges = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under $50", min: 0, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200+", min: 200, max: Infinity }
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || product.brand === selectedBrand;
    const matchesPrice = product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max;
    const matchesRating = product.rating >= minRating;
    const matchesStock = !showInStockOnly || product.inStock;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "name": return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const resetPagination = () => setCurrentPage(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
     

        <div className="flex gap-8">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 right-6  h-14 w-14 rounded-full bg-rose-600 text-white shadow-lg hover:bg-rose-700 transition-colors flex items-center justify-center"
          >
            <SlidersHorizontal className="h-6 w-6" />
          </button>

          {/* Filter Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0  w-80 lg:w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:transform-none overflow-y-auto
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile sidebar header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Brands</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange.label === range.label}
                        onChange={() => setSelectedPriceRange(range)}
                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Minimum Rating</h3>
                <div className="space-y-2">
                  {[0, 3, 4, 4.5].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="h-4 w-4 text-rose-600 border-gray-300 focus:ring-rose-500"
                      />
                      <div className="ml-3 flex items-center gap-1">
                        {rating === 0 ? (
                          <span className="text-sm text-gray-700">All ratings</span>
                        ) : (
                          <>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-700">& up</span>
                          </>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showInStockOnly}
                    onChange={(e) => setShowInStockOnly(e.target.checked)}
                    className="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <span className="ml-3 text-sm font-semibold text-gray-900">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {sortedProducts.length} products found • Showing {startIndex + 1}-{Math.min(endIndex, sortedProducts.length)} of {sortedProducts.length}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
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
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {currentProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={viewMode === "list" ? "md:flex md:max-w-none" : ""}
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <nav className="flex items-center gap-2">
                  {/* Previous button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = page === 1 || page === totalPages || 
                                   (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-rose-600 text-white"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  {/* Next button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
