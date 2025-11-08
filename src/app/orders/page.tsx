"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye,
  Download,
  Star,
  MessageCircle,
  RefreshCw,
  MapPin,
  Calendar,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
};

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredDate?: string;
};

const orders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001234",
    date: "Nov 1, 2024",
    status: "delivered",
    total: 389.98,
    trackingNumber: "TRK123456789",
    deliveredDate: "Nov 5, 2024",
    items: [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        brand: "TechSound"
      },
      {
        id: "2",
        name: "Modern Office Chair",
        price: 299.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop",
        brand: "ComfortPlus"
      }
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      zipCode: "10001",
      country: "United States"
    }
  },
  {
    id: "2",
    orderNumber: "ORD-2024-001235",
    date: "Oct 28, 2024",
    status: "shipped",
    total: 265.49,
    trackingNumber: "TRK987654321",
    estimatedDelivery: "Nov 8, 2024",
    items: [
      {
        id: "3",
        name: "Designer Table Lamp",
        price: 65.50,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
        brand: "LightCraft"
      },
      {
        id: "4",
        name: "Premium Coffee Maker",
        price: 199.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
        brand: "BrewMaster"
      }
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      zipCode: "10001",
      country: "United States"
    }
  },
  {
    id: "3",
    orderNumber: "ORD-2024-001236",
    date: "Oct 25, 2024",
    status: "processing",
    total: 249.00,
    estimatedDelivery: "Nov 10, 2024",
    items: [
      {
        id: "5",
        name: "Smart Fitness Watch",
        price: 249.00,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        brand: "FitTech"
      }
    ],
    shippingAddress: {
      name: "John Doe",
      address: "123 Main Street, Apt 4B",
      city: "New York",
      zipCode: "10001",
      country: "United States"
    }
  }
];

const statusConfig = {
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
    icon: RefreshCw,
    description: "Your order has been cancelled"
  }
};

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

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
        <div className="hidden lg:grid grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedStatus === "all" 
                ? "border-rose-500 bg-rose-50" 
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
          </button>

          {Object.entries(statusConfig).map(([status, config]) => {
            const count = orders.filter(order => order.status === status).length;
            const IconComponent = config.icon;
            
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as OrderStatus)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedStatus === status 
                    ? "border-rose-500 bg-rose-50" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <IconComponent className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600">{config.label}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Order Stats - Mobile Carousel */}
        <div className="lg:hidden mb-8">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max px-4">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all w-32 ${
                  selectedStatus === "all" 
                    ? "border-rose-500 bg-rose-50" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-center">
                  <Package className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-xs text-gray-600">Total Orders</p>
                </div>
              </button>

              {Object.entries(statusConfig).map(([status, config]) => {
                const count = orders.filter(order => order.status === status).length;
                const IconComponent = config.icon;
                
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status as OrderStatus)}
                    className={`flex-shrink-0 p-4 rounded-xl border-2 transition-all w-32 ${
                      selectedStatus === status 
                        ? "border-rose-500 bg-rose-50" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="text-center">
                      <IconComponent className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <p className="text-xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-600">{config.label}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
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
              const isExpanded = expandedOrder === order.id;
              const statusInfo = statusConfig[order.status];
              
              return (
                <div
                  key={order.id}
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
                              {order.date}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${statusInfo.color}`}>
                              {getStatusIcon(order.status)}
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-gray-900">${order.total.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/orders/${order.id}`}
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
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {order.items.map((item, idx) => (
                            <div key={item.id} className="flex-shrink-0 relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-gray-200"
                              />
                              {item.quantity > 1 && (
                                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                  {item.quantity}
                                </span>
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">+{order.items.length - 4}</span>
                            </div>
                          )}
                        </div>
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
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{item.name}</h5>
                                  <p className="text-sm text-gray-600">{item.brand}</p>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                    <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
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
                              
                              {order.deliveredDate && (
                                <div className="pt-3 border-t border-gray-100">
                                  <p className="text-sm text-gray-600">Delivered On</p>
                                  <p className="font-medium text-gray-900">{order.deliveredDate}</p>
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
                                  <p className="font-medium text-gray-900">{order.shippingAddress.name}</p>
                                  <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
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
                              href={`/orders/${order.id}`}
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
                            
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
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
