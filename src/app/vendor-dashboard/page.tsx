"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  Menu,
  X,
  MessageSquare,
  CreditCard,
  Percent,
  HelpCircle,
  Shield,
  Grid3X3,
  Search,
  Mail,
  Filter,
  Plus,
  List
} from "lucide-react";

// Import page components
import DashboardPage from "../../components/vendor/DashboardPage";
import ProductsPage from "../../components/vendor/ProductsPage";
import ProductFormPage from "../../components/vendor/ProductFormPage";
import OrdersPage from "../../components/vendor/OrdersPage";
import OrderDetailPage from "../../components/vendor/OrderDetailPage";
import AnalyticsPage from "../../components/vendor/AnalyticsPage";
import CustomersPage from "../../components/vendor/CustomersPage";
import CustomerDetailPage from "../../components/vendor/CustomerDetailPage";
import MessagesPage from "../../components/vendor/MessagesPage";
import IntegrationsPage from "../../components/vendor/IntegrationsPage";
import InvoicePage from "../../components/vendor/InvoicePage";
import DiscountPage from "../../components/vendor/DiscountPage";
import CategoryPage from "../../components/vendor/CategoryPage";
import SubCategoryPage from "../../components/vendor/SubCategoryPage";
import HelpPage from "../../components/vendor/HelpPage";
import SettingsPage from "../../components/vendor/SettingsPage";

export default function VendorDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [viewMode, setViewMode] = useState("list");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Authentication check
  useEffect(() => {
    const vendorToken = localStorage.getItem("vendorToken");
    const vendorData = localStorage.getItem("vendorData");

    if (!vendorToken || !vendorData) {
      router.push("/vendor-login");
      return;
    }

    // Token validation can be done on API calls that require authentication
    // For now, we trust the localStorage data
  }, [router]);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Order", icon: ShoppingCart, badge: "16" },
    { id: "customers", label: "Customers", icon: Users },
    { id: "messages", label: "Message", icon: MessageSquare },
  ];

  const toolsItems = [
    { id: "products", label: "Product", icon: Package },
    { id: "categories", label: "Categories", icon: LayoutDashboard },
    { id: "sub-categories", label: "Sub Categories", icon: LayoutDashboard },
    { id: "discount", label: "Discount", icon: Percent },
    { id: "integrations", label: "Integrations", icon: Grid3X3 },
    { id: "analytics", label: "Analytic", icon: BarChart3 },
    { id: "invoice", label: "Invoice", icon: CreditCard },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Get Help", icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "products":
        return <ProductsPage 
          onNavigateToAddProduct={() => {
            setSelectedProductId(null);
            setActiveTab("product-form");
          }} 
          onNavigateToEditProduct={(productId: string) => {
            setSelectedProductId(productId);
            setActiveTab("product-form");
          }}
          onNavigateToViewProduct={(productId: string) => {
            setSelectedProductId(productId);
            setActiveTab("product-form");
          }}
        />;
      case "orders":
        return <OrdersPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "customers":
        return <CustomersPage />;
      case "categories":
        return <CategoryPage />;
      case "sub-categories":
        return <SubCategoryPage />;
      case "settings":
        return <SettingsPage />;
      case "messages":
        return <MessagesPage />;
      case "integrations":
        return <IntegrationsPage />;
      case "invoice":
        return <InvoicePage />;
      case "discount":
        return <DiscountPage />;
      case "product-form":
        return <ProductFormPage 
          productId={selectedProductId || undefined} 
          onBack={() => {
            setSelectedProductId(null);
            setActiveTab("products");
          }} 
        />;
      case "order-detail":
        return <OrderDetailPage onBack={() => setActiveTab("orders")} />;
      case "customer-detail":
        return <CustomerDetailPage onBack={() => setActiveTab("customers")} />;
     
      case "help":
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500 grid place-items-center text-white font-black text-sm">
              S
            </div>
            <span className="text-lg font-bold text-gray-900">Salesai</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4">
          {/* Menu Section */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Menu</div>
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                        activeTab === item.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tools Section */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">Tools</div>
            <ul className="space-y-1">
              {toolsItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                        activeTab === item.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Bottom Section */}
          <div>
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                        activeTab === item.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">⌘ K</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                  5
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-orange-500 grid place-items-center text-white text-sm font-bold">
                  JS
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">Jimmy Sullivan</div>
                  <div className="text-xs text-gray-500">Odema Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
