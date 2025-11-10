import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Users, ShoppingCart, Eye, ArrowUp, ArrowDown, Loader2, Package } from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  avgOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  dailyTracking: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const vendorData = localStorage.getItem('vendorData');
      if (!vendorData) return;

      const vendor = JSON.parse(vendorData);
      const vendorId = vendor._id;

      // Fetch orders
      const ordersResponse = await fetch(`/api/routes/orders?vendor=${vendorId}&limit=1000`);
      const ordersData = await ordersResponse.json();

      // Fetch products
      const productsResponse = await fetch(`/api/routes/products?vendor=${vendorId}&limit=1000`);
      const productsData = await productsResponse.json();

      if (ordersData.success && productsData.success) {
        const orders = ordersData.data.orders;
        const products = productsData.data.products;

        // Calculate metrics
        let totalRevenue = 0;
        const customerSet = new Set();
        const productSalesMap = new Map();
        const dailyTrackingMap = new Map();

        orders.forEach((order: any) => {
          const vendorItems = order.items.filter((item: any) => {
            const itemVendorId = item.vendor?._id || item.vendor;
            return itemVendorId && itemVendorId.toString() === vendorId.toString();
          });

          vendorItems.forEach((item: any) => {
            const itemTotal = item.price * item.quantity;
            totalRevenue += itemTotal;

            // Track product sales
            const productName = item.productName || 'Unknown Product';
            if (!productSalesMap.has(productName)) {
              productSalesMap.set(productName, { sales: 0, revenue: 0 });
            }
            const productData = productSalesMap.get(productName);
            productData.sales += item.quantity;
            productData.revenue += itemTotal;
          });

          const customerId = order.customer?._id || order.customer;
          if (customerId) customerSet.add(customerId);

          // Track daily sales
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          if (!dailyTrackingMap.has(orderDate)) {
            dailyTrackingMap.set(orderDate, { orders: 0, revenue: 0 });
          }
          const dailyData = dailyTrackingMap.get(orderDate);
          dailyData.orders += 1;
          dailyData.revenue += order.total;
        });

        // Get top 5 products by revenue
        const topProducts = Array.from(productSalesMap.entries())
          .map(([name, data]) => ({
            name,
            sales: data.sales,
            revenue: data.revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        // Get daily tracking data
        const dailyTracking = Array.from(dailyTrackingMap.entries())
          .map(([date, data]) => ({
            date,
            orders: data.orders,
            revenue: data.revenue,
          }));

        setAnalytics({
          totalRevenue,
          totalOrders: orders.length,
          totalCustomers: customerSet.size,
          totalProducts: products.length,
          avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
          topProducts,
          dailyTracking,
        });
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const metrics = [
    { label: "Revenue", value: `₹${analytics.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Orders", value: analytics.totalOrders.toString(), icon: ShoppingCart, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Customers", value: analytics.totalCustomers.toString(), icon: Users, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Products", value: analytics.totalProducts.toString(), icon: Package, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const topProducts = analytics.topProducts || [];

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
            <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 md:p-3 rounded-lg ${metric.bgColor}`}>
                  <IconComponent className={`h-4 w-4 md:h-6 md:w-6 ${metric.color}`} />
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
              <p className="text-gray-600 text-xs md:text-sm">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section - Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Bar Chart */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue by Day</h3>
              <p className="text-sm text-gray-500 mt-1">Recent daily performance</p>
            </div>
          </div>
          <div className="h-56 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={20 + i * 40}
                  x2="400"
                  y2={20 + i * 40}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}
              
              {/* Bars */}
              {(() => {
                const recentDays = analytics.dailyTracking.slice(-7);
                const maxRevenue = Math.max(...recentDays.map(d => d.revenue), 1);
                
                return recentDays.map((day, i) => {
                  const barHeight = (day.revenue / maxRevenue) * 150;
                  const x = 50 + (i * 50);
                  const y = 180 - barHeight;
                  const colors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#ecfdf5', '#10b981'];
                  
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width="35"
                        height={barHeight}
                        fill={colors[i]}
                        rx="4"
                      />
                      <text
                        x={x + 17.5}
                        y={y - 5}
                        fontSize="10"
                        fill="#374151"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        ₹{Math.round(day.revenue)}
                      </text>
                    </g>
                  );
                });
              })()}
              
              {/* X-axis labels */}
              {analytics.dailyTracking.slice(-7).map((day, i) => (
                <text
                  key={i}
                  x={50 + (i * 50) + 17.5}
                  y="195"
                  fontSize="9"
                  fill="#9ca3af"
                  textAnchor="middle"
                >
                  {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Orders Area Chart */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Orders Trend</h3>
              <p className="text-sm text-gray-500 mt-1">Daily order volume</p>
            </div>
          </div>
          <div className="h-56 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="analyticsOrdersGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="40"
                  y1={20 + i * 40}
                  x2="400"
                  y2={20 + i * 40}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}
              
              {(() => {
                const recentDays = analytics.dailyTracking.slice(-7);
                const maxOrders = Math.max(...recentDays.map(d => d.orders), 1);
                const points = recentDays.map((day, i) => {
                  const x = 40 + (i * 60);
                  const y = 180 - ((day.orders / maxOrders) * 150);
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <>
                    {/* Area */}
                    <path
                      d={`M ${points} L 400,180 L 40,180 Z`}
                      fill="url(#analyticsOrdersGradient)"
                    />
                    
                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    
                    {/* Data points */}
                    {recentDays.map((day, i) => {
                      const x = 40 + (i * 60);
                      const y = 180 - ((day.orders / maxOrders) * 150);
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="5" fill="#fff" stroke="#8b5cf6" strokeWidth="2" />
                          <circle cx={x} cy={y} r="3" fill="#8b5cf6" />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
              
              {/* Y-axis labels */}
              {(() => {
                const recentDays = analytics.dailyTracking.slice(-7);
                const maxOrders = Math.max(...recentDays.map(d => d.orders), 1);
                return (
                  <>
                    <text x="5" y="25" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(maxOrders)}</text>
                    <text x="5" y="65" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(maxOrders * 0.75)}</text>
                    <text x="5" y="105" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(maxOrders * 0.5)}</text>
                    <text x="5" y="145" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(maxOrders * 0.25)}</text>
                    <text x="5" y="185" fontSize="11" fill="#9ca3af" fontWeight="500">0</text>
                  </>
                );
              })()}
              
              {/* X-axis labels */}
              {analytics.dailyTracking.slice(-7).map((day, i) => (
                <text
                  key={i}
                  x={40 + (i * 60)}
                  y="198"
                  fontSize="9"
                  fill="#9ca3af"
                  textAnchor="middle"
                >
                  {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                </text>
              ))}
            </svg>
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
                <span className="text-xs font-medium text-green-600">
                  <TrendingUp className="h-3 w-3 inline" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Sales: {product.sales} units</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-600">₹{product.revenue.toFixed(2)}</p>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sales} units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">₹{product.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    <TrendingUp className="h-4 w-4 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 shadow-lg border border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Avg. Order Value</h3>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2">₹{analytics.avgOrderValue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">
              Per order average
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 md:p-6 shadow-lg border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Total Revenue</h3>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">₹{analytics.totalRevenue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">
              All time earnings
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 shadow-lg border border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Products Sold</h3>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">{topProducts.reduce((sum, p) => sum + p.sales, 0)}</div>
            <div className="text-sm text-gray-600">
              Total units sold
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
