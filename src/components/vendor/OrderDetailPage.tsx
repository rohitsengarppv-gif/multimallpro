import { ArrowLeft, Package, Truck, CheckCircle, Clock, User, MapPin, Phone, Mail, CreditCard } from "lucide-react";

interface OrderDetailPageProps {
  orderId?: string;
  onBack?: () => void;
}

export default function OrderDetailPage({ orderId = "#12345", onBack }: OrderDetailPageProps) {
  const order = {
    id: orderId,
    status: "Processing",
    date: "2024-11-06",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    shipping: {
      address: "123 Main Street, Apt 4B",
      city: "New York, NY 10001",
      country: "United States",
      method: "Standard Shipping",
      tracking: "1Z999AA1234567890"
    },
    billing: {
      address: "123 Main Street, Apt 4B",
      city: "New York, NY 10001",
      country: "United States",
      method: "Credit Card",
      last4: "4242"
    },
    items: [
      {
        id: 1,
        name: "Wireless Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        price: 89.99,
        quantity: 2,
        total: 179.98
      },
      {
        id: 2,
        name: "Phone Case",
        image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop",
        price: 15.99,
        quantity: 1,
        total: 15.99
      }
    ],
    summary: {
      subtotal: 195.97,
      shipping: 9.99,
      tax: 19.60,
      total: 225.56
    },
    timeline: [
      { status: "Order Placed", date: "Nov 6, 2024 10:30 AM", completed: true },
      { status: "Payment Confirmed", date: "Nov 6, 2024 10:32 AM", completed: true },
      { status: "Processing", date: "Nov 6, 2024 11:00 AM", completed: true, current: true },
      { status: "Shipped", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Delivered": return "bg-green-100 text-green-800";
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
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Order {order.id}</h1>
          <div className="flex items-center gap-4 mt-1">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
            <span className="text-sm text-gray-500">Placed on {order.date}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Order Timeline */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {order.timeline.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.completed ? 'bg-green-500' : item.current ? 'bg-blue-500' : 'bg-gray-300'
                  }`}>
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : item.current ? (
                      <Clock className="h-4 w-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h4 className={`font-medium ${item.completed || item.current ? 'text-gray-900' : 'text-gray-500'}`}>
                        {item.status}
                      </h4>
                      <span className={`text-sm ${item.completed || item.current ? 'text-gray-600' : 'text-gray-400'}`}>
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
            
            {/* Mobile Cards */}
            <div className="block md:hidden space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <img 
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0" 
                    src={item.image} 
                    alt={item.name} 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${item.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <img 
                            className="h-12 w-12 rounded-lg object-cover" 
                            src={item.image} 
                            alt={item.name} 
                          />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-gray-900">{item.quantity}</td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:items-end">
                <div className="w-full sm:w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">${order.summary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-900">${order.summary.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-900">${order.summary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>${order.summary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Customer</h3>
            <div className="flex items-center gap-4 mb-4">
              <img 
                className="h-12 w-12 rounded-full object-cover" 
                src={order.customer.avatar} 
                alt={order.customer.name} 
              />
              <div>
                <h4 className="font-medium text-gray-900">{order.customer.name}</h4>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{order.customer.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}</p>
                  <p>{order.shipping.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Truck className="h-4 w-4 text-gray-400" />
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{order.shipping.method}</p>
                  {order.shipping.tracking && (
                    <p className="text-gray-500">Tracking: {order.shipping.tracking}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Billing</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p>{order.billing.address}</p>
                  <p>{order.billing.city}</p>
                  <p>{order.billing.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{order.billing.method}</p>
                  <p className="text-gray-500">**** **** **** {order.billing.last4}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
