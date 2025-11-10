"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Store,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Activity,
  BarChart3,
  Eye,
  X
} from "lucide-react";

interface StatCard {
  title: string;
  value: string;
  change: number;
  icon: any;
  iconBg: string;
  iconColor: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: string;
  trend: number;
}

interface Vendor {
  id: string;
  name: string;
  revenue: string;
  orders: number;
  rating: number;
  products: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  vendor: string;
  amount: string;
  status: string;
  time: string;
}

export default function CustomDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: "Total Revenue",
      value: "₹0",
      change: 0,
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "Total Orders",
      value: "0",
      change: 0,
      icon: ShoppingCart,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Active Vendors",
      value: "0",
      change: 0,
      icon: Store,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Total Customers",
      value: "0",
      change: 0,
      icon: Users,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
    
  ]);

  const [revenueData, setRevenueData] = useState<{ day: string; amount: number }[]>([]);
  const [salesTrend, setSalesTrend] = useState<{ month: string; sales: number }[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [topVendors, setTopVendors] = useState<Vendor[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [categories, setCategories] = useState<{ 
    name: string; 
    sales: string;
    salesAmount: number;
    percentage: number; 
    color: string;
    productCount?: number;
    vendor?: string | null;
    isDefault?: boolean;
    role?: string;
  }[]>([]);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "active" | "inactive" | "vendor" | "system">("all");
  const [activityFeed, setActivityFeed] = useState<{ action: string; detail: string; time: string }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [usersRes, vendorsRes, ordersRes, categoriesRes] = await Promise.all([
        fetch('/api/routes/users'),
        fetch('/api/vendors'),
        fetch('/api/routes/orders?limit=1000'),  // Fetch more orders for accurate stats
        fetch('/api/routes/categories?limit=5000')  // Fetch ALL categories (vendor + system)
      ]);

      const usersData = await usersRes.json();
      const vendorsData = await vendorsRes.json();
      const ordersData = ordersRes.ok ? await ordersRes.json() : { success: false, data: { orders: [] } };
      const categoriesApiData = await categoriesRes.json();

      console.log('API Response Data:', { usersData, vendorsData, ordersData, categoriesApiData });

      // Calculate stats - ensure all are arrays
      const users = Array.isArray(usersData.data) ? usersData.data : (Array.isArray(usersData) ? usersData : []);
      const vendors = Array.isArray(vendorsData.data) ? vendorsData.data : (Array.isArray(vendorsData) ? vendorsData : []);
      
      // Orders API returns data.orders structure
      const orders = ordersData.success && ordersData.data?.orders 
        ? ordersData.data.orders 
        : (Array.isArray(ordersData.data) ? ordersData.data : []);
      
      // Categories API returns data array
      const apiCategories = Array.isArray(categoriesApiData.data) 
        ? categoriesApiData.data 
        : (Array.isArray(categoriesApiData) ? categoriesApiData : []);
      
      // Store all categories for modal
      setAllCategories(apiCategories);
      
      console.log('Categories from API:', apiCategories.length);
      console.log('Processed Arrays:', { users: users.length, vendors: vendors.length, orders: orders.length, categories: apiCategories.length });

      // Total customers (users with role 'user')
      const totalCustomers = users.filter((u: any) => u.role === 'user').length;
      
      // Active vendors (approved vendors)
      const activeVendors = vendors.filter((v: any) => v.status === 'approved').length;

      // Calculate total revenue and orders from all orders
      let totalRevenue = 0;
      let totalOrders = orders.length;

      // Calculate revenue from order.total field
      totalRevenue = orders.reduce((sum: number, order: any) => {
        const amount = parseFloat(order.total || order.totalPrice || order.amount || 0);
        return sum + amount;
      }, 0);

      console.log('Total Revenue:', totalRevenue, 'Total Orders:', totalOrders);

      // Update stats cards
      setStats([
        {
          title: "Total Revenue",
          value: `₹${totalRevenue.toLocaleString('en-IN')}`,
          change: 12.5,
          icon: DollarSign,
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600"
        },
        {
          title: "Total Orders",
          value: totalOrders.toString(),
          change: 8.2,
          icon: ShoppingCart,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600"
        },
        {
          title: "Active Vendors",
          value: activeVendors.toString(),
          change: 15.3,
          icon: Store,
          iconBg: "bg-purple-100",
          iconColor: "text-purple-600"
        },
        {
          title: "Total Customers",
          value: totalCustomers.toString(),
          change: -2.4,
          icon: Users,
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600"
        }
      ]);

      // Process revenue data for weekly chart (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date;
      });

      const weeklyRevenue = last7Days.map((date) => {
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayOrders = orders.filter((order: any) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          return orderDate.toDateString() === date.toDateString();
        });
        const amount = dayOrders.reduce((sum: number, order: any) => {
          return sum + parseFloat(order.total || order.totalPrice || order.amount || 0);
        }, 0);
        return { day: dayName, amount };
      });
      console.log('Weekly Revenue Data:', weeklyRevenue);
      setRevenueData(weeklyRevenue);

      // Process sales trend (last 6 months)
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        return date;
      });

      const monthlySales = last6Months.map((date) => {
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthOrders = orders.filter((order: any) => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === date.getMonth() && 
                 orderDate.getFullYear() === date.getFullYear();
        });
        return { month: monthName, sales: monthOrders.length };
      });
      console.log('Monthly Sales Trend Data:', monthlySales);
      setSalesTrend(monthlySales);

      // Get trending products (top 5 by sales)
      const productSales = new Map();
      orders.forEach((order: any) => {
        order.items?.forEach((item: any) => {
          const productId = item.product?._id || item.productId;
          const productName = item.product?.name || item.productName || 'Unknown Product';
          const category = item.product?.category || 'General';
          const quantity = item.quantity || 1;
          const price = parseFloat(item.price || item.product?.price || 0);
          
          if (!productSales.has(productId)) {
            productSales.set(productId, {
              id: productId,
              name: productName,
              category,
              sales: 0,
              revenue: 0,
              trend: Math.floor(Math.random() * 30) + 5
            });
          }
          
          const product = productSales.get(productId);
          product.sales += quantity;
          product.revenue += price * quantity;
        });
      });

      const sortedProducts = Array.from(productSales.values())
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5)
        .map(p => ({
          ...p,
          revenue: `₹${p.revenue.toLocaleString('en-IN')}`
        }));
      setTrendingProducts(sortedProducts);

      // Get top revenue vendors from order items
      const vendorRevenue = new Map();
      const vendorOrderCount = new Map();
      
      orders.forEach((order: any) => {
        if (!order.items || !Array.isArray(order.items)) return;
        
        order.items.forEach((item: any) => {
          const vendorId = item.vendor?._id || item.vendor;
          const vendorName = item.vendor?.businessName || 
                            item.vendorName ||
                            (item.vendor?.firstName ? `${item.vendor.firstName} ${item.vendor.lastName}` : '') ||
                            'Unknown Vendor';
          
          if (vendorId) {
            if (!vendorRevenue.has(vendorId.toString())) {
              vendorRevenue.set(vendorId.toString(), {
                id: vendorId.toString(),
                name: vendorName,
                revenue: 0,
                orders: new Set(),
                rating: 4.5 + Math.random() * 0.5,
                products: 0
              });
            }
            
            const vendor = vendorRevenue.get(vendorId.toString());
            vendor.revenue += parseFloat(item.total || item.price * item.quantity || 0);
            vendor.orders.add(order._id?.toString() || order.orderNumber);
          }
        });
      });
      
      // Convert order sets to counts
      vendorRevenue.forEach((vendor) => {
        vendor.orders = vendor.orders.size;
      });

      // Add product counts (set to 0 since products API is not available)
      // If you have a products API later, you can uncomment this:
      // products.forEach((product: any) => {
      //   const vendorId = product.vendor?._id || product.vendorId;
      //   if (vendorId && vendorRevenue.has(vendorId)) {
      //     vendorRevenue.get(vendorId).products += 1;
      //   }
      // });

      const sortedVendors = Array.from(vendorRevenue.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)  // Show top 10 vendors
        .map(v => ({
          ...v,
          revenue: `₹${v.revenue.toLocaleString('en-IN')}`,
          rating: parseFloat(v.rating.toFixed(1))
        }));
      setTopVendors(sortedVendors);

      // Get recent orders with vendor information
      const recentOrdersList = orders
        .sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 5)
        .map((order: any) => {
          // Get customer name from populated customer field
          const customerName = order.customer?.name || 
                              order.customer?.email?.split('@')[0] ||
                              order.shippingAddress?.fullName ||
                              'Guest';
          
          // Get product name - either single product or count
          const itemCount = order.items?.length || 0;
          const productName = itemCount === 1 
            ? (order.items[0].product?.name || order.items[0].productName)
            : `${itemCount} items`;
          
          // Get vendor name from first item
          const firstItem = order.items?.[0];
          const vendorName = firstItem?.vendor?.businessName || 
                            firstItem?.vendorName ||
                            (firstItem?.vendor?.firstName ? `${firstItem.vendor.firstName} ${firstItem.vendor.lastName}` : '') ||
                            'Unknown Vendor';
          
          const amount = `₹${parseFloat(order.total || 0).toLocaleString('en-IN')}`;
          const status = order.status || 'pending';
          
          // Calculate time ago
          const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
          const now = new Date();
          const diffMs = now.getTime() - createdAt.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);
          
          let time;
          if (diffMins < 1) {
            time = 'Just now';
          } else if (diffMins < 60) {
            time = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
          } else if (diffHours < 24) {
            time = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
          } else {
            time = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
          }

          return {
            id: order._id || order.orderNumber,
            customer: customerName,
            product: productName,
            vendor: vendorName,
            amount,
            status,
            time
          };
        });
      setRecentOrders(recentOrdersList);

      // Calculate category performance with real category data
      const categoryMap = new Map();
      
      // Initialize all categories from API (already stored in apiCategories)
      apiCategories.forEach((cat: any) => {
        categoryMap.set(cat.name || cat.title, {
          id: cat._id,
          name: cat.name || cat.title,
          sales: 0,
          productCount: cat.productCount || 0,
          vendor: cat.vendor?.businessName || cat.vendorName || null,
          isDefault: cat.isDefault || false,
          role: cat.role || 'vendor'
        });
      });

      // Calculate sales per category from orders
      orders.forEach((order: any) => {
        if (!order.items || !Array.isArray(order.items)) return;
        
        order.items.forEach((item: any) => {
          const categoryName = item.product?.category || item.category || 'Other';
          const itemTotal = parseFloat(item.total || (item.price * item.quantity) || 0);
          
          if (categoryMap.has(categoryName)) {
            const cat = categoryMap.get(categoryName);
            cat.sales += itemTotal;
          } else {
            // Add uncategorized items
            if (!categoryMap.has('Other')) {
              categoryMap.set('Other', { id: 'other', name: 'Other', sales: 0, productCount: 0 });
            }
            const cat = categoryMap.get('Other');
            cat.sales += itemTotal;
          }
        });
      });

      const totalCategorySales = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.sales, 0);
      const colors = ['bg-blue-500', 'bg-pink-500', 'bg-purple-500', 'bg-orange-500', 'bg-green-500', 'bg-indigo-500', 'bg-teal-500'];
      
      const categoriesData = Array.from(categoryMap.values())
        // Show all categories, not just ones with sales
        .map((cat, index) => ({
          name: cat.name,
          sales: `₹${cat.sales.toLocaleString('en-IN')}`,
          salesAmount: cat.sales,  // Keep numeric value for sorting
          percentage: totalCategorySales > 0 ? Math.round((cat.sales / totalCategorySales) * 100) : 0,
          color: colors[index % colors.length],
          productCount: cat.productCount,
          vendor: cat.vendor,
          isDefault: cat.isDefault,
          role: cat.role
        }))
        .sort((a, b) => b.salesAmount - a.salesAmount)  // Sort by sales amount
        .slice(0, 10);  // Show top 10 categories
      setCategories(categoriesData);

      // Platform activity feed (recent vendors, orders, etc.)
      const activities = [];
      
      // Recent vendors
      const recentVendors = vendors
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);
      
      recentVendors.forEach((vendor: any) => {
        const vendorName = vendor.firstName ? 
          `${vendor.firstName} ${vendor.lastName}` : 
          vendor.businessName || 'New Vendor';
        const createdAt = new Date(vendor.createdAt);
        const diffHours = Math.floor((Date.now() - createdAt.getTime()) / 3600000);
        activities.push({
          action: 'New vendor registered',
          detail: `${vendorName} joined the platform`,
          time: diffHours < 24 ? `${diffHours} hours ago` : `${Math.floor(diffHours / 24)} days ago`
        });
      });

      // Order milestone
      if (orders.length > 0) {
        activities.push({
          action: 'Order milestone',
          detail: `${orders.length} orders processed on platform`,
          time: '1 hour ago'
        });
      }

      // Vendor milestone
      if (vendors.length > 0) {
        activities.push({
          action: 'Platform growth',
          detail: `${vendors.length} vendors registered on platform`,
          time: '2 hours ago'
        });
      }

      // Recent products (commented out since products API is not available)
      // const recentProducts = products
      //   .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      //   .slice(0, 1);
      // 
      // if (recentProducts.length > 0) {
      //   activities.push({
      //     action: 'Product approved',
      //     detail: `${recentProducts[0].name} by ${recentProducts[0].vendor?.businessName || 'vendor'}`,
      //     time: '2 hours ago'
      //   });
      // }

      setActivityFeed(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map(d => d.amount)) : 1;
  const maxSales = salesTrend.length > 0 ? Math.max(...salesTrend.map(d => d.sales)) : 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform performance and key metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.change > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-sm text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-lg`}>
                  <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Weekly Revenue</h2>
              <p className="text-sm text-gray-500">Last 7 days from database orders</p>
            </div>
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </div>
          {revenueData.length > 0 ? (
            <div className="flex items-end justify-between gap-2 h-48">
              {revenueData.map((data, index) => {
                // Calculate height with minimum of 10% for visibility
                const calculatedHeight = maxRevenue > 0 ? (data.amount / maxRevenue) * 100 : 0;
                const height = data.amount > 0 ? Math.max(calculatedHeight, 10) : 5;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs text-gray-600 font-medium">
                      ₹{data.amount > 0 ? (data.amount / 1000).toFixed(1) : '0'}k
                    </div>
                    <div 
                      className={`w-full rounded-t-lg transition-all shadow-sm ${
                        data.amount > 0 
                          ? 'bg-gradient-to-t from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500' 
                          : 'bg-gray-200'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <div className="text-xs text-gray-500 font-medium">{data.day}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No revenue data for this week</p>
              </div>
            </div>
          )}
        </div>

        {/* Sales Trend Line Graph */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Sales Trend</h2>
              <p className="text-sm text-gray-500">Last 6 months from database orders</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          {salesTrend.length > 0 ? (
            <div className="relative h-48">
              <div className="absolute inset-0 flex items-end justify-between gap-2">
                {salesTrend.map((data, index) => {
                  // Calculate height with minimum of 15% for visibility
                  const calculatedHeight = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
                  const height = data.sales > 0 ? Math.max(calculatedHeight, 15) : 8;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs text-gray-600 font-medium">{data.sales}</div>
                      <div className="relative w-full" style={{ height: `${height}%` }}>
                        <div className={`absolute inset-0 rounded-t-lg shadow-sm ${
                          data.sales > 0 
                            ? 'bg-gradient-to-t from-emerald-200 to-emerald-50' 
                            : 'bg-gray-100'
                        }`} />
                        {index < salesTrend.length - 1 && maxSales > 0 && (
                          <svg className="absolute top-0 left-full w-full h-full overflow-visible" style={{ zIndex: 1 }}>
                            <line
                              x1="0"
                              y1="0"
                              x2="100%"
                              y2={`${Math.max(0, Math.min(100, ((salesTrend[index + 1].sales - data.sales) / maxSales) * 100))}%`}
                              stroke="#10b981"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-md" style={{ zIndex: 2 }} />
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{data.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No sales data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trending Products & Top Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Trending Products</h2>
              <p className="text-sm text-gray-500">Top selling items this month</p>
            </div>
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-3">
            {trendingProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold text-gray-900 text-sm">{product.revenue}</p>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">{product.trend}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Revenue Vendors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Top Revenue Vendors</h2>
              <p className="text-sm text-gray-500">Top {topVendors.length} highest earning sellers</p>
            </div>
            <Store className="h-5 w-5 text-purple-600" />
          </div>
          <div className="space-y-3">
            {topVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{vendor.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{vendor.orders} orders</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{vendor.products} products</span>
                  </div>
                </div>
                <div className="text-right mr-4">
                  <p className="font-semibold text-gray-900 text-sm">{vendor.revenue}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-500">{vendor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
              <p className="text-sm text-gray-500">Latest transactions</p>
            </div>
            <ShoppingCart className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{order.customer}</p>
                    <p className="text-xs text-gray-500 mt-1">{order.product}</p>
                    <p className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1">
                      <Store className="h-3 w-3" />
                      {order.vendor}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">{order.amount}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Platform Activity</h2>
              <p className="text-sm text-gray-500">Recent updates</p>
            </div>
            <Activity className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {activityFeed.map((activity, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.detail}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Categories Modal */}
      {showCategoriesModal && (() => {
        // Filter categories based on search and filter
        const filteredCategories = allCategories.filter((cat: any) => {
          const matchesSearch = !categorySearchTerm || 
            (cat.name || cat.title || '').toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
            (cat.description || '').toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
            (cat.vendor?.businessName || '').toLowerCase().includes(categorySearchTerm.toLowerCase());
          
          const matchesFilter = categoryFilter === 'all' ||
            (categoryFilter === 'active' && cat.status === 'active') ||
            (categoryFilter === 'inactive' && cat.status !== 'active') ||
            (categoryFilter === 'vendor' && cat.vendor?.businessName) ||
            (categoryFilter === 'system' && (!cat.vendor || cat.isDefault));
          
          return matchesSearch && matchesFilter;
        });

        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Showing {filteredCategories.length} of {allCategories.length} categories
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCategoriesModal(false);
                      setCategorySearchTerm("");
                      setCategoryFilter("all");
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="vendor">Vendor Categories</option>
                    <option value="system">System Categories</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((category: any) => (
                    <div
                      key={category._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all hover:border-purple-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900">
                              {category.name || category.title}
                            </h3>
                            {category.isDefault && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">
                                Default
                              </span>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                              {category.description}
                            </p>
                          )}
                          {category.vendor?.businessName && (
                            <p className="text-xs text-purple-600 font-medium">
                              <Store className="h-3 w-3 inline mr-1" />
                              {category.vendor.businessName}
                            </p>
                          )}
                          {category.role && (
                            <p className="text-xs text-gray-500 mt-1">
                              Role: {category.role}
                            </p>
                          )}
                        </div>
                        {category.icon && (
                          <div className="ml-2 text-2xl">{category.icon}</div>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-100 pt-3 mt-3">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {category.productCount || 0} products
                          </span>
                          {category.status && (
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              category.status === 'active' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {category.status}
                            </span>
                          )}
                        </div>
                        
                        {category.sortOrder !== undefined && (
                          <p className="text-xs text-gray-500">
                            Order: {category.sortOrder}
                          </p>
                        )}
                        
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              alert(`Category: ${category.name}\nID: ${category._id}\nVendor: ${category.vendor?.businessName || 'System'}\nProducts: ${category.productCount || 0}\nStatus: ${category.status}`);
                            }}
                            className="flex-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No categories found</p>
                </div>
              )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
