"use client";

import { useState, useEffect } from "react";
import { Check, ChevronRight, ShoppingBag, MapPin, CreditCard, Package, Tag, X, Copy, CheckCircle, Plus } from "lucide-react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  brand: string;
  discount?: number;
  vendor?: string;
  variant?: Record<string, string>;
}

interface CartData {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface Offer {
  _id: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed" | "shipping";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount?: number;
  firstTimeCustomersOnly?: boolean;
  image?: {
    url: string;
  };
  vendor: string;
  endDate: string;
}

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  addressType: "home" | "work" | "other";
  isDefault: boolean;
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cartData, setCartData] = useState<CartData>({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const [showOfferPopup, setShowOfferPopup] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<Offer | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  // Payment Information
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const steps = [
    { number: 1, title: "Cart Review", icon: ShoppingBag },
    { number: 2, title: "Shipping", icon: MapPin },
    { number: 3, title: "Payment", icon: CreditCard },
  ];

  useEffect(() => {
    fetchCart();
    fetchUserProfile();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const user = JSON.parse(userData);
      const response = await fetch("/api/cart", {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();

      if (data.success) {
        setCartData(data.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    try {
      const user = JSON.parse(userData);
      const response = await fetch("/api/users/me", {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();

      if (data.success && data.data) {
        setShippingInfo({
          fullName: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address?.street || "",
          city: data.data.address?.city || "",
          state: data.data.address?.state || "",
          zipCode: data.data.address?.zipCode || "",
          country: data.data.address?.country || "India",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchAddresses = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    try {
      const user = JSON.parse(userData);
      const response = await fetch("/api/addresses", {
        headers: { "x-user-id": user.id },
      });
      const data = await response.json();

      if (data.success && data.data) {
        setAddresses(data.data);
        // Auto-select default address
        const defaultAddr = data.data.find((addr: Address) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleNextStep = async () => {
    // If on payment step, place the order
    if (currentStep === 3) {
      await handlePlaceOrder();
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/auth/login";
      return;
    }

    if (!selectedAddress) {
      alert("Please select a delivery address");
      setCurrentStep(2);
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(userData);

      // Prepare order items with full product details
      const orderItems = cartData.items.map((item) => ({
        product: item.productId,
        productName: item.name,
        productImage: item.image,
        brand: item.brand,
        vendor: item.vendor,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price,
        originalPrice: item.originalPrice,
        discount: item.discount,
        total: item.price * item.quantity,
      }));

      const orderData = {
        items: orderItems,
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        shipping: calculateShipping(),
        discount: discountAmount,
        discountCode: appliedDiscount?.code,
        total: calculateTotal(),
        paymentMethod: paymentMethod.toUpperCase(),
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          addressLine1: selectedAddress.addressLine1,
          addressLine2: selectedAddress.addressLine2,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
        },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to thank you page with order ID
        window.location.href = `/thank-you?orderId=${data.data._id}`;
      } else {
        alert(data.message || "Failed to place order");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  const fetchVendorOffers = async () => {
    setLoadingOffers(true);
    setShowOfferPopup(true);

    try {
      // Get unique vendor IDs from cart items
      const vendorIds = new Set<string>();
      
      // Extract vendor IDs directly from cart items
      cartData.items.forEach((item: any) => {
        if (item.vendor) {
          vendorIds.add(item.vendor.toString());
        }
      });

      console.log("Vendor IDs from cart:", Array.from(vendorIds));

      // Fetch offers for all vendors
      const allOffers: Offer[] = [];
      for (const vendorId of vendorIds) {
        try {
          const response = await fetch(`/api/routes/discounts?vendor=${vendorId}&status=active`);
          const data = await response.json();
          console.log(`Offers for vendor ${vendorId}:`, data);
          if (data.success && data.data && data.data.discounts) {
            allOffers.push(...data.data.discounts);
          }
        } catch (error) {
          console.error("Error fetching vendor offers:", error);
        }
      }

      console.log("All offers fetched:", allOffers);
      setOffers(allOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleApplyCoupon = async (offer: Offer) => {
    setCouponError("");
    const subtotal = calculateSubtotal();

    try {
      // Validate minimum order amount
      if (offer.minOrderAmount && subtotal < offer.minOrderAmount) {
        setCouponError(`Minimum order amount of ₹${offer.minOrderAmount} required`);
        return;
      }

      // Check usage limit
      if (offer.usageLimit && offer.usageCount && offer.usageCount >= offer.usageLimit) {
        setCouponError("This coupon has reached its usage limit");
        return;
      }

      // Check if user is first-time customer (if required)
      if (offer.firstTimeCustomersOnly) {
        // For now, we'll skip this check if orders API doesn't exist
        // You can implement this later when orders API is ready
        console.log("First-time customer check: Skipped (Orders API not implemented)");
      }

      // Calculate discount amount
      let discount = 0;
      if (offer.type === "percentage") {
        discount = (subtotal * offer.value) / 100;
        if (offer.maxDiscount && discount > offer.maxDiscount) {
          discount = offer.maxDiscount;
        }
      } else if (offer.type === "fixed") {
        discount = Math.min(offer.value, subtotal); // Can't discount more than subtotal
      } else if (offer.type === "shipping") {
        // Free shipping - set shipping to 0
        discount = 0; // Shipping discount handled separately
      }

      // Apply the discount
      setAppliedDiscount(offer);
      setDiscountAmount(discount);
      setSelectedCoupon(offer.code);
      setShowOfferPopup(false);
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setSelectedCoupon("");
    setCouponError("");
  };

  const calculateSubtotal = () => {
    return cartData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    // Free shipping if coupon type is "shipping"
    if (appliedDiscount && appliedDiscount.type === "shipping") {
      return 0;
    }
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 50;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const afterDiscount = subtotal - discountAmount;
    return afterDiscount * 0.18; // 18% GST on discounted amount
  };

  const calculateTotal = () => {
    return calculateSubtotal() - discountAmount + calculateShipping() + calculateTax();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (cartData.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to checkout</p>
          <button
            onClick={() => window.location.href = "/"}
            className="bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.number
                        ? "bg-rose-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.number ? "text-rose-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-all ${
                      currentStep > step.number ? "bg-rose-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Step 1: Cart Review */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Cart</h2>
                  <div className="space-y-4">
                    {cartData.items.map((item, index) => (
                      <div key={`${item.productId}-${index}`} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          {item.variant && Object.keys(item.variant).length > 0 && (
                            <div className="flex gap-2 mt-1">
                              {Object.entries(item.variant).map(([key, value]) => (
                                <span key={key} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="font-bold text-gray-900">₹{item.price}</span>
                            <span className="text-sm text-gray-600">× {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                          <Tag className="h-5 w-5 text-rose-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Have a coupon code?</h3>
                          <p className="text-sm text-gray-600">View available offers from your vendors</p>
                        </div>
                      </div>
                      <button
                        onClick={fetchVendorOffers}
                        className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
                      >
                        View Offers
                      </button>
                    </div>
                    {appliedDiscount && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-semibold text-green-800">
                                Coupon "{appliedDiscount.code}" applied
                              </p>
                              <p className="text-xs text-green-600">
                                You saved ₹{discountAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    {couponError && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{couponError}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Select Delivery Address</h2>
                    <button
                      onClick={() => window.location.href = '/address'}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-rose-600 border border-rose-600 rounded-lg font-semibold hover:bg-rose-50 transition-colors text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4" />
                      Add New Address
                    </button>
                  </div>

                  {addresses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <MapPin className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
                      <p className="text-sm text-gray-600 mb-6">Add a delivery address to continue</p>
                      <button
                        onClick={() => window.location.href = '/address'}
                        className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700"
                      >
                        <Plus className="h-5 w-5" />
                        Add Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => setSelectedAddress(address)}
                          className={`p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddress?._id === address._id
                              ? "border-rose-500 bg-rose-50"
                              : "border-gray-200 hover:border-rose-300"
                          }`}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedAddress?._id === address._id
                                ? "border-rose-600 bg-rose-600"
                                : "border-gray-300"
                            }`}>
                              {selectedAddress?._id === address._id && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-gray-900 capitalize text-sm sm:text-base">
                                    {address.addressType}
                                  </h3>
                                  {address.isDefault && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                      <Check className="h-3 w-3" />
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-1 text-sm sm:text-base">
                                <p className="font-medium text-gray-900">{address.fullName}</p>
                                <p className="text-gray-600">{address.phone}</p>
                                <p className="text-gray-600">
                                  {address.addressLine1}
                                  {address.addressLine2 && `, ${address.addressLine2}`}
                                </p>
                                <p className="text-gray-600">
                                  {address.city}, {address.state} - {address.zipCode}
                                </p>
                                <p className="text-gray-600">{address.country}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="space-y-4 mb-6">
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "card" ? "border-rose-600 bg-rose-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "card" ? "border-rose-600" : "border-gray-300"
                        }`}>
                          {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-rose-600" />}
                        </div>
                        <CreditCard className="h-5 w-5 text-gray-700" />
                        <span className="font-medium text-gray-900">Credit/Debit Card</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "upi" ? "border-rose-600 bg-rose-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "upi" ? "border-rose-600" : "border-gray-300"
                        }`}>
                          {paymentMethod === "upi" && <div className="w-3 h-3 rounded-full bg-rose-600" />}
                        </div>
                        <span className="font-medium text-gray-900">UPI</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === "cod" ? "border-rose-600 bg-rose-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "cod" ? "border-rose-600" : "border-gray-300"
                        }`}>
                          {paymentMethod === "cod" && <div className="w-3 h-3 rounded-full bg-rose-600" />}
                        </div>
                        <Package className="h-5 w-5 text-gray-700" />
                        <span className="font-medium text-gray-900">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Details Form */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardNumber}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                          maxLength={19}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cardName}
                          onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.expiryDate}
                            onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardInfo.cvv}
                            onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                            placeholder="123"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        UPI ID *
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                  <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <p className="text-sm text-gray-600 mb-2">Order Number</p>
                    <p className="text-2xl font-bold text-gray-900">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => window.location.href = "/orders"}
                      className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700"
                    >
                      View Orders
                    </button>
                    <button
                      onClick={() => window.location.href = "/"}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handlePreviousStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                      currentStep === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 flex items-center gap-2"
                  >
                    {currentStep === 3 ? "Place Order" : "Continue"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cartData.totalItems} items)</span>
                  <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-medium">Discount ({appliedDiscount?.code})</span>
                    <span className="font-medium">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${calculateShipping() === 0 ? "text-green-600" : ""}`}>
                    {calculateShipping() === 0 ? "FREE" : `₹${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST 18%)</span>
                  <span className="font-medium">₹{calculateTax().toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-rose-600">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {calculateShipping() > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    Add ₹{(1000 - calculateSubtotal()).toFixed(0)} more for FREE shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Offer Popup Modal */}
        {showOfferPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
                <div className="flex-1 min-w-0 pr-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Available Offers</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Choose from vendor-specific coupons</p>
                </div>
                <button
                  onClick={() => setShowOfferPopup(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-6 overflow-y-auto flex-1">
                {loadingOffers ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-rose-600"></div>
                  </div>
                ) : offers.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Tag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No offers available</h3>
                    <p className="text-sm sm:text-base text-gray-600">Check back later for new deals from your vendors</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {offers.map((offer) => (
                      <div
                        key={offer._id}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-rose-300 hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          {/* Offer Image */}
                          {offer.image?.url && (
                            <img
                              src={offer.image.url}
                              alt={offer.name}
                              className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg flex-shrink-0"
                            />
                          )}

                          {/* Offer Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-base sm:text-lg">{offer.name}</h3>
                                {offer.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{offer.description}</p>
                                )}
                              </div>
                              <div className="bg-rose-100 text-rose-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap self-start">
                                {offer.type === "percentage"
                                  ? `${offer.value}% OFF`
                                  : offer.type === "fixed"
                                  ? `₹${offer.value} OFF`
                                  : "FREE SHIPPING"}
                              </div>
                            </div>

                            {/* Offer Conditions */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-3 text-xs text-gray-600">
                              {offer.minOrderAmount && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Min Order:</span> ₹{offer.minOrderAmount}
                                </span>
                              )}
                              {offer.maxDiscount && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Max Discount:</span> ₹{offer.maxDiscount}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <span className="font-medium">Valid till:</span>{" "}
                                {new Date(offer.endDate).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Coupon Code and Actions */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                              <div className="flex-1 flex items-center gap-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg px-3 sm:px-4 py-2 min-w-0">
                                <Tag className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                <span className="font-mono font-bold text-gray-900 text-sm sm:text-base truncate">{offer.code}</span>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCopyCode(offer.code)}
                                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                  {copiedCode === offer.code ? (
                                    <>
                                      <Check className="h-4 w-4" />
                                      <span className="hidden sm:inline">Copied</span>
                                      <span className="sm:hidden">✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleApplyCoupon(offer)}
                                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors text-sm"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
