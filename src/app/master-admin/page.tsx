"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  User,
  Store,
  BarChartBig,
  Package,
  ShoppingCart,
  Percent,
  Grid3X3,
  CreditCard,
  Shield,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  Search,
  Mail,
  Bell,
  Settings,
  LogOut,
  Image,
} from "lucide-react";

import MasterOverviewPage from "../../components/master/MasterOverviewPage";
import AdminManagementPage from "../../components/master/AdminManagementPage";
import MasterProfilePage from "../../components/master/MasterProfilePage";

import CustomDashboardPage from "../../components/admin/CustomDashboardPage";
import UserManagementPage from "../../components/admin/UserManagementPage";
import VendorManagementPage from "../../components/admin/VendorManagementPage";
import AdvancedAnalyticsPage from "../../components/admin/AdvancedAnalyticsPage";
import WebsiteSettingsPage from "../../components/admin/WebsiteSettingsPage";
import UserDetailPage from "../../components/admin/UserDetailPage";
import AdminProfilePage from "../../components/admin/AdminProfilePage";

// New Admin Pages
import AdminProductsPage from "../../components/admin/ProductsPage";
import AdminProductDetailPage from "../../components/admin/ProductDetailPage";
import AdminOrdersPage from "../../components/admin/OrdersPage";
import AdminOrderDetailPage from "../../components/admin/OrderDetailPage";
import AdminCustomersPage from "../../components/admin/CustomersPage";
import AdminCategoriesPage from "../../components/admin/CategoriesManagementPage";
import AdminSubCategoriesPage from "../../components/admin/SubCategoriesPage";
import AdminDiscountsPage from "../../components/admin/DiscountsPage";
import HelpManagementPage from "../../components/admin/HelpManagementPage";

import ProductsPage from "../../components/vendor/ProductsPage";
import ProductFormPage from "../../components/vendor/ProductFormPage";
import OrdersPage from "../../components/vendor/OrdersPage";
import DiscountPage from "../../components/vendor/DiscountPage";
import IntegrationsPage from "../../components/vendor/IntegrationsPage";
import InvoicePage from "../../components/vendor/InvoicePage";
import AnalyticsPage from "../../components/vendor/AnalyticsPage";
import CustomersPage from "../../components/vendor/CustomersPage";
import MessagesPage from "../../components/vendor/MessagesPage";
import SecurityPage from "../../components/vendor/SecurityPage";
import HelpPage from "../../components/vendor/HelpPage";

