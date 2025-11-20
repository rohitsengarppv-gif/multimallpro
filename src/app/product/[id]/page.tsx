"use client";
import { useState, useEffect, useRef } from "react";
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
  ArrowLeft,
  Loader2,
  Store,
  MapPin,
  Phone,
  Mail,
  Globe,
  Package,
  CheckCircle,
  Calendar
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
  const { addItem } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState<any>(null);
  const [vendorProductsCount, setVendorProductsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    userName: "",
    userEmail: "",
    rating: 5,
    title: "",
    comment: "",
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specifications" | "reviews" | "vendor">("description");
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  // Touch/swipe handling for mobile tabs
  const tabsRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/routes/products/${productId}`);
        const data = await response.json();

        if (data.success && data.data) {
          setProduct(data.data);
          setVendor(data.data.vendor);
          setSelectedColor(data.data.variations?.variants?.[0]?.combination?.Color || "");
          setSelectedSize(data.data.variations?.variants?.[0]?.combination?.Size || "");
          
          // Fetch reviews
          fetchReviews();
          
          // Fetch vendor products count
          if (data.data.vendor?._id) {
            fetchVendorProductsCount(data.data.vendor._id);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews2?productId=${productId}&status=approved`);
        const data = await response.json();

        if (data.success) {
          setReviews(data.data.reviews || []);
          setReviewStats(data.data.stats || null);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    const fetchVendorProductsCount = async (vendorId: string) => {
      try {
        const response = await fetch(`/api/routes/products?vendor=${vendorId}&active=true`);
        const data = await response.json();

        if (data.success && data.data) {
          setVendorProductsCount(data.data.pagination?.total || 0);
        }
      } catch (err) {
        console.error("Error fetching vendor products count:", err);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const nextImage = () => {
    const images = product.mainImage 
      ? [product.mainImage, ...(product.images || [])]
      : (product.images || []);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = product.mainImage 
      ? [product.mainImage, ...(product.images || [])]
      : (product.images || []);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Debug: Monitor selectedVariants changes
  useEffect(() => {
    console.log("selectedVariants state changed:", selectedVariants);
  }, [selectedVariants]);

  const handleQuantityChange = (change: number) => {
    const maxStock = product?.stock || product?.inventory?.quantity || 1;
    setQuantity(prev => Math.max(1, Math.min(maxStock, prev + change)));
  };

  // Handle touch gestures for tab swiping on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next tab
      const tabs = ["description", "specifications", "vendor", "reviews"];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1] as any);
      }
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - previous tab
      const tabs = ["description", "specifications", "vendor", "reviews"];
      const currentIndex = tabs.indexOf(activeTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1] as any);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    // Get user ID from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Please login to add items to cart");
      window.location.href = "/auth/login";
      return;
    }

    try {
      const user = JSON.parse(userData);
      
      // Build variant data from selectedVariants object (supports any attributes)
      // Use a fresh read of the state
      const variantData = Object.keys(selectedVariants).length > 0 
        ? { ...selectedVariants } 
        : undefined;
      
      console.log("=== ADD TO CART DEBUG ===");
      console.log("selectedVariants state:", selectedVariants);
      console.log("variantData to send:", variantData);
      console.log("Object.keys length:", Object.keys(selectedVariants).length);
      console.log("========================");

      // Normalize pricing so discount is always non-negative
      const basePrice = Number(product.price) || 0;
      const comparePrice =
        typeof product.comparePrice === "number" ? Number(product.comparePrice) : undefined;
      const hasBothPrices = typeof comparePrice === "number" && comparePrice > 0;

      const effectivePrice = hasBothPrices
        ? Math.min(basePrice, comparePrice as number)
        : basePrice;

      const crossedPrice = hasBothPrices
        ? Math.max(basePrice, comparePrice as number)
        : undefined;

      const discount =
        crossedPrice && crossedPrice > effectivePrice
          ? Math.round(((crossedPrice - effectivePrice) / crossedPrice) * 100)
          : undefined;
      
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          productId: product._id || product.id,
          name: product.name,
          price: effectivePrice,
          originalPrice: crossedPrice,
          quantity: quantity,
          image: product.mainImage?.url || product.images?.[0]?.url || "https://via.placeholder.com/400",
          brand: vendor?.businessName || "Unknown",
          discount,
          ...(variantData && { variant: variantData }),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Also add to local context for immediate UI update
        addItem({
          id: product._id || product.id,
          name: product.name,
          price: effectivePrice,
          originalPrice: crossedPrice,
          image: product.mainImage?.url || product.images?.[0]?.url,
          brand: vendor?.businessName || "Unknown",
          inStock: product.stock > 0,
          discount,
          variant: {
            color: selectedColor,
            size: selectedSize
          },
          quantity: quantity
        });
        
        // Success - no alert, cart will update automatically
      } else {
        console.error("Failed to add to cart:", data.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewFormData.userName || !reviewFormData.userEmail || !reviewFormData.title || !reviewFormData.comment) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await fetch("/api/reviews2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          vendorId: vendor._id,
          user: {
            name: reviewFormData.userName,
            email: reviewFormData.userEmail,
          },
          rating: reviewFormData.rating,
          title: reviewFormData.title,
          comment: reviewFormData.comment,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Review submitted successfully! It will appear after approval.");
        setShowReviewForm(false);
        setReviewFormData({
          userName: "",
          userEmail: "",
          rating: 5,
          title: "",
          comment: "",
        });
      } else {
        alert(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Product not found"}</h1>
          <Link href="/shop" className="text-rose-600 hover:text-rose-700">
            Return to Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.mainImage 
    ? [product.mainImage, ...(product.images || [])]
    : (product.images || []);

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
            <Link href={`/shop?category=${product.category?.slug || ''}`} className="hover:text-gray-900 whitespace-nowrap">
              {product.category?.name || 'Products'}
            </Link>
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
                src={productImages[currentImageIndex]?.url || "https://via.placeholder.com/800x800?text=No+Image"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {product.comparePrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </div>
              )}

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
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
            {productImages.length > 1 && (
              <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-2">
                {productImages.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-rose-600' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image?.url || "https://via.placeholder.com/100x100"}
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
              <p className="text-rose-600 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{product.brand || vendor?.businessName || 'Brand'}</p>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 leading-tight">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0) 
                          ? 'text-amber-400 fill-current' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium text-gray-900 ml-2">{product.rating || 0}</span>
                </div>
                <span className="text-sm text-gray-600">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{product.comparePrice}</span>
              {product.comparePrice && (
                <span className="text-lg sm:text-xl text-gray-500 line-through">₹{product.price}</span>
              )}
              {product.comparePrice && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs sm:text-sm font-semibold">
                  Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm sm:text-base">In Stock ({product.stock || product.inventory?.quantity || 0} available)</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium text-sm sm:text-base">Out of Stock</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{product.description || product.shortDescription || ''}</p>

            {/* Variants */}
            {product.variations?.options && 
             Object.keys(product.variations.options).length > 0 && 
             Object.values(product.variations.options).some((opts: any) => Array.isArray(opts) && opts.length > 0) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Variants</h3>
                {Object.entries(product.variations.options).map(([attribute, options]: [string, any]) => (
                  <div key={attribute}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 sm:mb-3">{attribute}</h3>
                    <div className="flex gap-2 flex-wrap">
                      {Array.isArray(options) && options.map((option: string) => (
                        <button
                          key={option}
                          onClick={() => {
                            console.log("Variant clicked:", { attribute, option });
                            // Handle legacy state for backward compatibility
                            if (attribute === 'Color') setSelectedColor(option);
                            if (attribute === 'Size') setSelectedSize(option);
                            // Store in dynamic variants object
                            setSelectedVariants(prev => {
                              const updated = {
                                ...prev,
                                [attribute]: option
                              };
                              console.log("Updated selectedVariants:", updated);
                              return updated;
                            });
                          }}
                          className={`px-3 sm:px-4 py-1.5 sm:py-2 border-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            selectedVariants[attribute] === option || 
                            (attribute === 'Color' && selectedColor === option) || 
                            (attribute === 'Size' && selectedSize === option)
                              ? 'border-rose-600 bg-rose-50 text-rose-600 shadow-sm'
                              : 'border-gray-300 text-gray-700 hover:border-rose-300 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Display available variants */}
                {product.variations?.variants && product.variations.variants.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Variants</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {product.variations.variants.map((variant: any, index: number) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-2 bg-white rounded border border-gray-200 hover:border-rose-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-xs sm:text-sm">
                            {Object.entries(variant.combination || {}).map(([key, value]: [string, any], idx: number) => (
                              <span key={key} className="flex items-center">
                                <span className="font-medium text-gray-700">{key}:</span>
                                <span className="ml-1 text-gray-900">{value}</span>
                                {idx < Object.keys(variant.combination).length - 1 && (
                                  <span className="mx-2 text-gray-400">|</span>
                                )}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            {variant.price && (
                              <span className="font-bold text-rose-600 text-sm">₹{variant.price}</span>
                            )}
                            {variant.stock !== undefined && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                variant.stock > 0 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                    disabled={quantity >= (product.stock || product.inventory?.quantity || 1)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {product.stock || product.inventory?.quantity || 0} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
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
            <nav className="flex overflow-x-auto scrollbar-hide"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {[
                { id: "description", label: "Description", shortLabel: "Info" },
                { id: "specifications", label: "Specifications", shortLabel: "Specs" },
                { id: "vendor", label: "Vendor Info", shortLabel: "Vendor" },
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
                  <p className="text-gray-600 leading-relaxed mb-6">{product.description || product.shortDescription || 'No description available.'}</p>
                </div>
                
                {product.longDescription && product.longDescription.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Information</h3>
                    <div className="space-y-4">
                      {product.longDescription.map((item: any) => (
                        <div key={item.id}>
                          {item.type === 'text' && <p className="text-gray-600">{item.content}</p>}
                          {item.type === 'feature' && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-gray-700">{item.content}</span>
                            </div>
                          )}
                          {item.type === 'image' && item.url && (
                            <img src={item.url} alt="Product detail" className="rounded-lg max-w-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="grid gap-4">
                    {product.specifications.map((spec: any) => (
                      <div key={spec.id || spec.key} className="flex py-3 border-b border-gray-100">
                        <div className="w-1/3 font-medium text-gray-900">{spec.key}</div>
                        <div className="w-2/3 text-gray-600">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === "vendor" && vendor && (
              <div>
                {/* Vendor Header */}
                <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-6 rounded-lg mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {vendor.avatar?.url ? (
                        <img
                          src={vendor.avatar.url}
                          alt={vendor.businessName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                          {vendor.businessName?.[0]?.toUpperCase() || 'S'}
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{vendor.businessName}</h3>
                        <p className="text-gray-600">{vendor.businessType || 'Business'}</p>
                        {vendor.isVerified && (
                          <span className="inline-flex items-center gap-1 text-sm text-green-600 mt-1">
                            <CheckCircle className="h-4 w-4" />
                            Verified Seller
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/vendor/${vendor._id}`}
                      className="bg-rose-600 text-white px-6 py-2.5 rounded-lg hover:bg-rose-700 transition-colors font-medium shadow-md hover:shadow-lg"
                    >
                      Visit Store
                    </Link>
                  </div>

                  {/* Contact Details */}
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    {vendor.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-rose-600" />
                        <a href={`mailto:${vendor.email}`} className="text-gray-700 hover:text-rose-600 truncate">
                          {vendor.email}
                        </a>
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-rose-600" />
                        <a href={`tel:${vendor.phone}`} className="text-gray-700 hover:text-rose-600">
                          {vendor.phone}
                        </a>
                      </div>
                    )}
                    {(vendor.city || vendor.state) && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-rose-600" />
                        <span className="text-gray-700">
                          {vendor.city}{vendor.city && vendor.state && ', '}{vendor.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="bg-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-3">
                      <Package className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900 mb-1">{vendorProductsCount}</p>
                    <p className="text-xs sm:text-sm text-blue-700 font-medium">Products</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="bg-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-3">
                      <Star className="h-6 w-6 sm:h-7 sm:w-7 text-amber-500" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-amber-900 mb-1">
                      {reviewStats?.averageRating ? reviewStats.averageRating.toFixed(1) : (product.rating || 0).toFixed(1)}
                    </p>
                    <p className="text-xs sm:text-sm text-amber-700 font-medium">Rating</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="bg-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7 text-green-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-green-900 mb-1">{reviewStats?.totalReviews || reviews.length}</p>
                    <p className="text-xs sm:text-sm text-green-700 font-medium">Reviews</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="bg-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-900 mb-1">
                      {vendor.createdAt ? new Date(vendor.createdAt).getFullYear() : '-'}
                    </p>
                    <p className="text-xs sm:text-sm text-purple-700 font-medium">Since</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">Contact Information</h4>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-lg p-4 border border-rose-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-rose-600 rounded-lg p-2">
                            <Mail className="h-5 w-5 text-white" />
                          </div>
                          <p className="font-semibold text-gray-900">Email Address</p>
                        </div>
                        {vendor.email ? (
                          <a 
                            href={`mailto:${vendor.email}`} 
                            className="text-gray-700 hover:text-rose-600 font-medium text-sm sm:text-base break-all"
                          >
                            {vendor.email}
                          </a>
                        ) : (
                          <p className="text-gray-400 text-sm italic">Not provided</p>
                        )}
                      </div>
                      
                      {/* Phone */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-blue-600 rounded-lg p-2">
                            <Phone className="h-5 w-5 text-white" />
                          </div>
                          <p className="font-semibold text-gray-900">Mobile Number</p>
                        </div>
                        {vendor.phone ? (
                          <a 
                            href={`tel:${vendor.phone}`} 
                            className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base"
                          >
                            {vendor.phone}
                          </a>
                        ) : (
                          <p className="text-gray-400 text-sm italic">Not provided</p>
                        )}
                      </div>
                      
                      {/* Website */}
                      {vendor.website && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-green-600 rounded-lg p-2">
                              <Globe className="h-5 w-5 text-white" />
                            </div>
                            <p className="font-semibold text-gray-900">Website</p>
                          </div>
                          <a
                            href={vendor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-green-600 font-medium text-sm sm:text-base break-all"
                          >
                            {vendor.website}
                          </a>
                        </div>
                      )}
                      
                      {/* Address */}
                      <div className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 ${vendor.website ? 'sm:col-span-1' : 'sm:col-span-2'}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-purple-600 rounded-lg p-2">
                            <MapPin className="h-5 w-5 text-white" />
                          </div>
                          <p className="font-semibold text-gray-900">Business Address</p>
                        </div>
                        {(vendor.businessAddress || vendor.city || vendor.state) ? (
                          <div className="text-gray-700 text-sm sm:text-base">
                            {vendor.businessAddress && <p className="mb-1">{vendor.businessAddress}</p>}
                            <p>
                              {vendor.city && `${vendor.city}`}
                              {vendor.city && vendor.state && ', '}
                              {vendor.state && `${vendor.state}`}
                              {(vendor.city || vendor.state) && vendor.zipCode && ' - '}
                              {vendor.zipCode && vendor.zipCode}
                            </p>
                            {vendor.country && <p className="mt-1 font-medium">{vendor.country}</p>}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm italic">Not provided</p>
                        )}
                      </div>
                    </div>
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

                {/* Write Review Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                  >
                    {showReviewForm ? "Cancel" : "Write a Review"}
                  </button>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                        <input
                          type="text"
                          value={reviewFormData.userName}
                          onChange={(e) => setReviewFormData(prev => ({ ...prev, userName: e.target.value }))}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Email *</label>
                        <input
                          type="email"
                          value={reviewFormData.userEmail}
                          onChange={(e) => setReviewFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= reviewFormData.rating
                                  ? 'text-amber-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-gray-600">{reviewFormData.rating} star{reviewFormData.rating !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Review Title *</label>
                      <input
                        type="text"
                        value={reviewFormData.title}
                        onChange={(e) => setReviewFormData(prev => ({ ...prev, title: e.target.value }))}
                        required
                        maxLength={100}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Summarize your experience"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                      <textarea
                        value={reviewFormData.comment}
                        onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                        required
                        maxLength={1000}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        placeholder="Share your thoughts about this product..."
                      />
                      <p className="text-xs text-gray-500 mt-1">{reviewFormData.comment.length}/1000 characters</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                    <div key={review._id || review.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                          {review.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h5 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h5>
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
                            <span className="text-sm text-gray-600">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recently'}
                            </span>
                          </div>
                          
                          <h6 className="font-medium text-gray-900 mb-2">{review.title}</h6>
                          <p className="text-gray-600 mb-4">{review.comment}</p>
                          
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mb-4">
                              {review.images.map((image: any, index: number) => (
                                <img
                                  key={index}
                                  src={image?.url || image}
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
                  ))
                  )}
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
