import { useState } from "react";
import { Search, Filter, Eye, Download, MoreHorizontal } from "lucide-react";

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState("all");

  const orders = [
    { 
      id: "#12345", 
      customer: "John Doe", 
      email: "john@example.com",
      product: "Wireless Headphones", 
      quantity: 2,
      amount: "$89.99", 
      status: "Completed", 
      date: "2024-11-06",
      address: "123 Main St, New York, NY"
    },
    { 
      id: "#12346", 
      customer: "Jane Smith", 
      email: "jane@example.com",
      product: "Smart Watch", 
      quantity: 1,
      amount: "$199.99", 
      status: "Processing", 
      date: "2024-11-06",
      address: "456 Oak Ave, Los Angeles, CA"
    },
    { 
      id: "#12347", 
      customer: "Bob Johnson", 
      email: "bob@example.com",
      product: "Bluetooth Speaker", 
      quantity: 1,
      amount: "$45.99", 
      status: "Shipped", 
      date: "2024-11-05",
      address: "789 Pine Rd, Chicago, IL"
    },
    { 
      id: "#12348", 
      customer: "Alice Brown", 
      email: "alice@example.com",
      product: "Phone Case", 
      quantity: 3,
      amount: "$15.99", 
      status: "Pending", 
      date: "2024-11-05",
      address: "321 Elm St, Houston, TX"
    },
    { 
      id: "#12349", 
      customer: "Mike Wilson", 
      email: "mike@example.com",
      product: "Laptop Stand", 
      quantity: 1,
      amount: "$79.99", 
      status: "Cancelled", 
      date: "2024-11-04",
      address: "654 Maple Dr, Phoenix, AZ"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filterStatus);

  const orderStats = [
    { label: "Total Orders", value: orders.length, color: "bg-blue-500" },
    { label: "Pending", value: orders.filter(o => o.status === "Pending").length, color: "bg-yellow-500" },
    { label: "Processing", value: orders.filter(o => o.status === "Processing").length, color: "bg-blue-500" },
    { label: "Completed", value: orders.filter(o => o.status === "Completed").length, color: "bg-green-500" },
  ];

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
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
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
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{order.id}</h3>
                <p className="text-xs text-gray-500 mt-1">{order.date}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                <p className="text-xs text-gray-500">{order.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-900">{order.product}</p>
                <p className="text-xs text-gray-500">Qty: {order.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 truncate">{order.address}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">{order.amount}</span>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Eye className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreHorizontal className="h-4 w-4" />
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
