"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import CancellationModal from "../../../components/CancellationModal";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  MessageCircle,
  Star,
  RefreshCw,
  AlertCircle,
  Calendar,
  User,
  X
} from "lucide-react";
import Link from "next/link";

type OrderStatus = "processing" | "confirmed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
  variant?: string;
};

type OrderDetails = {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  couponCode?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
  };
  timeline: {
    status: OrderStatus;
    date: string;
    description: string;
    completed: boolean;
  }[];
};

// Mock data - in real app, this would come from API
const getOrderDetails = (id: string): OrderDetails => ({
  id,
  orderNumber: "ORD-2024-001234",
  date: "Nov 1, 2024",
  status: "shipped",
  total: 389.98,
  subtotal: 359.97,
  shipping: 9.99,
  tax: 28.80,
  discount: 8.78,
  couponCode: "SAVE10",
  trackingNumber: "TRK123456789",
  estimatedDelivery: "Nov 8, 2024",
  items: [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones Pro",
      price: 89.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      brand: "TechSound",
      variant: "Black"
    },
    {
      id: "2",
      name: "Modern Office Chair",
      price: 199.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop",
      brand: "ComfortPlus",
      variant: "Gray"
    },
    {
      id: "3",
      name: "Designer Table Lamp",
      price: 69.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
      brand: "LightCraft",
      variant: "Gold"
    }
  ],
  shippingAddress: {
    name: "John Doe",
    address: "123 Main Street, Apt 4B",
    city: "New York, NY",
    zipCode: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567"
  },
  billingAddress: {
    name: "John Doe",
    address: "123 Main Street, Apt 4B",
    city: "New York, NY",
    zipCode: "10001",
    country: "United States"
  },
  paymentMethod: {
    type: "Credit Card",
    last4: "4242",
    brand: "Visa"
  },
  timeline: [
    {
      status: "processing",
      date: "Nov 1, 2024 - 2:30 PM",
      description: "Order placed and payment confirmed",
      completed: true
    },
    {
      status: "confirmed",
      date: "Nov 1, 2024 - 4:15 PM",
      description: "Order confirmed and being prepared",
      completed: true
    },
    {
      status: "shipped",
      date: "Nov 2, 2024 - 10:00 AM",
      description: "Package shipped from warehouse",
      completed: true
    },
    {
      status: "out_for_delivery",
      date: "Nov 8, 2024 - Estimated",
      description: "Out for delivery",
      completed: false
    },
    {
      status: "delivered",
      date: "Nov 8, 2024 - Estimated",
      description: "Package delivered",
      completed: false
    }
  ]
});

const statusConfig = {
  processing: { label: "Processing", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Package },
  out_for_delivery: { label: "Out for Delivery", color: "bg-orange-100 text-orange-800", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: AlertCircle }
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = getOrderDetails(orderId);
  const [activeTab, setActiveTab] = useState<"details" | "tracking" | "invoice">("details");
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.status);

  const handleCancelOrder = (reason: string, details: string) => {
    setOrderStatus("cancelled");
    // Here you would typically make an API call to cancel the order
    console.log("Order cancelled:", { reason, details });
  };

  const canCancelOrder = orderStatus === "processing" || orderStatus === "confirmed";
  const StatusIcon = statusConfig[orderStatus].icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/orders"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order {order.orderNumber}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Placed on {order.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4" />
                    <span>Tracking: {order.trackingNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${statusConfig[orderStatus].color}`}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig[orderStatus].label}
              </span>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Amount</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: "details", label: "Order Details", icon: Package, shortLabel: "Details" },
                { id: "tracking", label: "Tracking", icon: Truck, shortLabel: "Tracking" },
                { id: "invoice", label: "Invoice", icon: Download, shortLabel: "Invoice" }
              ].map(({ id, label, icon: Icon, shortLabel }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === id
                      ? "border-rose-600 text-rose-600 bg-rose-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{shortLabel}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "details" && (
              <div className="space-y-8">
                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                            <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                          <p className="text-gray-600">{order.shippingAddress.address}</p>
                          <p className="text-gray-600">
                            {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                          </p>
                          <p className="text-gray-600">{order.shippingAddress.country}</p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{order.shippingAddress.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">${order.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${order.tax.toFixed(2)}</span>
                      </div>
                      {order.discount && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount ({order.couponCode})</span>
                          <span className="font-medium">-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-rose-600">${order.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                        <p className="font-medium">{order.paymentMethod.type}</p>
                        {order.paymentMethod.last4 && (
                          <p className="text-sm text-gray-600">
                            {order.paymentMethod.brand} ending in {order.paymentMethod.last4}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tracking" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
                <div className="space-y-6">
                  {order.timeline.map((event, index) => {
                    const EventIcon = statusConfig[event.status].icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          event.completed 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <EventIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className={`font-semibold ${
                              event.completed ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {statusConfig[event.status].label}
                            </h4>
                            <span className={`text-sm ${
                              event.completed ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {event.date}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            event.completed ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {event.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {order.estimatedDelivery && order.status !== "delivered" && (
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Estimated Delivery</h4>
                    </div>
                    <p className="text-blue-800">{order.estimatedDelivery}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "invoice" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice</h3>
                  <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                      <p className="text-gray-600">Invoice #{order.orderNumber}</p>
                      <p className="text-gray-600">Date: {order.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-600 to-pink-600 grid place-items-center text-white font-black text-lg">
                          e
                        </div>
                        <span className="text-xl font-black tracking-tight">market</span>
                      </div>
                      <p className="text-sm text-gray-600">Your Shopping Destination</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Bill To:</h4>
                      <div className="text-gray-600">
                        <p>{order.billingAddress.name}</p>
                        <p>{order.billingAddress.address}</p>
                        <p>{order.billingAddress.city}, {order.billingAddress.zipCode}</p>
                        <p>{order.billingAddress.country}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ship To:</h4>
                      <div className="text-gray-600">
                        <p>{order.shippingAddress.name}</p>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto mb-8">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 font-semibold text-gray-900">Item</th>
                          <th className="text-center py-3 font-semibold text-gray-900">Qty</th>
                          <th className="text-right py-3 font-semibold text-gray-900">Price</th>
                          <th className="text-right py-3 font-semibold text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id} className="border-b border-gray-100">
                            <td className="py-3">
                              <div>
                                <p className="font-medium text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">{item.brand}</p>
                                {item.variant && (
                                  <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                                )}
                              </div>
                            </td>
                            <td className="py-3 text-center">{item.quantity}</td>
                            <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                            <td className="py-3 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping:</span>
                        <span>${order.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax:</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      {order.discount && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Reorder Items
          </button>
          <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="h-4 w-4" />
            Contact Support
          </button>
          {orderStatus === "delivered" && (
            <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Star className="h-4 w-4" />
              Write Review
            </button>
          )}
          {canCancelOrder && (
            <button 
              onClick={() => setShowCancellationModal(true)}
              className="flex items-center gap-2 border border-red-300 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        onConfirm={handleCancelOrder}
        orderNumber={order.orderNumber}
      />

      <Footer />
    </div>
  );
}
