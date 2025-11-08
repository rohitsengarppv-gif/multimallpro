import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, DollarSign, Star, Edit } from "lucide-react";

interface CustomerDetailPageProps {
  customerId?: string;
  onBack?: () => void;
}

export default function CustomerDetailPage({ customerId = "1", onBack }: CustomerDetailPageProps) {
  const customer = {
    id: customerId,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    status: "VIP",
    joinDate: "March 15, 2023",
    location: "New York, NY",
    stats: {
      totalOrders: 24,
      totalSpent: 2156.78,
      averageOrder: 89.87,
      lastOrder: "Nov 2, 2024"
    },
    addresses: [
      {
        id: 1,
        type: "Home",
        address: "123 Main Street, Apt 4B",
        city: "New York, NY 10001",
        country: "United States",
        isDefault: true
      },
      {
        id: 2,
        type: "Work",
        address: "456 Business Ave, Suite 200",
        city: "New York, NY 10002",
        country: "United States",
        isDefault: false
      }
    ],
    recentOrders: [
      {
        id: "#12345",
        date: "Nov 2, 2024",
        status: "Delivered",
        total: 89.99,
        items: 2
      },
      {
        id: "#12344",
        date: "Oct 28, 2024",
        status: "Delivered",
        total: 156.50,
        items: 3
      },
      {
        id: "#12343",
        date: "Oct 15, 2024",
        status: "Delivered",
        total: 234.99,
        items: 1
      },
      {
        id: "#12342",
        date: "Oct 8, 2024",
        status: "Delivered",
        total: 67.25,
        items: 4
      }
    ],
    preferences: {
      newsletter: true,
      smsNotifications: false,
      promotions: true,
      reviews: true
    }
  };

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
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 text-sm">
          <Edit className="h-4 w-4" />
          Edit Customer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Customer Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-900">{customer.stats.totalOrders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-green-600">${customer.stats.totalSpent.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">${customer.stats.averageOrder.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Avg Order</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 text-center">
              <div className="text-sm font-bold text-gray-900">{customer.stats.lastOrder}</div>
              <div className="text-sm text-gray-600">Last Order</div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
            
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {customer.recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{order.date}</p>
                      <p className="text-sm text-gray-600">{order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
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
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{order.date}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{order.items}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
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
              {customer.addresses.map((address) => (
                <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{address.type}</h4>
                      {address.isDefault && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Default</span>
                      )}
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 text-sm">Edit</button>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600">
                      <p>{address.address}</p>
                      <p>{address.city}</p>
                      <p>{address.country}</p>
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
              <img 
                className="h-20 w-20 rounded-full object-cover mx-auto mb-4" 
                src={customer.avatar} 
                alt={customer.name} 
              />
              <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-2 ${getStatusColor(customer.status)}`}>
                {customer.status} Customer
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
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{customer.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Joined {customer.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Customer Preferences */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Preferences</h3>
            <div className="space-y-3">
              {Object.entries(customer.preferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                    value ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      value ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Mail className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Send Email</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <ShoppingBag className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">View All Orders</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Create Invoice</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">Add to VIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
