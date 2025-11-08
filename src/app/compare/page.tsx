"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  X, 
  Plus, 
  Star, 
  Check, 
  Minus,
  ShoppingCart,
  Heart,
  Eye,
  GitCompare,
  Zap,
  Award,
  Shield
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  brand: string;
  category: string;
  inStock: boolean;
  features: {
    [key: string]: string | boolean | number;
  };
  pros: string[];
  cons: string[];
  discount?: number;
};

const availableProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones Pro",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1250,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    brand: "AudioTech",
    category: "Electronics",
    inStock: true,
    discount: 25,
    features: {
      "Battery Life": "40 hours",
      "Noise Cancellation": true,
      "Wireless": true,
      "Weight": "250g",
      "Bluetooth Version": "5.0",
      "Quick Charge": true,
      "Voice Assistant": true,
      "Foldable": true
    },
    pros: ["Excellent sound quality", "Long battery life", "Comfortable fit", "Great noise cancellation"],
    cons: ["Expensive", "Bulky design"]
  },
  {
    id: "2",
    name: "Premium Wireless Earbuds",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop",
    brand: "SoundWave",
    category: "Electronics",
    inStock: true,
    discount: 20,
    features: {
      "Battery Life": "24 hours",
      "Noise Cancellation": true,
      "Wireless": true,
      "Weight": "50g",
      "Bluetooth Version": "5.2",
      "Quick Charge": true,
      "Voice Assistant": true,
      "Foldable": false
    },
    pros: ["Compact design", "Good sound quality", "Affordable", "Easy to carry"],
    cons: ["Shorter battery life", "Less bass"]
  },
  {
    id: "3",
    name: "Studio Monitor Headphones",
    price: 449.99,
    rating: 4.9,
    reviews: 567,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop",
    brand: "StudioPro",
    category: "Electronics",
    inStock: true,
    features: {
      "Battery Life": "N/A (Wired)",
      "Noise Cancellation": false,
      "Wireless": false,
      "Weight": "320g",
      "Bluetooth Version": "N/A",
      "Quick Charge": false,
      "Voice Assistant": false,
      "Foldable": true
    },
    pros: ["Professional sound quality", "Durable build", "Accurate audio", "Comfortable for long use"],
    cons: ["Wired only", "Heavy", "No wireless features"]
  }
];

const featureCategories = {
  "Basic Info": ["Battery Life", "Weight", "Wireless"],
  "Audio Features": ["Noise Cancellation", "Bluetooth Version", "Voice Assistant"],
  "Design": ["Foldable", "Quick Charge"]
};

