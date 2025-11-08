"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useCart } from "../../../contexts/CartContext";
import QuickAddCarousel from "../../../components/QuickAddCarousel";
import RecentlyViewedCarousel from "../../../components/RecentlyViewedCarousel";
import RelatedProductsCarousel from "../../../components/RelatedProductsCarousel";
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  brand: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  variants: {
    color?: string[];
    size?: string[];
  };
  shipping: {
    free: boolean;
    days: string;
    cost?: number;
  };
  warranty: string;
  returnPolicy: string;
  discount?: number;
};

type Review = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  images?: string[];
};

// Mock data - in real app, this would come from API
const getProduct = (id: string): Product => ({
  id,
  name: "Wireless Bluetooth Headphones Pro Max",
  price: 299.99,
  originalPrice: 399.99,
  rating: 4.8,
  reviews: 1250,
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
    "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=800&fit=crop"
  ],
  brand: "TechSound",
  category: "Electronics",
  inStock: true,
  stockCount: 24,
  description: "Experience premium audio quality with our flagship wireless headphones. Featuring advanced noise cancellation, 40-hour battery life, and premium materials for ultimate comfort during extended listening sessions.",
  features: [
    "Active Noise Cancellation (ANC)",
    "40-hour battery life with quick charge",
    "Premium leather ear cushions",
    "Hi-Res Audio certified",
    "Bluetooth 5.2 connectivity",
    "Voice assistant compatible",
    "Foldable design for portability",
    "Multi-device pairing"
  ],
  specifications: {
    "Driver Size": "40mm Dynamic",
    "Frequency Response": "20Hz - 40kHz",
    "Impedance": "32 Ohm",
    "Sensitivity": "100 dB/mW",
    "Battery Life": "40 hours (ANC off), 30 hours (ANC on)",
    "Charging Time": "2 hours (full), 15 min (5 hours playback)",
    "Weight": "250g",
    "Connectivity": "Bluetooth 5.2, 3.5mm jack",
    "Microphone": "Built-in with CVC noise reduction"
  },
  variants: {
    color: ["Black", "White", "Silver", "Rose Gold"],
    size: ["Standard"]
  },
  shipping: {
    free: true,
    days: "2-3 business days",
    cost: 0
  },
  warranty: "2 years manufacturer warranty",
  returnPolicy: "30-day free returns",
  discount: 25
});

const getReviews = (): Review[] => [
  {
    id: "1",
    user: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "Nov 1, 2024",
    title: "Exceptional sound quality!",
    comment: "These headphones exceeded my expectations. The noise cancellation is incredible and the battery life is exactly as advertised. Perfect for long flights and daily commuting.",
    helpful: 23,
    verified: true,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"]
  },
  {
    id: "2",
    user: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    date: "Oct 28, 2024",
    title: "Great value for money",
    comment: "Solid build quality and great sound. The only minor issue is that they can feel a bit heavy during extended use, but the comfort is still good overall.",
    helpful: 15,
    verified: true
  },
  {
    id: "3",
    user: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "Oct 25, 2024",
    title: "Perfect for work from home",
    comment: "The noise cancellation helps me focus during video calls. The microphone quality is crystal clear according to my colleagues. Highly recommended!",
    helpful: 31,
    verified: true
  }
];

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = getProduct(productId);
  const reviews = getReviews();
  const { addItem } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.variants.color?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.variants.size?.[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews">("description");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stockCount, prev + change)));
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.images[0],
      brand: product.brand,
      inStock: product.inStock,
      discount: product.discount,
      variant: {
        color: selectedColor,
        size: selectedSize
      },
      quantity: quantity
    });
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-gray-900 whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-900 whitespace-nowrap">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-gray-900 whitespace-nowrap">{product.category}</Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {product.discount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}%
                </div>
              )}

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-rose-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-rose-600 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{product.brand}</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'text-amber-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium text-gray-900 ml-2">{product.rating}</span>
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && (
                <span className="text-lg sm:text-xl text-gray-500 line-through">${product.originalPrice}</span>
              )}
              {product.discount && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm font-semibold">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm sm:text-base">In Stock ({product.stockCount} available)</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium text-sm sm:text-base">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description}</p>

            {/* Variants */}
            {product.variants.color && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Color</h3>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {product.variants.color.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-rose-600 bg-rose-50 text-rose-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Quantity</h3>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <span className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockCount}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {product.stockCount} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-rose-600 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </button>
              
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2.5 sm:p-3 border rounded-lg transition-colors ${
                  isWishlisted
                    ? 'border-rose-600 bg-rose-50 text-rose-600'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-2.5 sm:p-3 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors">
                <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600 hidden sm:block">{product.shipping.days}</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Warranty</p>
                <p className="text-xs text-gray-600 hidden sm:block">{product.warranty}</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm font-medium text-gray-900">Returns</p>
                <p className="text-xs text-gray-600 hidden sm:block">{product.returnPolicy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: "description", label: "Description", shortLabel: "Info" },
                { id: "specifications", label: "Specifications", shortLabel: "Specs" },
                { id: "reviews", label: `Reviews (${reviews.length})`, shortLabel: "Reviews" }
              ].map(({ id, label, shortLabel }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === id
                      ? "border-rose-600 text-rose-600 bg-rose-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="grid gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex py-3 border-b border-gray-100">
                      <div className="w-1/3 font-medium text-gray-900">{key}</div>
                      <div className="w-2/3 text-gray-600">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Reviews Summary */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(averageRating) 
                                ? 'text-amber-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">Based on {reviews.length} reviews</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Rating Distribution</h4>
                    <div className="space-y-2">
                      {ratingDistribution.map(({ rating, count, percentage }) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-amber-400 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-gray-900">{review.user}</h5>
                            {review.verified && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating 
                                      ? 'text-amber-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{review.date}</span>
                          </div>
                          
                          <h6 className="font-medium text-gray-900 mb-2">{review.title}</h6>
                          <p className="text-gray-600 mb-4">{review.comment}</p>
                          
                          {review.images && (
                            <div className="flex gap-2 mb-4">
                              {review.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm">
                            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                              <ThumbsUp className="h-4 w-4" />
                              Helpful ({review.helpful})
                            </button>
                            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                              <MessageCircle className="h-4 w-4" />
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {reviews.length > 3 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors"
                    >
                      {showAllReviews ? 'Show Less' : `View All ${reviews.length} Reviews`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Carousels */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-12 space-y-4 sm:space-y-6 lg:space-y-8">
        <QuickAddCarousel />
        <RecentlyViewedCarousel />
        <RelatedProductsCarousel />
      </div>

      <Footer />
    </div>
  );
}
