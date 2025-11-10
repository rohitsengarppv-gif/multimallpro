"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Download,
  Star,
  MessageCircle,
  RefreshCw,
  MapPin,
  Calendar,
  ExternalLink,
  XCircle
} from "lucide-react";
import Link from "next/link";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
};

type Order = {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: {
    productName: string;
    productImage: string;
    brand: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  paymentMethod: string;
};

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-gray-100 text-gray-800",
    icon: Clock,
    description: "Order is being confirmed"
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    description: "Order confirmed"
  },
  processing: {
    label: "Processing",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    description: "Your order is being prepared"
  },
  shipped: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-800",
    icon: Truck,
    description: "Your order is on the way"
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    description: "Your order has been delivered"
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    description: "Your order has been cancelled"
  },
  refunded: {
    label: "Refunded",
    color: "bg-orange-100 text-orange-800",
    icon: RefreshCw,
    description: "Your order has been refunded"
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const user = JSON.parse(userData);
      const response = await fetch(`/api/orders?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (orderId: string, orderNumber: string) => {
    // Create a simple invoice download
    const invoiceData = orders.find(o => o._id === orderId);
    if (!invoiceData) return;

    const invoiceContent = `
INVOICE
Order Number: ${orderNumber}
Date: ${new Date(invoiceData.createdAt).toLocaleDateString()}

Items:
${invoiceData.items.map(item => `${item.productName} x${item.quantity} - ₹${item.price}`).join('\n')}

Total: ₹${invoiceData.total}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status: OrderStatus) => {
    const IconComponent = statusConfig[status].icon;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </div>

        {/* Order Stats - Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`p-4 sm:p-6 rounded-xl border-2 transition-all shadow-sm hover:shadow-md ${
              selectedStatus === "all" 
                ? "border-rose-500 bg-rose-50 shadow-rose-100" 
                : "border-gray-200 bg-white hover:border-rose-200"
            }`}
          >
            <div className="text-center">
              <div className={`inline-flex p-3 rounded-full mb-3 ${selectedStatus === "all" ? "bg-rose-100" : "bg-gray-100"}`}>
                <Package className={`h-6 w-6 ${selectedStatus === "all" ? "text-rose-600" : "text-gray-600"}`} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Orders</p>
            </div>
          </button>

          {(["pending", "delivered", "cancelled"] as OrderStatus[]).map((status) => {
            const count = orders.filter(order => order.status === status).length;
            const config = statusConfig[status];
            const IconComponent = config.icon;
            
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all shadow-sm hover:shadow-md ${
                  selectedStatus === status 
                    ? "border-rose-500 bg-rose-50 shadow-rose-100" 
                    : "border-gray-200 bg-white hover:border-rose-200"
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-full mb-3 ${
                    selectedStatus === status 
                      ? "bg-rose-100" 
                      : status === "pending" 
                        ? "bg-yellow-100" 
                        : status === "delivered" 
                          ? "bg-green-100" 
                          : "bg-red-100"
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      selectedStatus === status 
                        ? "text-rose-600" 
                        : status === "pending" 
                          ? "text-yellow-600" 
                          : status === "delivered" 
                            ? "text-green-600" 
                            : "text-red-600"
                    }`} />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 mt-1">{config.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <Package className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatus === "all" 
                ? "You haven't placed any orders yet" 
                : `No ${selectedStatus} orders found`}
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const isExpanded = expandedOrder === order._id;
              const statusInfo = statusConfig[order.status];
              
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col gap-4">
                      {/* Order Info & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{order.orderNumber}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${statusInfo.color}`}>
                              {getStatusIcon(order.status)}
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-gray-900">₹{order.total.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/orders/${order._id}`}
                              className="px-3 sm:px-4 py-2 bg-rose-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-rose-700 transition-colors flex items-center gap-2"
                            >
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="hidden sm:inline">View Details</span>
                              <span className="sm:hidden">Details</span>
                            </Link>
                            
                            
                          </div>
                        </div>
                      </div>

                      {/* Product Images Preview */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 font-medium">Items:</span>
                        {order.items.length <= 4 ? (
                          // Show all items without carousel if 4 or less
                          <div className="flex items-center gap-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex-shrink-0 relative">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-gray-200"
                                />
                                {item.quantity > 1 && (
                                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {item.quantity}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Show carousel with first 4 items + count badge if more than 4
                          <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            {order.items.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="flex-shrink-0 relative">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-gray-200"
                                />
                                {item.quantity > 1 && (
                                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {item.quantity}
                                  </span>
                                )}
                              </div>
                            ))}
                            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">+{order.items.length - 4}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="p-6 bg-gray-50">
                      <div className="grid lg:grid-cols-2 gap-8">
                        {/* Order Items */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-lg">
                                <img
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.productName}</h5>
                                  <p className="text-sm text-gray-600">{item.brand}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                    <span className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Info */}
                        <div className="space-y-6">
                          {/* Status & Tracking */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Order Status</h4>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-full ${statusInfo.color}`}>
                                  {getStatusIcon(order.status)}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{statusInfo.label}</p>
                                  <p className="text-sm text-gray-600">{statusInfo.description}</p>
                                </div>
                              </div>
                              
                              {order.trackingNumber && (
                                <div className="pt-3 border-t border-gray-100">
                                  <p className="text-sm text-gray-600">Tracking Number</p>
                                  <p className="font-mono text-sm font-medium text-gray-900">{order.trackingNumber}</p>
                                </div>
                              )}
                              
                              {order.estimatedDelivery && order.status !== "delivered" && (
                                <div className="pt-3 border-t border-gray-100">
                                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                                  <p className="font-medium text-gray-900">{order.estimatedDelivery}</p>
                                </div>
                              )}
                              
                              {order.status === "delivered" && order.estimatedDelivery && (
                                <div className="pt-3 border-t border-gray-100">
                                  <p className="text-sm text-gray-600">Delivered On</p>
                                  <p className="font-medium text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">Shipping Address</h4>
                            <div className="bg-white p-4 rounded-lg">
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                <div>
                                  <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress.addressLine1}</p>
                                  <p className="text-sm text-gray-600">
                                    {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                                  </p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <Link
                              href={`/orders/${order._id}`}
                              className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Details
                            </Link>
                            
                            {order.status === "delivered" && (
                              <>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                  <Star className="h-4 w-4" />
                                  Rate & Review
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                  <RefreshCw className="h-4 w-4" />
                                  Reorder
                                </button>
                              </>
                            )}
                            
                            <button 
                              onClick={() => handleDownloadInvoice(order._id, order.orderNumber)}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Download className="h-4 w-4" />
                              Download Invoice
                            </button>
                            
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              Contact Support
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
