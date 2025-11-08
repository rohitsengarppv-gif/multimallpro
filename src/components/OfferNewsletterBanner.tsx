"use client";
import { useState } from "react";
import { Mail, Gift, ArrowRight, CheckCircle, Sparkles, Zap } from "lucide-react";

export default function OfferNewsletterBanner() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Special Offer Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700 p-8 lg:p-12 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20 blur-xl"></div>
            <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white/15 blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-white/10 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Gift className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                Limited Time
              </span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
              Get <span className="text-yellow-300">50% OFF</span><br />
              Your First Order
            </h2>
            
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Discover amazing deals on premium products. Limited time offer for new customers only!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Claim Offer
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Valid until Dec 31, 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Stay in the Loop
            </h3>
            
            <p className="text-gray-600 leading-relaxed">
              Subscribe to our newsletter and be the first to know about exclusive deals, new arrivals, and special promotions.
            </p>
          </div>

          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 text-lg"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to the Family!
              </h4>
              <p className="text-gray-600">
                Thank you for subscribing. Check your inbox for exclusive offers!
              </p>
            </div>
          )}

          {/* Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4 font-semibold">What you'll get:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                <span>Exclusive discounts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Early access to sales</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>New product alerts</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Weekly style tips</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">10,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">No Spam Guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Unsubscribe Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