export default function ComparePage() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const addProduct = (product: Product) => {
    if (compareProducts.length < 4 && !compareProducts.find(p => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
      setShowAddModal(false);
    }
  };

  const removeProduct = (productId: string) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };

  const toggleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderFeatureValue = (value: string | boolean | number) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="h-5 w-5 text-green-600 mx-auto" />
      ) : (
        <Minus className="h-5 w-5 text-red-500 mx-auto" />
      );
    }
    return <span className="text-center">{value}</span>;
  };

  const getBestValue = (feature: string) => {
    if (compareProducts.length === 0) return null;
    
    const values = compareProducts.map(p => p.features[feature]);
    
    if (feature === "Battery Life") {
      const numericValues = values.map(v => {
        if (typeof v === 'string' && v.includes('hours')) {
          return parseInt(v);
        }
        return 0;
      });
      const maxValue = Math.max(...numericValues);
      return compareProducts.findIndex(p => {
        const val = p.features[feature];
        return typeof val === 'string' && parseInt(val) === maxValue;
      });
    }
    
    if (feature === "Weight") {
      const numericValues = values.map(v => {
        if (typeof v === 'string' && v.includes('g')) {
          return parseInt(v);
        }
        return Infinity;
      });
      const minValue = Math.min(...numericValues);
      return compareProducts.findIndex(p => {
        const val = p.features[feature];
        return typeof val === 'string' && parseInt(val) === minValue;
      });
    }
    
    if (typeof values[0] === 'boolean') {
      return compareProducts.findIndex(p => p.features[feature] === true);
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <GitCompare className="h-10 w-10 text-rose-600" />
            Compare Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare features, prices, and specifications to make the best choice for your needs.
          </p>
        </div>

        {compareProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <GitCompare className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Comparing Products</h3>
            <p className="text-gray-600 mb-6">Add up to 4 products to compare their features and specifications</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              Add Products to Compare
            </button>
          </div>
        ) : (
          /* Comparison Table */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Product Headers */}
            <div className="grid grid-cols-1 lg:grid-cols-5 border-b border-gray-200">
              <div className="p-6 bg-gray-50 lg:col-span-1">
                <h3 className="font-semibold text-gray-900">Products ({compareProducts.length}/4)</h3>
                {compareProducts.length < 4 && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-2 text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </button>
                )}
              </div>
              
              {compareProducts.map((product, index) => (
                <div key={product.id} className="p-6 relative">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="text-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                    />
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                    
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-amber-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                      )}
                      {product.discount && (
                        <div className="text-xs text-green-600 font-semibold">Save {product.discount}%</div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleLike(product.id)}
                        className={`flex-1 py-2 px-3 rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                          likedItems.has(product.id)
                            ? 'border-rose-600 bg-rose-50 text-rose-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedItems.has(product.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button className="flex-1 bg-rose-600 text-white py-2 px-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-1">
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 4 - compareProducts.length }).map((_, index) => (
                <div key={`empty-${index}`} className="p-6 border-l border-gray-200">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-rose-300 hover:text-rose-600 transition-colors"
                  >
                    <div className="text-center">
                      <Plus className="h-8 w-8 mx-auto mb-2" />
                      <span className="text-sm">Add Product</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Feature Comparison */}
            {Object.entries(featureCategories).map(([category, features]) => (
              <div key={category}>
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">{category}</h4>
                </div>
                
                {features.map(feature => {
                  const bestIndex = getBestValue(feature);
                  
                  return (
                    <div key={feature} className="grid grid-cols-1 lg:grid-cols-5 border-b border-gray-100">
                      <div className="p-4 bg-gray-50 font-medium text-gray-900 lg:col-span-1">
                        {feature}
                      </div>
                      
                      {compareProducts.map((product, index) => (
                        <div
                          key={`${product.id}-${feature}`}
                          className={`p-4 text-center ${
                            bestIndex === index ? 'bg-green-50 border-l-4 border-green-500' : ''
                          }`}
                        >
                          {renderFeatureValue(product.features[feature])}
                          {bestIndex === index && (
                            <div className="text-xs text-green-600 font-semibold mt-1">Best</div>
                          )}
                        </div>
                      ))}
                      
                      {/* Empty cells */}
                      {Array.from({ length: 4 - compareProducts.length }).map((_, index) => (
                        <div key={`empty-${feature}-${index}`} className="p-4 border-l border-gray-200 bg-gray-50" />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="p-4 bg-gray-50 font-medium text-gray-900 lg:col-span-1">
                Pros & Cons
              </div>
              
              {compareProducts.map(product => (
                <div key={`pros-cons-${product.id}`} className="p-4">
                  <div className="mb-3">
                    <h5 className="text-sm font-semibold text-green-600 mb-2">Pros</h5>
                    <ul className="text-xs space-y-1">
                      {product.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-semibold text-red-600 mb-2">Cons</h5>
                    <ul className="text-xs space-y-1">
                      {product.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <X className="h-3 w-3 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              
              {/* Empty cells */}
              {Array.from({ length: 4 - compareProducts.length }).map((_, index) => (
                <div key={`empty-pros-cons-${index}`} className="p-4 border-l border-gray-200 bg-gray-50" />
              ))}
            </div>
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Add Product to Compare</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableProducts
                    .filter(product => !compareProducts.find(p => p.id === product.id))
                    .map(product => (
                      <div
                        key={product.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-amber-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-600">({product.reviews})</span>
                        </div>
                        <div className="mb-3">
                          <span className="font-bold text-gray-900">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                          )}
                        </div>
                        <button
                          onClick={() => addProduct(product)}
                          className="w-full bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          Add to Compare
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Tips */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Smart Comparison Tips</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Compare Key Features</h4>
              <p className="text-gray-600">Focus on the features that matter most to your specific needs and usage.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Check Reviews</h4>
              <p className="text-gray-600">Look at ratings and review counts to gauge real user satisfaction.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Consider Value</h4>
              <p className="text-gray-600">Balance price with features to find the best value for your budget.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
