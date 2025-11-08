"use client";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../contexts/CartContext";

type Item = {
  id: string;
  title: string;
  price: number;
  img: string;
  discount?: number;
};

const items: Item[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `demo-${i + 1}`,
  title: [
    "Minimal Wooden Chair",
    "Soft Throw Pillow",
    "Modern Floor Lamp",
    "Compact Side Table",
    "Ceramic Vase",
    "Comfy Lounge Chair",
    "Velvet Armchair",
    "Nordic Table Lamp",
    "Oak Nightstand",
    "Knitted Blanket",
    "Wall Art Canvas",
    "Tabletop Planter",
    "Leather Desk Pad",
    "Wireless Speaker",
  ][i],
  price: [89, 156, 234, 67, 345, 123, 198, 78, 299, 145, 187, 92, 267, 158][i],
  img: [
    "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop",
    "data:image/jpeg;base64,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",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK_j-gbGFRqwGAwhoXIIS_RLlEW78hIEu7GA&s",
    "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&auto=format&fit=crop",
  ][i],
  discount: [0, 10, 15, 25, 5, 0, 12, 18, 0, 7, 0, 9, 0, 20][i] || 0,
}));

export default function ProductsShowcase() {
  const { addItem } = useCart();

  const handleAddToCart = (item: Item) => {
    addItem({
      id: item.id,
      name: item.title,
      price: item.price,
      originalPrice: item.discount ? item.price * (1 + item.discount / 100) : undefined,
      image: item.img,
      brand: "Just For You",
      inStock: true,
      discount: item.discount
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Just For You</h3>
        <button className="text-sm font-semibold text-rose-600 hover:underline">View all</button>
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
        {items.map((p, idx) => (
          <article
            key={p.id}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ animationDelay: `${idx * 0.03}s` }}
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-50">
              <img
                src={p.img}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {p.discount ? (
                <div className="absolute left-3 top-3 rounded-md bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">-{p.discount}%</div>
              ) : null}

              {/* Hover actions */}
              <div className="absolute right-3 bottom-3 flex flex-col gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <button className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm grid place-items-center text-gray-700 hover:text-rose-600 shadow-md">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm grid place-items-center text-gray-700 hover:text-rose-600 shadow-md">
                  <Eye className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleAddToCart(p)}
                  className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm grid place-items-center text-gray-700 hover:text-rose-600 shadow-md"
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h5 className="line-clamp-2 h-10 text-sm font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">{p.title}</h5>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="font-bold text-rose-600">${p.price.toFixed(2)}</span>
                {p.discount ? (
                  <span className="text-xs text-gray-400 line-through">${(p.price * (1 + p.discount / 100)).toFixed(2)}</span>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
