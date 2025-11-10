import { useState, useEffect } from "react";
import { Search, Filter, Eye, Download, MoreHorizontal } from "lucide-react";

interface VendorOrder {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  items: Array<{
    productName: string;
    productImage: string;
    brand: string;
    quantity: number;
    price: number;
    vendor: {
      _id: string;
      businessName: string;
    };
  }>;
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface OrdersPageProps {
  onNavigateToOrderDetail?: (orderId: string) => void;
}

export default function OrdersPage({ onNavigateToOrderDetail }: OrdersPageProps = {}) {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [vendorId, setVendorId] = useState<string | null>(null);

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const fetchVendorOrders = async () => {
    const vendorData = localStorage.getItem("vendorData");
    if (!vendorData) {
      console.log("No vendor data found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const vendor = JSON.parse(vendorData);
      const storedVendorId = vendor._id;
      setVendorId(storedVendorId);

      console.log("Fetching orders for vendor:", storedVendorId);

      // Fetch orders filtered by vendor ID from API
      const response = await fetch(`/api/routes/orders?vendor=${storedVendorId}&limit=100`);
      const data = await response.json();

      console.log("Orders API response:", data);

      if (data.success) {
        // Map orders to match component interface
        const vendorOrders = data.data.orders.map((order: any) => {
          // Filter items for this vendor only
          const vendorItems = order.items.filter((item: any) => {
            const itemVendorId = item.vendor?._id || item.vendor;
            return itemVendorId && itemVendorId.toString() === storedVendorId.toString();
          });

          // Calculate total for vendor items only
          const vendorTotal = vendorItems.reduce(
            (sum: number, item: any) => sum + (item.price * item.quantity), 
            0
          );

          return {
            _id: order._id,
            orderNumber: order.orderNumber,
            customer: {
              name: order.customer?.name || order.shippingAddress?.fullName || 'Customer',
              email: order.customer?.email || 'N/A'
            },
            items: vendorItems,
            total: vendorTotal,
            status: order.status,
            createdAt: order.createdAt,
            shippingAddress: order.shippingAddress
          };
        });

        console.log(`Found ${vendorOrders.length} orders for vendor`);
        setOrders(vendorOrders);
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching vendor orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "delivered": return "bg-green-100 text-green-800";
      case "confirmed":
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "refunded": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filterStatus);

  const orderStats = [
    { label: "Total Orders", value: orders.length, color: "bg-blue-500" },
    { label: "Pending", value: orders.filter(o => o.status.toLowerCase() === "pending").length, color: "bg-yellow-500" },
    { label: "Processing", value: orders.filter(o => o.status.toLowerCase() === "processing").length, color: "bg-blue-500" },
    { label: "Delivered", value: orders.filter(o => o.status.toLowerCase() === "delivered").length, color: "bg-green-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {orderStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
          <button className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="bg-orange-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Orders Display */}
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{order.orderNumber}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              {/* Customer Info */}
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                <p className="text-xs text-gray-500">{order.customer.email}</p>
              </div>

              {/* Products */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Products ({order.items.length})</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                        <img 
                          src={item.productImage || '/placeholder-product.png'} 
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.png';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Shipping To</p>
                <p className="text-sm text-gray-900">
                  {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
              </div>

              {/* Total and Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-orange-600">₹{order.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onNavigateToOrderDetail?.(order._id)}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Products</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-orange-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{order.orderNumber}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2 max-w-sm">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <img 
                              src={item.productImage || '/placeholder-product.png'} 
                              alt={item.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-product.png';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                            <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">₹{order.total.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onNavigateToOrderDetail?.(order._id)}
                        className="p-2 hover:bg-orange-100 rounded-lg transition-colors group"
                        title="View Order Details"
                      >
                        <Eye className="h-4 w-4 text-gray-500 group-hover:text-orange-600" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="More Options"
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">No orders match the selected filter criteria.</p>
        </div>
      )}
    </div>
  );
}
