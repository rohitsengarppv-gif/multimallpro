"use client";
import { useEffect, useState } from "react";
import { Laptop, Watch, Headphones, Sparkles, BadgePercent, ArrowRight, Zap } from "lucide-react";

const smallPromos = [
  {
    id: "laptop",
    title: "Laptops Max",
    subtitle: "From $999.00 or $84.92/mo",
    chip: "BEST SALE",
    icon: <Laptop className="h-7 w-7" />,
    bg: "from-sky-100 via-cyan-50 to-blue-50",
    borderColor: "border-sky-200",
    chipBg: "bg-sky-100",
    chipText: "text-sky-700",
    iconColor: "text-sky-600",
    bgImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop",
  },
  {
    id: "ipad",
    title: "Buy iPad Air",
    subtitle: "From $599 or $50/mo",
    chip: "NEW ARRIVAL",
    icon: <Sparkles className="h-7 w-7" />,
    bg: "from-amber-100 via-orange-50 to-yellow-50",
    borderColor: "border-amber-200",
    chipBg: "bg-amber-100",
    chipText: "text-amber-700",
    iconColor: "text-amber-600",
    bgImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop",
  },
  {
    id: "watch",
    title: "Smartwatch 7",
    subtitle: "Latest bands & styles",
    chip: "OFF 15%",
    icon: <Watch className="h-7 w-7" />,
    bg: "from-emerald-100 via-teal-50 to-green-50",
    borderColor: "border-emerald-200",
    chipBg: "bg-emerald-100",
    chipText: "text-emerald-700",
    iconColor: "text-emerald-600",
    bgImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
  },
  {
    id: "airpods",
    title: "AirPods Max",
    subtitle: "Hi‑Fidelity wireless",
    chip: "FREE SHIPPING",
    icon: <Headphones className="h-7 w-7" />,
    bg: "from-indigo-100 via-blue-50 to-purple-50",
    borderColor: "border-indigo-200",
    chipBg: "bg-indigo-100",
    chipText: "text-indigo-700",
    iconColor: "text-indigo-600",
    bgImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
  },
];

const slides = [
  {
    badge: "BEST DISCOUNT",
    title: "Special Sale",
    desc: "From $299.00 or $24.92/mo • 24 mo. Financing",
    cta: "BUY NOW",
    img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1600&auto=format&fit=crop",
  },
  {
    badge: "LIMITED OFFER",
    title: "Weekend Deals",
    desc: "Accessories • Speakers • Smart Home",
    cta: "EXPLORE",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop",
  },
];

export default function PromoShowcase() {
  const [idx, setIdx] = useState(0);
  const [hoveredPromo, setHoveredPromo] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="grid grid-cols-12 gap-6">
        {/* Left: 2x2 small promos */}
        <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-5">
          {smallPromos.map((p, pidx) => (
            <article 
              key={p.id} 
              className={`group overflow-hidden rounded-2xl border-2 ${p.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scaleIn relative ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ animationDelay: `${pidx * 0.1}s` }}
              onMouseEnter={() => setHoveredPromo(p.id)}
              onMouseLeave={() => setHoveredPromo(null)}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={p.bgImage} 
                  alt={p.title}
                  className={`h-full w-full object-cover transition-transform duration-700 ${
                    hoveredPromo === p.id ? 'scale-110' : 'scale-100'
                  }`}
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.bg} opacity-90`} />
              </div>

              <div className="p-5 h-full flex flex-col justify-between relative z-10">
                {/* Animated background circle */}
                <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/30 transition-transform duration-500 ${
                  hoveredPromo === p.id ? 'scale-150' : 'scale-100'
                }`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center gap-1.5 rounded-lg ${p.chipBg} px-3 py-1.5 text-[11px] font-bold ${p.chipText} shadow-md backdrop-blur-sm`}>
                    <Zap className="h-3.5 w-3.5" />
                    {p.chip}
                  </div>
                </div>
                
                <div className="mt-4 relative z-10">
                  <h4 className="text-base font-black text-gray-900 leading-tight group-hover:text-rose-600 transition-colors duration-200 drop-shadow-sm">
                    {p.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-gray-800 leading-relaxed font-semibold drop-shadow-sm">{p.subtitle}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between relative z-10">
                  <button className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group-hover:gap-2 transition-all duration-200 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                    Shop Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <div className={`${p.iconColor} transition-transform duration-300 drop-shadow-md ${
                    hoveredPromo === p.id ? 'scale-110 rotate-12' : 'scale-100'
                  }`}>
                    {p.icon}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right: Big banner */}
        <div className={`col-span-12 md:col-span-7 animate-slideLeft ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative h-[280px] sm:h-[320px] md:h-full min-h-[280px] overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-2xl hover:shadow-3xl transition-shadow duration-300">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-1000 ${
                  i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                }`}
              >
                {/* Full Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={s.img} 
                    alt={s.title} 
                    className={`h-full w-full object-cover transition-transform duration-1000 ${
                      i === idx ? 'scale-100' : 'scale-110'
                    }`}
                  />
                  {/* Gradient Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-center gap-3 relative z-10 animate-contentSlide max-w-lg">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-xs font-bold text-white shadow-lg animate-pulse">
                    <BadgePercent className="h-4 w-4" />
                    {s.badge}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-2xl">
                    {s.title}
                  </h3>
                  <p className="text-sm text-white/95 leading-relaxed font-semibold drop-shadow-lg">
                    {s.desc}
                  </p>
                  <button className="mt-3 inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-gray-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                    {s.cta}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === idx ? "w-10 bg-white shadow-lg" : "w-2.5 bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-800 hover:bg-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-20"
              aria-label="Previous slide"
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % slides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-800 hover:bg-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-20"
              aria-label="Next slide"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes contentSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .animate-slideLeft {
          animation: slideLeft 0.7s ease-out forwards;
          animation-delay: 0.2s;
        }
        
        .animate-contentSlide {
          animation: contentSlide 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}