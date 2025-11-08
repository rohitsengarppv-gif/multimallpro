"use client";
import { useState } from "react";
import { X, ChevronRight } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const menuItems = [
  { name: "HOME", href: "/" },
  { name: "FEATURES", href: "/featured" },
  { name: "DEALS", href: "/deals" },
  { name: "OFFERS", href: "/offers" },
  { name: "SHOP", href: "/shop" },
  { name: "BLOG", href: "/blog" },
  { name: "COMPARE", href: "/compare" }
];

const categories = [
  { name: "Industrial Parts & Tools", icon: "🔧" },
  { name: "Health & Beauty", icon: "💄" },
  { name: "Gifts, Sports & Toys", icon: "🎁" },
  { name: "Textiles & Accessories", icon: "👗" },
  { name: "Packaging & Office", icon: "📦" },
  { name: "Metals, Chemicals", icon: "⚗️" },
  { name: "Optimum Electronics", icon: "💻" },
  { name: "Lights & Extinctions", icon: "💡" },
  { name: "Computers & Telecom", icon: "📱" },
  { name: "Jewelry, Bags & Shoes", icon: "👜" },
  { name: "More Categories", icon: "➕" },
];

export default function MobileSidebar({ isOpen, onClose }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"menu" | "categories">("menu");

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
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="text-gray-700 font-medium">{category.name}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Auth Section */}
        <div className="p-4 border-t border-gray-200">
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
        </div>
      </div>
    </>
  );
}
