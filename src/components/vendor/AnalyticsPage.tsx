import { TrendingUp, DollarSign, Users, ShoppingCart, Eye, ArrowUp, ArrowDown } from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    { label: "Revenue", value: "$45,231", change: "+20.1%", trend: "up", icon: DollarSign },
    { label: "Orders", value: "1,234", change: "+15.3%", trend: "up", icon: ShoppingCart },
    { label: "Customers", value: "892", change: "+8.2%", trend: "up", icon: Users },
    { label: "Page Views", value: "12,847", change: "-2.4%", trend: "down", icon: Eye },
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: 234, revenue: "$18,720", trend: "+12%" },
    { name: "Smart Watch", sales: 189, revenue: "$37,611", trend: "+8%" },
    { name: "Bluetooth Speaker", sales: 156, revenue: "$7,176", trend: "+15%" },
    { name: "Phone Case", sales: 143, revenue: "$2,288", trend: "+5%" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 md:p-3 rounded-lg bg-orange-50">
                  <IconComponent className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                </div>
                <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {metric.change}
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{metric.label}</p>
            </div>
          );
        })}
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
          <div className="h-48 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart visualization would go here</p>
            </div>
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
          <div className="h-48 md:h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart visualization would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Top Performing Products</h3>
        </div>
        
        {/* Mobile Cards */}
        <div className="block md:hidden divide-y divide-gray-200">
          {topProducts.map((product, index) => (
            <div key={index} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                <span className="text-xs font-medium text-green-600">{product.trend}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Sales: {product.sales}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{product.revenue}</p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.revenue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{product.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Rate</h3>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">3.2%</div>
            <div className="text-sm text-green-600 flex items-center justify-center gap-1">
              <ArrowUp className="h-3 w-3" />
              +0.5% from last month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Avg. Order Value</h3>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">$67.50</div>
            <div className="text-sm text-green-600 flex items-center justify-center gap-1">
              <ArrowUp className="h-3 w-3" />
              +$5.20 from last month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Return Rate</h3>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-2">2.1%</div>
            <div className="text-sm text-red-600 flex items-center justify-center gap-1">
              <ArrowUp className="h-3 w-3" />
              +0.3% from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
