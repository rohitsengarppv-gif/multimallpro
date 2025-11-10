import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Star, Edit, User, Loader2 } from "lucide-react";

interface CustomerDetailPageProps {
  customerId: string;
  onBack?: () => void;
}

interface CustomerData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
  firstOrder: string;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    createdAt: string;
    status: string;
    total: number;
    itemCount: number;
  }>;
  addresses: Array<{
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  }>;
}

export default function CustomerDetailPage({ customerId, onBack }: CustomerDetailPageProps) {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const vendorData = localStorage.getItem('vendorData');
      if (!vendorData) {
        setError('Vendor data not found');
        return;
      }

      const vendor = JSON.parse(vendorData);
      const vendorId = vendor._id;

      console.log('Fetching customer details for:', customerId);

      // Fetch all orders for this vendor
      const response = await fetch(`/api/routes/orders?vendor=${vendorId}&limit=1000`);
      const data = await response.json();

      if (data.success) {
        // Filter orders for this specific customer
        const customerOrders = data.data.orders.filter((order: any) => {
          const orderCustomerId = order.customer?._id || order.customer;
          return orderCustomerId && orderCustomerId.toString() === customerId.toString();
        });

        if (customerOrders.length === 0) {
          setError('Customer not found');
          return;
        }

        // Extract customer info from first order
        const firstOrder = customerOrders[0];
        const customerName = firstOrder.customer?.name || firstOrder.shippingAddress?.fullName || 'Unknown';
        const customerEmail = firstOrder.customer?.email || 'N/A';
        const customerPhone = firstOrder.customer?.phone || firstOrder.shippingAddress?.phone;

        // Calculate stats
        let totalSpent = 0;
        const recentOrders: any[] = [];
        const addressesMap = new Map();

        customerOrders.forEach((order: any) => {
          // Calculate vendor-specific total
          const vendorOrderTotal = order.items
            .filter((item: any) => {
              const itemVendorId = item.vendor?._id || item.vendor;
              return itemVendorId && itemVendorId.toString() === vendorId.toString();
            })
            .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

          totalSpent += vendorOrderTotal;

          // Add to recent orders
          const vendorItemCount = order.items.filter((item: any) => {
            const itemVendorId = item.vendor?._id || item.vendor;
            return itemVendorId && itemVendorId.toString() === vendorId.toString();
          }).length;

          recentOrders.push({
            _id: order._id,
            orderNumber: order.orderNumber,
            createdAt: order.createdAt,
            status: order.status,
            total: vendorOrderTotal,
            itemCount: vendorItemCount,
          });

          // Collect unique addresses
          const addrKey = `${order.shippingAddress.addressLine1}-${order.shippingAddress.city}`;
          if (!addressesMap.has(addrKey)) {
            addressesMap.set(addrKey, order.shippingAddress);
          }
        });

        // Sort orders by date (most recent first)
        recentOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setCustomer({
          _id: customerId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          orders: customerOrders.length,
          totalSpent,
          lastOrder: customerOrders[0].createdAt,
          firstOrder: customerOrders[customerOrders.length - 1].createdAt,
          recentOrders: recentOrders.slice(0, 10), // Show last 10 orders
          addresses: Array.from(addressesMap.values()),
        });
      } else {
        setError(data.message || 'Failed to fetch customer details');
      }
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const getCustomerStatus = () => {
    if (!customer) return 'Active';
    const daysSinceLastOrder = Math.floor(
      (new Date().getTime() - new Date(customer.lastOrder).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (customer.totalSpent >= 10000) return 'VIP';
    if (daysSinceLastOrder > 60) return 'Inactive';
    return 'Active';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Customer</h3>
        <p className="text-gray-500 mb-4">{error || 'Customer not found'}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Customer Details</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer information and order history</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg text-white text-center">
              <div className="text-3xl font-bold">{customer.orders}</div>
              <div className="text-sm opacity-90">Total Orders</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg text-white text-center">
              <div className="text-2xl font-bold">₹{customer.totalSpent.toFixed(2)}</div>
              <div className="text-sm opacity-90">Total Spent</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg text-white text-center">
              <div className="text-2xl font-bold">₹{(customer.totalSpent / customer.orders).toFixed(2)}</div>
              <div className="text-sm opacity-90">Avg Order</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-lg text-white text-center">
              <div className="text-sm font-bold">{new Date(customer.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
              <div className="text-sm opacity-90">Last Order</div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
            
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {customer.recentOrders.map((order) => (
                <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{order.orderNumber}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                      <p className="text-sm text-gray-600">{order.itemCount} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customer.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{order.itemCount}</td>
                      <td className="px-4 py-4 text-sm font-medium text-orange-600">₹{order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Addresses</h3>
            <div className="space-y-4">
              {customer.addresses.map((address, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{address.fullName}</h4>
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Primary</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                      <p className="mt-1 text-gray-500">📞 {address.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Customer Profile */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <div className="text-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getStatusColor(getCustomerStatus())}`}>
                {getCustomerStatus()} Customer
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{customer.phone}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{customer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">First Order: {new Date(customer.firstOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Last Order: {new Date(customer.lastOrder).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 shadow-lg border border-purple-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Loyalty Level</span>
                <span className="text-sm font-bold text-purple-600">{getCustomerStatus()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Total Orders</span>
                <span className="text-sm font-bold text-gray-900">{customer.orders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Lifetime Value</span>
                <span className="text-sm font-bold text-green-600">₹{customer.totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Avg Order Value</span>
                <span className="text-sm font-bold text-blue-600">₹{(customer.totalSpent / customer.orders).toFixed(2)}</span>
              </div>
            </div>
          </div>

    
        </div>
      </div>
    </div>
  );
}
