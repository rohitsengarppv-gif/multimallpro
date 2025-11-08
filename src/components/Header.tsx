"use client";
import { useState, useEffect } from "react";
import { Search, Menu, Heart, ShoppingCart, GitCompare, Phone, MapPin, User, ChevronDown, Zap, Tag } from "lucide-react";
import MobileSidebar from "./MobileSidebar";
import CartSidebar from "./CartSidebar";
import { useCart } from "../contexts/CartContext";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isOpen: cartOpen, openCart, closeCart, getTotalItems } = useCart();
  const cartCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`w-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white font-sans sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? "shadow-2xl" : ""
    }`}>
      {/* Top Promo Bar */}
      <div className="hidden md:block border-b border-white/10 text-xs bg-black/20 backdrop-blur-sm animate-slideDown">
        <div className="mx-auto max-w-7xl px-4 py-2.5 flex items-center justify-between gap-4">
          <p className="text-white/90 truncate flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
            <span>Welcome to <span className="font-bold text-rose-400">E-market</span>! Enjoy mega offers, 0% piracy, and pay on delivery. New Coupon code: <span className="font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">Happy2025</span></span>
          </p>
          <div className="flex items-center gap-4 text-white/80">
           
            <span className="text-white/20">|</span>
            <a href="/orders" className="hover:text-rose-400 transition-colors duration-200 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              <span>Track Order</span>
            </a>
            <span className="text-white/20">|</span>
            <a href="tel:+1800123456" className="hover:text-rose-400 transition-colors duration-200 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <span>(+1) 800 123 456</span>
            </a>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <button className="hover:text-rose-400 transition-colors duration-200 flex items-center gap-1">
                English <ChevronDown className="h-3 w-3" />
              </button>
              <span className="text-white/30">/</span>
              <button className="hover:text-rose-400 transition-colors duration-200 flex items-center gap-1">
                USD <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav Row */}
      <div className={`mx-auto max-w-7xl px-4 py-4 flex items-center gap-4 transition-all duration-300 animate-fadeIn ${
        scrolled ? "py-3" : ""
      }`}>
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 grid place-items-center text-white font-black text-xl shadow-lg group-hover:scale-110 transition-transform duration-200">
            e
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight group-hover:text-rose-400 transition-colors duration-200">market</span>
            <span className="text-[9px] text-white/60 uppercase tracking-widest -mt-1">Shop Smart</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-1 ml-8 text-sm font-semibold">
          {[
            { name: "HOME", href: "/" },
            { name: "FEATURES", href: "/featured" },
      
            { name: "DEAL", href: "/deals" },
            { name: "SHOP", href: "/shop" },
            { name: "BLOG", href: "/blog" },
        
          ].map((item, idx) => (
            <a
              key={item.name}
              href={item.href}
              className="px-4 py-2 rounded-lg hover:bg-white/10 hover:text-rose-400 transition-all duration-200 transform hover:scale-105 relative group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {item.name}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:w-3/4 transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-2">
          <IconButton icon={<GitCompare className="h-5 w-5" />} label="Compare" href="/compare" />
          <IconButton icon={<Heart className="h-5 w-5" />} label="Wishlist" count={wishlistCount} href="/wishlist" />
          <CartButton count={cartCount} onClick={openCart} />

          {/* Auth Buttons */}
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/20">
            <a
              href="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-4 py-2 text-sm font-semibold bg-white text-rose-600 hover:bg-gray-100 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Register
            </a>
          </div>
        </div>

        {/* Mobile menu icon */}
        <button 
          onClick={() => setSidebarOpen(true)}
          aria-label="Open Menu" 
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10 transition-all duration-200 transform hover:scale-110"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Search Row */}
      <div className="mx-auto max-w-7xl px-4 pb-4 animate-slideUp">
        <div className="flex items-stretch gap-3">
          {/* Mobile Become Vendor Button */}
          <a 
            href="/become-vendor"
            className="md:hidden inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-3 text-xs font-bold hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            <span className="text-sm">🏪</span>
            VENDOR
          </a>

          {/* Desktop Become Vendor Button */}
          <a 
            href="/become-vendor"
            className="hidden md:inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-5 py-3 text-sm font-bold hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <span className="text-lg">🏪</span>
            BECOME VENDOR
          </a>

          {/* Offers Button */}
          <a 
            href="/offers"
            className="hidden md:flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-bold hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
          >
            <Tag className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            <span>Offers</span>
          </a>

          {/* Search Input */}
          <div className="flex flex-1 bg-white items-center overflow-hidden rounded-xl shadow-lg group hover:shadow-xl transition-all duration-200">
            <input
              type="text"
              placeholder="Enter your keyword..."
              className="h-[50px] w-full px-5 text-sm font-medium text-gray-900 placeholder-gray-400 outline-none bg-white"
            />
            <button className="h-[50px] w-14 shrink-0 bg-gradient-to-r from-rose-600 to-pink-600 grid place-items-center hover:from-rose-700 hover:to-pink-700 transition-all duration-200 group-hover:scale-105">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.5s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.7s ease-out forwards;
        }
      `}</style>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={closeCart} />
    </header>
  );
}

function IconButton({ icon, label, count, href }: { icon: React.ReactNode; label: string; count?: number; href?: string }) {
  const className = "relative inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition-all duration-200 transform hover:scale-105 group";
  
  const content = (
    <>
      <span className="sr-only">{label}</span>
      <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
      <span className="hidden sm:inline group-hover:text-rose-400 transition-colors duration-200">{label}</span>
      {count && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-1.5 text-[10px] font-bold shadow-lg animate-pulse">
          {count}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <button className={className}>
      {content}
    </button>
  );
}

function CartButton({ count, onClick }: { count: number; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="relative inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-5 py-2.5 text-sm font-bold hover:from-rose-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
    >
      <span className="sr-only">Cart</span>
      <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
      <span className="hidden sm:inline">My Cart</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-yellow-400 px-2 text-xs font-black text-gray-900 shadow-lg animate-bounce">
          {count}
        </span>
      )}
    </button>
  );
}