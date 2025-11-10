import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Package, Eye, TrendingUp, Loader2, Users } from "lucide-react";

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
  dailyRevenue: number[];
  dailyOrders: number[];
  statusCount: { [key: string]: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorName, setVendorName] = useState('Vendor');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const vendorData = localStorage.getItem('vendorData');
      if (!vendorData) return;

      const vendor = JSON.parse(vendorData);
      const vendorId = vendor._id;
      setVendorName(vendor.businessName || vendor.name || 'Vendor');

      // Fetch orders
      const ordersResponse = await fetch(`/api/routes/orders?vendor=${vendorId}&limit=1000`);
      const ordersData = await ordersResponse.json();

      // Fetch products
      const productsResponse = await fetch(`/api/routes/products?vendor=${vendorId}&limit=1000`);
      const productsData = await productsResponse.json();

      if (ordersData.success && productsData.success) {
        const orders = ordersData.data.orders;
        const products = productsData.data.products;

        // Calculate total sales (vendor-specific)
        let totalSales = 0;
        const customerSet = new Set();
        const dailyRevenue = new Array(7).fill(0);
        const dailyOrders = new Array(7).fill(0);
        const statusCount: any = { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0 };

        orders.forEach((order: any) => {
          const vendorOrderTotal = order.items
            .filter((item: any) => {
              const itemVendorId = item.vendor?._id || item.vendor;
              return itemVendorId && itemVendorId.toString() === vendorId.toString();
            })
            .reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          
          totalSales += vendorOrderTotal;
          
          // Track daily data (last 7 days)
          const orderDate = new Date(order.createdAt);
          const today = new Date();
          const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff >= 0 && daysDiff < 7) {
            dailyRevenue[6 - daysDiff] += vendorOrderTotal;
            dailyOrders[6 - daysDiff] += 1;
          }
          
          // Track order status
          const status = order.status.toLowerCase();
          if (statusCount.hasOwnProperty(status)) {
            statusCount[status]++;
          }
          
          const customerId = order.customer?._id || order.customer;
          if (customerId) customerSet.add(customerId);
        });

        // Get recent orders (last 5)
        const recentOrders = orders
          .slice(0, 5)
          .map((order: any) => {
            const vendorItems = order.items.filter((item: any) => {
              const itemVendorId = item.vendor?._id || item.vendor;
              return itemVendorId && itemVendorId.toString() === vendorId.toString();
            });
            
            const vendorTotal = vendorItems.reduce((sum: number, item: any) => 
              sum + (item.price * item.quantity), 0
            );

            return {
              _id: order._id,
              orderNumber: order.orderNumber,
              customer: order.customer?.name || order.shippingAddress?.fullName || 'Unknown',
              product: vendorItems[0]?.productName || 'Multiple Items',
              amount: vendorTotal,
              status: order.status,
              date: order.createdAt,
            };
          });

        setStats({
          totalSales,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: customerSet.size,
          recentOrders,
          dailyRevenue,
          dailyOrders,
          statusCount,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "completed": return "bg-green-100 text-green-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statsCards = [
    { label: "Total Sales", value: `₹${stats.totalSales.toFixed(2)}`, icon: DollarSign, color: "text-green-600", bgColor: "bg-green-50" },
    { label: "Orders", value: stats.totalOrders.toString(), icon: ShoppingCart, color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "Products", value: stats.totalProducts.toString(), icon: Package, color: "text-purple-600", bgColor: "bg-purple-50" },
    { label: "Customers", value: stats.totalCustomers.toString(), icon: Users, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const recentOrders = stats.recentOrders || [];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Navigate your store with {vendorName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Last 30 days
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">View All</button>
          </div>
        
        {/* Mobile Cards View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <div key={order._id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-900 mb-1">{order.customer}</div>
                <div className="text-sm text-gray-600 mb-2">{order.product}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-orange-600">₹{order.amount.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar - Sales Statistics */}
        <div className="space-y-4 md:space-y-6">
          {/* Circular Progress Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Sales Statistics</h3>
            </div>
            <div className="flex items-center justify-center py-6">
              <div className="relative w-48 h-48">
                {/* Circular Progress */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#FEE2E2"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#F97316"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(stats.totalOrders / (stats.totalOrders + 50)) * 502} 502`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#8B5CF6"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(stats.totalProducts / (stats.totalProducts + 20)) * 502} 502`}
                    strokeDashoffset={`-${(stats.totalOrders / (stats.totalOrders + 50)) * 502}`}
                    strokeLinecap="round"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#10B981"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(stats.totalCustomers / (stats.totalCustomers + 30)) * 502} 502`}
                    strokeDashoffset={`-${((stats.totalOrders / (stats.totalOrders + 50)) + (stats.totalProducts / (stats.totalProducts + 20))) * 502}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-900">Total</div>
                  <div className="text-2xl font-bold text-orange-600">{stats.totalOrders + stats.totalProducts + stats.totalCustomers}</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600">Orders</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.totalOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600">Products</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.totalProducts}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Customers</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{stats.totalCustomers}</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-3">
              {recentOrders.slice(0, 3).map((order, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{order.product}</p>
                    <p className="text-xs text-gray-500">₹{order.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">₹{stats.totalSales.toFixed(0)}</div>
              <div className="text-xs text-gray-500">Total Revenue</div>
            </div>
          </div>
          <div className="h-48 md:h-56 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
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
              
              {/* Calculate max revenue for scaling */}
              {(() => {
                const maxRevenue = Math.max(...stats.dailyRevenue, 1);
                const points = stats.dailyRevenue.map((revenue, i) => {
                  const x = 40 + (i * 60);
                  const y = 180 - ((revenue / maxRevenue) * 150);
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <>
                    {/* Area under curve */}
                    <path
                      d={`M ${points} L 400,180 L 40,180 Z`}
                      fill="url(#revenueGradient)"
                    />
                    
                    {/* Revenue line */}
                    <polyline
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    
                    {/* Data points */}
                    {stats.dailyRevenue.map((revenue, i) => {
                      const x = 40 + (i * 60);
                      const y = 180 - ((revenue / maxRevenue) * 150);
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="5" fill="#fff" stroke="#f97316" strokeWidth="2" />
                          <circle cx={x} cy={y} r="3" fill="#f97316" />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
              
              {/* Y-axis labels */}
              <text x="5" y="25" fontSize="11" fill="#9ca3af" fontWeight="500">₹{Math.round(stats.totalSales * 0.8)}</text>
              <text x="5" y="65" fontSize="11" fill="#9ca3af" fontWeight="500">₹{Math.round(stats.totalSales * 0.6)}</text>
              <text x="5" y="105" fontSize="11" fill="#9ca3af" fontWeight="500">₹{Math.round(stats.totalSales * 0.4)}</text>
              <text x="5" y="145" fontSize="11" fill="#9ca3af" fontWeight="500">₹{Math.round(stats.totalSales * 0.2)}</text>
              <text x="5" y="185" fontSize="11" fill="#9ca3af" fontWeight="500">₹0</text>
              
              {/* X-axis labels */}
              <text x="40" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Mon</text>
              <text x="100" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Tue</text>
              <text x="160" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Wed</text>
              <text x="220" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Thu</text>
              <text x="280" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Fri</text>
              <text x="340" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Sat</text>
              <text x="400" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Sun</text>
            </svg>
          </div>
        </div>

        {/* Orders Trend Chart */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Orders Trend</h3>
              <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
              <div className="text-xs text-gray-500">Total Orders</div>
            </div>
          </div>
          <div className="h-48 md:h-56 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <linearGradient id="ordersGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </linearGradient>
              </defs>
              
              {/* Horizontal grid lines */}
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
              
              {/* Calculate max orders for scaling */}
              {(() => {
                const maxOrders = Math.max(...stats.dailyOrders, 1);
                const points = stats.dailyOrders.map((orders, i) => {
                  const x = 40 + (i * 60);
                  const y = 180 - ((orders / maxOrders) * 150);
                  return `${x},${y}`;
                }).join(' ');
                
                return (
                  <>
                    {/* Area under curve */}
                    <path
                      d={`M ${points} L 400,180 L 40,180 Z`}
                      fill="url(#ordersGradient)"
                    />
                    
                    {/* Orders line */}
                    <polyline
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    
                    {/* Data points */}
                    {stats.dailyOrders.map((orders, i) => {
                      const x = 40 + (i * 60);
                      const y = 180 - ((orders / maxOrders) * 150);
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="5" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
                          <circle cx={x} cy={y} r="3" fill="#3b82f6" />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
              
              {/* Y-axis labels */}
              <text x="5" y="25" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(stats.totalOrders * 0.8)}</text>
              <text x="5" y="65" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(stats.totalOrders * 0.6)}</text>
              <text x="5" y="105" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(stats.totalOrders * 0.4)}</text>
              <text x="5" y="145" fontSize="11" fill="#9ca3af" fontWeight="500">{Math.round(stats.totalOrders * 0.2)}</text>
              <text x="5" y="185" fontSize="11" fill="#9ca3af" fontWeight="500">0</text>
              
              {/* X-axis labels */}
              <text x="40" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Mon</text>
              <text x="100" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Tue</text>
              <text x="160" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Wed</text>
              <text x="220" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Thu</text>
              <text x="280" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Fri</text>
              <text x="340" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Sat</text>
              <text x="400" y="198" fontSize="10" fill="#9ca3af" textAnchor="middle">Sun</text>
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
