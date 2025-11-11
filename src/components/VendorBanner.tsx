"use client";
import { ArrowRight, Store, Sparkles } from "lucide-react";

export default function VendorBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-gradient-to-r from-neutral-50 to-white shadow-xl">
        {/* Content */}
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-6 p-8 md:p-12 flex flex-col justify-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-700">
              <Sparkles className="h-3.5 w-3.5" /> 20% FLAT DISCOUNT
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Become a Vendor.
              <br />Grow Your Business With Us.
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              Get your storefront, reach millions of customers, and enjoy fast payouts, promotion tools, and dedicated support.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Store className="h-5 w-5" /> Become a Vendor
              </a>
              <a
                href="/shop"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 shadow-md"
              >
                Explore now <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative col-span-12 md:col-span-6 min-h-[240px]">
            {/* Background accents */}
            <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-rose-200/40 blur-2xl" />
            <div className="absolute right-20 -bottom-8 h-56 w-56 rounded-full bg-pink-200/40 blur-2xl" />

            {/* Product mock visuals (watches) */}
            <img
              src="https://images.unsplash.com/photo-1544117519-31a4b719223d?w=1000&auto=format&fit=crop"
              alt="Smartwatch"
              className="absolute left-6 top-6 h-48 w-48 object-contain drop-shadow-2xl rotate-[-10deg]"
            />
            <img
              src="https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=1000&auto=format&fit=crop"
              alt="Smartwatch Pink"
              className="absolute right-6 bottom-6 h-52 w-52 object-contain drop-shadow-2xl rotate-[8deg]"
            />
          </div>
        </div>

        {/* Decorative edge */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl" />
      </div>
    </section>
  );
}
