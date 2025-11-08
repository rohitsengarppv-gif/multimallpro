import { DollarSign, ShoppingCart, Package, Eye, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Total Sales", value: "$12,345", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
    { label: "Orders", value: "156", change: "+8.2%", icon: ShoppingCart, color: "text-blue-600" },
    { label: "Products", value: "24", change: "+2", icon: Package, color: "text-purple-600" },
    { label: "Views", value: "2,847", change: "+15.3%", icon: Eye, color: "text-orange-600" },
  ];

  const recentOrders = [
    { id: "#12345", customer: "John Doe", product: "Wireless Headphones", amount: "$89.99", status: "Completed", date: "2024-11-06" },
    { id: "#12346", customer: "Jane Smith", product: "Smart Watch", amount: "$199.99", status: "Processing", date: "2024-11-06" },
    { id: "#12347", customer: "Bob Johnson", product: "Bluetooth Speaker", amount: "$45.99", status: "Shipped", date: "2024-11-05" },
    { id: "#12348", customer: "Alice Brown", product: "Phone Case", amount: "$15.99", status: "Pending", date: "2024-11-05" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 md:p-6 text-white">
        <h1 className="text-xl md:text-2xl font-bold mb-2">Welcome back, Jimmy!</h1>
        <p className="opacity-90 text-sm md:text-base">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`p-2 md:p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                  <IconComponent className="h-4 w-4 md:h-6 md:w-6" />
                </div>
                <span className="text-xs md:text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Orders</h2>
        </div>
        
        {/* Mobile Cards View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{order.id}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-1">{order.customer}</div>
                <div className="text-sm text-gray-600 mb-2">{order.product}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{order.amount}</span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <select className="border border-gray-300 rounded-lg px-2 py-1 text-xs">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="h-48 md:h-64 relative">
            {/* Simple Line Chart SVG */}
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Revenue line */}
              <polyline
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                points="20,160 60,140 100,120 140,100 180,80 220,90 260,70 300,50 340,40 380,30"
              />
              
              {/* Data points */}
              {[
                {x: 20, y: 160}, {x: 60, y: 140}, {x: 100, y: 120}, {x: 140, y: 100}, 
                {x: 180, y: 80}, {x: 220, y: 90}, {x: 260, y: 70}, {x: 300, y: 50}, 
                {x: 340, y: 40}, {x: 380, y: 30}
              ].map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r="4" fill="#f97316" />
              ))}
              
              {/* Y-axis labels */}
              <text x="10" y="30" fontSize="10" fill="#6b7280">$50k</text>
              <text x="10" y="70" fontSize="10" fill="#6b7280">$40k</text>
              <text x="10" y="110" fontSize="10" fill="#6b7280">$30k</text>
              <text x="10" y="150" fontSize="10" fill="#6b7280">$20k</text>
              <text x="10" y="190" fontSize="10" fill="#6b7280">$10k</text>
              
              {/* X-axis labels */}
              <text x="60" y="195" fontSize="10" fill="#6b7280">Jan</text>
              <text x="140" y="195" fontSize="10" fill="#6b7280">Mar</text>
              <text x="220" y="195" fontSize="10" fill="#6b7280">May</text>
              <text x="300" y="195" fontSize="10" fill="#6b7280">Jul</text>
              <text x="380" y="195" fontSize="10" fill="#6b7280">Sep</text>
            </svg>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Orders Trend</h3>
            <select className="border border-gray-300 rounded-lg px-2 py-1 text-xs">
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
            </select>
          </div>
          <div className="h-48 md:h-64 relative">
            {/* Simple Line Chart SVG */}
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Orders line */}
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                points="20,150 60,130 100,140 140,110 180,90 220,100 260,80 300,60 340,50 380,40"
              />
              
              {/* Data points */}
              {[
                {x: 20, y: 150}, {x: 60, y: 130}, {x: 100, y: 140}, {x: 140, y: 110}, 
                {x: 180, y: 90}, {x: 220, y: 100}, {x: 260, y: 80}, {x: 300, y: 60}, 
                {x: 340, y: 50}, {x: 380, y: 40}
              ].map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r="4" fill="#3b82f6" />
              ))}
              
              {/* Y-axis labels */}
              <text x="10" y="30" fontSize="10" fill="#6b7280">200</text>
              <text x="10" y="70" fontSize="10" fill="#6b7280">150</text>
              <text x="10" y="110" fontSize="10" fill="#6b7280">100</text>
              <text x="10" y="150" fontSize="10" fill="#6b7280">50</text>
              <text x="10" y="190" fontSize="10" fill="#6b7280">0</text>
              
              {/* X-axis labels */}
              <text x="60" y="195" fontSize="10" fill="#6b7280">Jan</text>
              <text x="140" y="195" fontSize="10" fill="#6b7280">Mar</text>
              <text x="220" y="195" fontSize="10" fill="#6b7280">May</text>
              <text x="300" y="195" fontSize="10" fill="#6b7280">Jul</text>
              <text x="380" y="195" fontSize="10" fill="#6b7280">Sep</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-50">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Add Product</h3>
              <p className="text-sm text-gray-600">Add new products to your store</p>
            </div>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Add Product
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600">Check your store performance</p>
            </div>
          </div>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">
            View Analytics
          </button>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-purple-50">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Orders</h3>
              <p className="text-sm text-gray-600">Process pending orders</p>
            </div>
          </div>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm">
            Manage Orders
          </button>
        </div>
      </div>
    </div>
  );
}
