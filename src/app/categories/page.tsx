"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Grid3X3, 
  ChevronRight, 
  Search,
  Loader2,
  Package,
  ArrowRight
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  subcategories: SubCategory[];
  status: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  status: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/routes/categories?role=admin&status=active&limit=50");
      const result = await response.json();
      
      if (result.success) {
        const categoriesData = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.categories)
          ? result.data.categories
          : [];
        
        // Fetch subcategories for each category
        const categoriesWithSubs = await Promise.all(
          categoriesData.map(async (category: any) => {
            try {
              const subResponse = await fetch(`/api/routes/subcategories?parentId=${category._id}&status=active`);
              const subResult = await subResponse.json();
              
              return {
                ...category,
                subcategories: subResult.success ? subResult.data : []
              };
            } catch (error) {
              console.error(`Error fetching subcategories for ${category.name}:`, error);
              return {
                ...category,
                subcategories: []
              };
            }
          })
        );
        
        setCategories(categoriesWithSubs);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryClick = (slug: string) => {
    router.push(`/shop?category=${slug}`);
  };

  const handleSubcategoryClick = (categorySlug: string, subcategorySlug: string) => {
    router.push(`/shop?category=${categorySlug}&subcategory=${subcategorySlug}`);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of product categories and find exactly what you're looking for
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Grid3X3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? "No categories match your search." : "No categories available at the moment."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Categories Stats */}
            <div className="mb-6 text-center">
              <p className="text-gray-600">
                Showing {filteredCategories.length} of {categories.length} categories
              </p>
            </div>

            {/* Categories Grid */}
            <div className="grid gap-6 md:gap-8">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Category Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {category.image?.url ? (
                          <img
                            src={category.image.url}
                            alt={category.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                            <Grid3X3 className="w-8 h-8 text-rose-600" />
                          </div>
                        )}
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-1">{category.name}</h2>
                          {category.description && (
                            <p className="text-gray-600 text-sm">{category.description}</p>
                          )}
                          <p className="text-sm text-rose-600 font-medium mt-1">
                            {category.subcategories.length} subcategories
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleCategoryClick(category.slug)}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          Shop Now
                        </button>
                        
                        {category.subcategories.length > 0 && (
                          <button
                            onClick={() => toggleCategory(category._id)}
                            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                          >
                            <ChevronRight 
                              className={`h-5 w-5 text-gray-600 transition-transform ${
                                expandedCategory === category._id ? 'rotate-90' : ''
                              }`} 
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {expandedCategory === category._id && category.subcategories.length > 0 && (
                    <div className="p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Subcategories</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.subcategories.map((subcategory) => (
                          <div
                            key={subcategory._id}
                            onClick={() => handleSubcategoryClick(category.slug, subcategory.slug)}
                            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              {subcategory.image?.url ? (
                                <img
                                  src={subcategory.image.url}
                                  alt={subcategory.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-gray-500" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors truncate">
                                  {subcategory.name}
                                </h4>
                                {subcategory.description && (
                                  <p className="text-sm text-gray-500 truncate">
                                    {subcategory.description}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-rose-600 transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
