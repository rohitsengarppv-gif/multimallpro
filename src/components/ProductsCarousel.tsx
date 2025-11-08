"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";

type Item = {
  id: string;
  title: string;
  price: number;
  img: string;
  rating: number;
};

const source: Item[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `carousel-${i + 1}`,
  title: [
    "Wireless Headphones",
    "Portable Speaker",
    "Smart Watch Series",
    "Minimal Chair",
    "Desk Lamp",
    "Cotton Blanket",
    "Ceramic Vase",
    "Coffee Grinder",
    "Bluetooth Keyboard",
    "Noise-cancel Earbuds",
    "Floor Lamp",
    "Side Table",
  ][i],
  price: [79, 149, 299, 45, 189, 67, 234, 156, 89, 345, 123, 198][i],
  img: [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZclwlEoZv1UpmF2bPWxnfN-_Ls-FvDYfHoQ&s",
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&auto=format&fit=crop",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK_j-gbGFRqwGAwhoXIIS_RLlEW78hIEu7GA&s",
    "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&auto=format&fit=crop",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqDpDJR4Wl8U7us_TFYdkMJhfnZN3Pl_Thjg&s",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=1200&auto=format&fit=crop",
  ][i],
  rating: [4, 5, 3, 4, 5, 3, 4, 5, 4, 3, 5, 4][i],
}));

export default function ProductsCarousel() {
  const { addItem } = useCart();
  // Build duplicated list for seamless loop
  const items = useMemo(() => [...source, ...source], []);

  const handleAddToCart = (item: Item) => {
    addItem({
      id: item.id,
      name: item.title,
      price: item.price,
      image: item.img,
      brand: "Recommended",
      inStock: true
    });
  };
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Recommended For You</h3>
       
      </div>

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
                  <span className="text-rose-600 font-bold">${item.price.toFixed(2)}</span>
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
    </section>
  );
}
