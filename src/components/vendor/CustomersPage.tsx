import { useState } from "react";
import { Search, Filter, Mail, Phone, MoreHorizontal, UserPlus } from "lucide-react";

export default function CustomersPage() {
  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      orders: 12,
      totalSpent: "$1,234.56",
      lastOrder: "2024-11-06",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 234-5678",
      orders: 8,
      totalSpent: "$892.34",
      lastOrder: "2024-11-05",
      status: "Active",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 (555) 345-6789",
      orders: 15,
      totalSpent: "$2,156.78",
      lastOrder: "2024-11-04",
      status: "VIP",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+1 (555) 456-7890",
      orders: 3,
      totalSpent: "$234.12",
      lastOrder: "2024-10-28",
      status: "Inactive",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const customerStats = [
    { label: "Total Customers", value: customers.length, color: "bg-blue-500" },
    { label: "Active", value: customers.filter(c => c.status === "Active").length, color: "bg-green-500" },
    { label: "VIP", value: customers.filter(c => c.status === "VIP").length, color: "bg-purple-500" },
    { label: "Inactive", value: customers.filter(c => c.status === "Inactive").length, color: "bg-gray-500" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {customerStats.map((stat, index) => (
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
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>VIP</option>
            <option>Inactive</option>
          </select>
          <button className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="bg-orange-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 text-sm">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Customers Display */}
      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start gap-4">
              <img 
                className="h-12 w-12 rounded-full object-cover flex-shrink-0" 
                src={customer.avatar} 
                alt={customer.name} 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{customer.name}</h3>
                    <p className="text-xs text-gray-500">{customer.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                </div>
                
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-gray-500">{customer.phone}</p>
                  <p className="text-xs text-gray-500">Orders: {customer.orders}</p>
                  <p className="text-xs text-gray-500">Last order: {customer.lastOrder}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{customer.totalSpent}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Last Order</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={customer.avatar} 
                        alt={customer.name} 
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">ID: {customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-xs text-gray-500">{customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.totalSpent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Mail className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Phone className="h-4 w-4" />
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
    </div>
  );
}
