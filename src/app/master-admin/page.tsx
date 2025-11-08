"use client";

import { useState } from "react";
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
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Menu,
  X,
  Search,
  Mail,
  Bell,
  Settings,
} from "lucide-react";

import MasterOverviewPage from "../../components/master/MasterOverviewPage";
import AdminManagementPage from "../../components/master/AdminManagementPage";

import CustomDashboardPage from "../../components/admin/CustomDashboardPage";
import UserManagementPage from "../../components/admin/UserManagementPage";
import VendorManagementPage from "../../components/admin/VendorManagementPage";
import AdvancedAnalyticsPage from "../../components/admin/AdvancedAnalyticsPage";
import WebsiteSettingsPage from "../../components/admin/WebsiteSettingsPage";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("master-overview");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const administrationItems = [
    { id: "master-overview", label: "Master Overview", icon: LayoutDashboard },
    { id: "custom-dashboard", label: "Admin Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "website-settings", label: "Website Settings", icon: Settings },
    { id: "advanced-analytics", label: "Advanced Analytics", icon: BarChartBig },
  ];

  const managementItems = [
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "discount", label: "Discounts", icon: Percent },
    { id: "integrations", label: "Integrations", icon: Grid3X3 },
    { id: "invoice", label: "Billing", icon: CreditCard },
  ];

  const supportItems = [
    { id: "customers", label: "Customers", icon: Users },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "security", label: "Security", icon: Shield },
    { id: "help", label: "Help Center", icon: HelpCircle },
  ];

  const governanceItems = [
    { id: "admin-management", label: "Admin Management", icon: ShieldCheck },
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
            onNavigateToEditProduct={(productId) => {
              setSelectedProductId(productId);
              setActiveTab("product-form");
            }}
            onNavigateToViewProduct={(productId) => {
              setSelectedProductId(productId);
              setActiveTab("product-form");
            }}
            onDeleteProduct={(productId) => {
              console.log("Master admin removed product", productId);
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
          {renderSection("Governance", governanceItems)}
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
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Mail className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                  12
                </span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                  6
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-purple-600 grid place-items-center text-white text-sm font-bold">
                  MA
                </div>
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">Morgan Avery</div>
                  <div className="text-xs text-gray-500">Master Administrator</div>
                </div>
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