export default function MasterAdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("custom-dashboard");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<"customer" | "vendor">("customer");
  const [masterData, setMasterData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    const masterToken = localStorage.getItem("masterToken");
    const masterDataString = localStorage.getItem("masterData");

    if (!masterToken || !masterDataString) {
      router.push("/master-admin-login");
      return;
    }

    try {
      const parsedData = JSON.parse(masterDataString);
      
      // Verify role is master
      if (parsedData.role !== "master" && parsedData.role !== "master_admin") {
        localStorage.removeItem("masterToken");
        localStorage.removeItem("masterData");
        router.push("/master-admin-login");
        return;
      }

      setMasterData(parsedData);
    } catch (error) {
      console.error("Error parsing master data:", error);
      router.push("/master-admin-login");
      return;
    }

    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Handle navigation to external pages
  useEffect(() => {
    if (activeTab === "hero-banners") {
      router.push("/admin/hero-banners");
    }
  }, [activeTab, router]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("masterToken");
      localStorage.removeItem("masterData");
      router.push("/master-admin-login");
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading master admin dashboard...</p>
        </div>
      </div>
    );
  }

  const administrationItems = [
   
    { id: "custom-dashboard", label: "Admin Overview", icon: LayoutDashboard },
    { id: "user-details", label: "User Detail", icon: BarChartBig },
    { id: "admin-management", label: "Admin Management", icon: ShieldCheck },
    { id: "admin-profile", label: "Profile", icon: User },
    { id: "website-settings", label: "Website Settings", icon: Settings },
  ];

  const managementItems = [
    { id: "admin-products", label: "Products", icon: Package },
    { id: "admin-orders", label: "Orders", icon: ShoppingCart },
    { id: "admin-categories", label: "Categories", icon: Grid3X3 },
    { id: "admin-subcategories", label: "Subcategories", icon: Grid3X3 },
    { id: "admin-discounts", label: "Discounts", icon: Percent },
    { id: "users", label: "Users", icon: Users },
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "hero-banners", label: "Hero Banners", icon: Image },
  ];

  const supportItems = [
    { id: "help-management", label: "Help Management", icon: HelpCircle },
    
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "master-overview":
        return <MasterOverviewPage />;
      case "custom-dashboard":
        return <CustomDashboardPage />;
      case "users":
        return <UserManagementPage />;
      case "vendors":
        return <VendorManagementPage />;
      case "website-settings":
        return <WebsiteSettingsPage />;
      case "advanced-analytics":
        return <AdvancedAnalyticsPage />;
      case "products":
        return (
          <ProductsPage
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
          />
        );
      case "orders":
        return <OrdersPage />;
      case "discount":
        return <DiscountPage />;
      case "integrations":
        return <IntegrationsPage />;
      case "invoice":
        return <InvoicePage />;
      case "customers":
        return <CustomersPage />;
      case "messages":
        return <MessagesPage />;
      case "security":
        return <SecurityPage />;
      case "help":
        return <HelpPage />;
      case "admin-management":
        return <AdminManagementPage />;
      case "admin-profile":
        return <MasterProfilePage />;
      case "user-details":
        if (!selectedUserId) {
          return (
            <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <p className="text-gray-600">No user selected. Please choose a user from the Users tab.</p>
              <button
                onClick={() => setActiveTab("users")}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Go to Users
              </button>
            </div>
          );
        }
        return (
          <UserDetailPage
            userId={selectedUserId}
            userType={selectedUserType}
            onBack={() => setActiveTab("users")}
          />
        );
      
      // New Admin Pages
      case "admin-products":
        return (
          <AdminProductsPage
            onViewProduct={(productId: string) => {
              setSelectedProductId(productId);
              setActiveTab("admin-product-detail");
            }}
          />
        );
      case "admin-product-detail":
        return selectedProductId ? (
          <AdminProductDetailPage 
            productId={selectedProductId}
            onBack={() => {
              setSelectedProductId(null);
              setActiveTab("admin-products");
            }}
          />
        ) : (
          <AdminProductsPage onViewProduct={(productId: string) => {
            setSelectedProductId(productId);
            setActiveTab("admin-product-detail");
          }} />
        );
      case "admin-orders":
        return (
          <AdminOrdersPage
            onViewOrder={(orderId: string) => {
              setSelectedOrderId(orderId);
              setActiveTab("admin-order-detail");
            }}
          />
        );
      case "admin-order-detail":
        return selectedOrderId ? (
          <AdminOrderDetailPage 
            orderId={selectedOrderId}
            onBack={() => {
              setSelectedOrderId(null);
              setActiveTab("admin-orders");
            }}
          />
        ) : (
          <AdminOrdersPage onViewOrder={(orderId: string) => {
            setSelectedOrderId(orderId);
            setActiveTab("admin-order-detail");
          }} />
        );
      case "admin-customers":
        return <AdminCustomersPage />;
      case "admin-categories":
        return <AdminCategoriesPage />;
      case "admin-subcategories":
        return <AdminSubCategoriesPage />;
      case "admin-discounts":
        return <AdminDiscountsPage />;
      case "hero-banners":
        return (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Redirecting to Hero Banners...</p>
            </div>
          </div>
        );
      case "help-management":
        return <HelpManagementPage />;
      
      // Old vendor pages (keeping for backward compatibility)
      case "product-form":
        return (
          <ProductFormPage
            productId={selectedProductId || undefined}
            onBack={() => {
              setSelectedProductId(null);
              setActiveTab("products");
            }}
          />
        );
      default:
        return <MasterOverviewPage />;
    }
  };

  const renderSection = (
    title: string,
    items: { id: string; label: string; icon: typeof LayoutDashboard }[]
  ) => (
    <div className="mb-6">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">{title}</div>
      <ul className="space-y-1">
        {items.map((item) => {
          const IconComponent = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                  activeTab === item.id
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-700 hover:bg-gray-50"
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
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-68 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-purple-600 grid place-items-center text-white font-black text-sm">
              M
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 block">Master Admin</span>
              <span className="text-xs text-gray-500">Platform Governance</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-88px)]">
          {renderSection("Administration", administrationItems)}
          {renderSection("Management", managementItems)}
          {renderSection("Support", supportItems)}
        </nav>
      </aside>

      <main className="flex-1 lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-1 max-w-xl mx-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search master controls..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Ctrl K</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              
            
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-600 grid place-items-center text-white text-sm font-bold">
                  {masterData?.name?.charAt(0).toUpperCase() || "M"}
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{masterData?.name || "Master Admin"}</div>
                  <div className="text-xs text-gray-500">Master Administrator</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-red-600"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <section className="p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
            <span>Master Admin</span>
            <span>/</span>
            <span className="capitalize">{activeTab.replace(/-/g, " ")}</span>
          </div>
          {renderContent()}
        </section>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
