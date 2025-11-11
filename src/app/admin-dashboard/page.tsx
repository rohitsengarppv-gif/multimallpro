"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  BarChartBig,
  Package,
  ShoppingCart,
  Percent,
  Grid3X3,
  CreditCard,
  Shield,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  Search,
  Mail,
  Bell,
  Settings,
  Filter,
  Plus,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

import CustomDashboardPage from "../../components/admin/CustomDashboardPage";
import UserManagementPage from "../../components/admin/UserManagementPage";
import VendorManagementPage from "../../components/admin/VendorManagementPage";
import UserDetailPage from "../../components/admin/UserDetailPage";
import AdminManagementPage from "../../components/master/AdminManagementPage";
import AdminProfilePage from "../../components/admin/AdminProfilePage";
import WebsiteSettingsPage from "../../components/admin/WebsiteSettingsPage";

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

// Vendor Pages (keeping for backward compatibility)
import ProductsPage from "../../components/vendor/ProductsPage";
import ProductFormPage from "../../components/vendor/ProductFormPage";
import OrdersPage from "../../components/vendor/OrdersPage";
import DiscountPage from "../../components/vendor/DiscountPage";
import IntegrationsPage from "../../components/vendor/IntegrationsPage";
import InvoicePage from "../../components/vendor/InvoicePage";
import AnalyticsPage from "../../components/vendor/AnalyticsPage";
import CustomersPage from "../../components/vendor/CustomersPage";
import SettingsPage from "../../components/vendor/SettingsPage";
import SecurityPage from "../../components/vendor/SecurityPage";
import HelpPage from "../../components/vendor/HelpPage";
import MessagesPage from "../../components/vendor/MessagesPage";

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("custom-dashboard");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserType, setSelectedUserType] = useState<"customer" | "vendor">("customer");
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const adminDataString = localStorage.getItem("adminData");

    if (!adminToken || !adminDataString) {
      router.push("/admin-login");
      return;
    }

    try {
      const parsedAdminData = JSON.parse(adminDataString);
      // Check if admin is approved
      if (parsedAdminData.status !== "approved") {
        alert("Your admin account is pending approval. Please wait for master admin to approve your request.");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        router.push("/admin-login");
        return;
      }
      setAdminData(parsedAdminData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error parsing admin data:', error);
      router.push("/admin-login");
      return;
    }
  }, [router]);

  useEffect(() => {
    if (adminData?._id) {
      setSelectedUserId(adminData._id);
      const role = adminData.role === "vendor" ? "vendor" : "customer";
      setSelectedUserType(role);
    }
  }, [adminData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileDropdownOpen && !target.closest('.relative')) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      router.push("/admin-login");
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const primaryItems = [
    { id: "custom-dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "user-details", label: "User Detail", icon: BarChartBig },
    ...(adminData?.role === "master_admin" ? [{ id: "admin-management", label: "Admin Management", icon: Shield }] : []),
    { id: "admin-profile", label: "Profile", icon: User },
    { id: "website-settings", label: "Website Settings", icon: Settings },
  ];

  const managementItems = [
    { id: "admin-products", label: "Products", icon: Package },
    { id: "admin-orders", label: "Orders", icon: ShoppingCart },
    { id: "admin-categories", label: "Categories", icon: Grid3X3 },
    { id: "admin-subcategories", label: "Subcategories", icon: Grid3X3 },
    { id: "admin-discounts", label: "Discounts", icon: Percent },
    { id: "vendors", label: "Vendors", icon: Store },
  ];

  const supportItems = [
    { id: "help-management", label: "Help Management", icon: HelpCircle },
    { id: "messages", label: "Messages", icon: MessageSquare },
   
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "custom-dashboard":
        return <CustomDashboardPage />;
      case "users":
        return <UserManagementPage />;
      case "vendors":
        return <VendorManagementPage />;
      case "admin-management":
        return <AdminManagementPage />;
      case "admin-profile":
        return <AdminProfilePage />;
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
      case "website-settings":
        return <WebsiteSettingsPage />;
      
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
      case "help-management":
        return <HelpManagementPage />;
      
      // Old vendor pages (keeping for backward compatibility)
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
      case "settings":
        return <SettingsPage />;
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
        return <CustomDashboardPage />;
    }
  };

  const renderNavSection = (title: string, items: typeof primaryItems) => (
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
            <div className="h-8 w-8 rounded-lg bg-purple-500 grid place-items-center text-white font-black text-sm">
              A
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 block">Admin Hub</span>
              <span className="text-xs text-gray-500">Global Operations</span>
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
          {renderNavSection("Administration", primaryItems)}
          {renderNavSection("Management", managementItems)}
          {renderNavSection("Support", supportItems)}
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
                  placeholder="Search across platform..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">Ctrl K</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                  8
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                  4
                </span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-purple-500 grid place-items-center text-white text-sm font-bold">
                    {adminData?.username?.substring(0, 2).toUpperCase() || "AD"}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">{adminData?.username}</div>
                    <div className="text-xs text-gray-500">
                      {adminData?.role === "master_admin" ? "Master Admin" : "Admin"}
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{adminData?.username}</p>
                      <p className="text-xs text-gray-500">{adminData?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("admin-profile");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <section className="p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
            <span>Administration</span>
            <span>/</span>
            <span className="capitalize">{activeTab.replace(/-/g, " ")}</span>
          </div>
          {renderContent()}
        </section>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => {
            setSidebarOpen(false);
            setProfileDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}
