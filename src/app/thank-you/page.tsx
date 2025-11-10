"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Package, MapPin, CreditCard, Calendar, Truck, ChevronRight, Home } from "lucide-react";

interface OrderItem {
  productName: string;
  productImage: string;
  brand: string;
  quantity: number;
  price: number;
  total: number;
  variant?: Record<string, string>;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  discountCode?: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  estimatedDelivery?: string;
  createdAt: string;
}

function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-xs sm:text-sm text-gray-600">Order Number:</span>
            <span className="text-base sm:text-lg font-bold text-gray-900">{order.orderNumber}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Order Date */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Order Date</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Estimated Delivery */}
            {order.estimatedDelivery && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Payment Status</p>
                <p className="font-semibold text-gray-900 capitalize text-sm sm:text-base">{order.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Delivery Address</p>
                <p className="font-semibold text-gray-900 text-sm sm:text-base">{order.shippingAddress.fullName}</p>
                <p className="text-xs sm:text-sm text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Items ({order.items.length})</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-3 sm:gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{item.productName}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">{item.brand}</p>
                  {item.variant && Object.keys(item.variant).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {Object.entries(item.variant).map(([key, value]) => (
                        <span key={key} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs sm:text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">₹{item.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">Subtotal ({order.items.length} items)</span>
              <span className="font-medium text-gray-900">₹{order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">
                  Discount {order.discountCode && `(${order.discountCode})`}
                </span>
                <span className="font-medium text-green-600">-₹{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                {order.shipping === 0 ? "FREE" : `₹${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base">
              <span className="text-gray-600">Tax (GST 18%)</span>
              <span className="font-medium text-gray-900">₹{order.tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg sm:text-xl font-bold text-rose-600">₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => window.location.href = "/"}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <Home className="h-5 w-5" />
            Continue Shopping
          </button>
          <button
            onClick={() => window.location.href = "/orders"}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
          >
            <Package className="h-5 w-5" />
            View All Orders
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ThankYouPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    }>
      <ThankYouPage />
    </Suspense>
  );
}

export default ThankYouPageWrapper;
