import { useState } from "react";
import { Search, Settings, ExternalLink, Check, X, Plus } from "lucide-react";

export default function IntegrationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Integrations" },
    { id: "payment", name: "Payment" },
    { id: "shipping", name: "Shipping" },
    { id: "marketing", name: "Marketing" },
    { id: "analytics", name: "Analytics" },
    { id: "inventory", name: "Inventory" }
  ];

  const integrations = [
    {
      id: 1,
      name: "PayPal",
      description: "Accept payments via PayPal worldwide",
      category: "payment",
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=60&h=60&fit=crop",
      isConnected: true,
      isPopular: true,
      features: ["Secure payments", "Global reach", "Buyer protection"]
    },
    {
      id: 2,
      name: "Stripe",
      description: "Modern payment processing for internet businesses",
      category: "payment",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=60&h=60&fit=crop",
      isConnected: false,
      isPopular: true,
      features: ["Credit cards", "Digital wallets", "Subscriptions"]
    },
    {
      id: 3,
      name: "FedEx",
      description: "Fast and reliable shipping worldwide",
      category: "shipping",
      logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=60&h=60&fit=crop",
      isConnected: true,
      isPopular: false,
      features: ["Real-time tracking", "Express delivery", "International shipping"]
    },
    {
      id: 4,
      name: "Mailchimp",
      description: "Email marketing and automation platform",
      category: "marketing",
      logo: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=60&h=60&fit=crop",
      isConnected: false,
      isPopular: true,
      features: ["Email campaigns", "Automation", "Analytics"]
    },
    {
      id: 5,
      name: "Google Analytics",
      description: "Track and analyze your store performance",
      category: "analytics",
      logo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=60&h=60&fit=crop",
      isConnected: true,
      isPopular: true,
      features: ["Traffic analysis", "Conversion tracking", "Custom reports"]
    },
    {
      id: 6,
      name: "QuickBooks",
      description: "Accounting and inventory management",
      category: "inventory",
      logo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=60&h=60&fit=crop",
      isConnected: false,
      isPopular: false,
      features: ["Inventory sync", "Financial reports", "Tax management"]
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || integration.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter(i => i.isConnected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">
            Connect your store with powerful third-party services. {connectedCount} integrations connected.
          </p>
        </div>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 w-fit">
          <Plus className="h-4 w-4" />
          Request Integration
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    {integration.isPopular && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{integration.category}</p>
                </div>
              </div>
              <div className={`p-2 rounded-full ${
                integration.isConnected ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {integration.isConnected ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
              <ul className="space-y-1">
                {integration.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              {integration.isConnected ? (
                <>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configure
                  </button>
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    Disconnect
                  </button>
                </>
              ) : (
                <button className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Connected Integrations Summary */}
      {connectedCount > 0 && (
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <h3 className="text-lg font-bold text-green-900 mb-2">Connected Integrations</h3>
          <p className="text-green-700 mb-4">
            You have {connectedCount} integration{connectedCount !== 1 ? 's' : ''} actively connected to your store.
          </p>
          <div className="flex flex-wrap gap-2">
            {integrations
              .filter(i => i.isConnected)
              .map(integration => (
                <span
                  key={integration.id}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-green-200 rounded-full text-sm text-green-800"
                >
                  <img
                    src={integration.logo}
                    alt={integration.name}
                    className="w-4 h-4 rounded"
                  />
                  {integration.name}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
