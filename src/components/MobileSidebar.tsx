"use client";
import { useState, useEffect } from "react";
import { X, ChevronRight, Grid3X3, User, LogOut } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface Category {
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

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  role: string;
}

const menuItems = [
  { name: "HOME", href: "/" },
  { name: "FEATURES", href: "/featured" },
  { name: "DEALS", href: "/deals" },
  { name: "OFFERS", href: "/offers" },
  { name: "SHOP", href: "/shop" },
  { name: "BLOG", href: "/blog" },
  { name: "COMPARE", href: "/compare" }
];

export default function MobileSidebar({ isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check authentication status (matching Header.tsx exactly)
  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      console.log("🔍 Checking authentication...");
      
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      console.log("Token found:", !!token);
      console.log("UserData found:", !!userData);
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("✅ User authenticated:", parsedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("❌ Error parsing user data:", error);
          setIsLoggedIn(false);
          setUser(null);
        }
      } else {
        console.log("❌ No valid authentication found");
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // Fetch categories when sidebar opens and categories tab is active
  useEffect(() => {
    if (isOpen && activeTab === "categories" && categories.length === 0) {
      fetchCategories();
    }
  }, [isOpen, activeTab]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/routes/categories?role=admin&status=active&limit=20");
      const result = await response.json();
      
      if (result.success) {
        const categoriesData = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.categories)
          ? result.data.categories
          : [];
        
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (slug: string) => {
    window.location.href = `/shop?category=${slug}`;
    onClose();
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = "/";
      onClose();
    }
  };

  const handleProfileClick = () => {
    window.location.href = "/profile";
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-600 to-pink-600 grid place-items-center text-white font-black text-lg">
              e
            </div>
            <span className="text-xl font-black tracking-tight">market</span>
          </div>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-gray-100 grid place-items-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "menu" 
                ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === "categories" 
                ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Categories
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "menu" && (
            <div className="p-4">
              <ul className="space-y-1">
                {menuItems.map((item, i) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 rounded-lg text-gray-800 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <span className="font-medium">{item.name}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mb-3"></div>
                  <p className="text-sm text-gray-600">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Grid3X3 className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-sm text-gray-600">No categories available</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category, index) => (
                    <div
                      key={category._id}
                      onClick={() => handleCategoryClick(category.slug)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-200 cursor-pointer group"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {category.image?.url ? (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                          <Grid3X3 className="w-5 h-5 text-rose-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-800 font-medium group-hover:text-rose-600 transition-colors block truncate">
                          {category.name}
                        </span>
                        {category.description && (
                          <span className="text-xs text-gray-500 block truncate">
                            {category.description}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auth Section */}
        <div className="p-4 border-t border-gray-200">
         
          
          {!isClient ? (
            // Loading state during hydration
            <div className="space-y-3">
              <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="w-full h-12 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          ) : isLoggedIn && user ? (
            // Logged in user section
            <div className="space-y-3">
              {/* User Profile Card */}
              <div 
                onClick={handleProfileClick}
                className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-colors border border-purple-200"
              >
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={`${user.name}`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  <p className="text-xs text-purple-600 font-medium">View Profile</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>

              {/* Become Vendor Button (if not already a vendor) */}
              {user.role !== "vendor" && (
                <a
                  href="/become-vendor"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors shadow-lg"
                >
                  🏪 Become Vendor
                </a>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            // Not logged in section
            <div className="space-y-3">
              {/* Become Vendor Button */}
              <a
                href="/become-vendor"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors shadow-lg"
              >
                🏪 Become Vendor
              </a>
              <a
                href="/auth/login"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-rose-600 text-rose-600 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
              >
                Login
              </a>
              <a
                href="/auth/register"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-semibold hover:from-rose-700 hover:to-pink-700 transition-colors shadow-lg"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
