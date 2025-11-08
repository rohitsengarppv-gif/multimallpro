import { useState } from "react";
import { Search, Book, MessageCircle, Mail, Phone, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    { id: "all", name: "All Topics" },
    { id: "getting-started", name: "Getting Started" },
    { id: "products", name: "Products" },
    { id: "orders", name: "Orders" },
    { id: "payments", name: "Payments" },
    { id: "shipping", name: "Shipping" },
    { id: "account", name: "Account" }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I add my first product?",
      answer: "To add your first product, go to the Products page and click 'Add Product'. Fill in the product details including name, description, price, and upload images. Make sure to set your inventory levels and publish when ready.",
      category: "getting-started"
    },
    {
      id: 2,
      question: "How do I process orders?",
      answer: "Orders appear in your Orders dashboard. You can view order details, update status, print shipping labels, and communicate with customers directly from the order management page.",
      category: "orders"
    },
    {
      id: 3,
      question: "What payment methods are supported?",
      answer: "We support major payment processors including PayPal, Stripe, and direct bank transfers. You can configure your preferred payment methods in the Integrations section.",
      category: "payments"
    },
    {
      id: 4,
      question: "How do I set up shipping rates?",
      answer: "Shipping rates can be configured in your Store Settings. You can set flat rates, weight-based pricing, or integrate with shipping carriers like FedEx and UPS for real-time rates.",
      category: "shipping"
    },
    {
      id: 5,
      question: "Can I customize my store appearance?",
      answer: "Yes! You can customize your store's appearance through the Settings page. Upload your logo, choose colors, and configure your store information to match your brand.",
      category: "account"
    },
    {
      id: 6,
      question: "How do I manage inventory?",
      answer: "Inventory is managed at the product level. You can set stock quantities, low stock alerts, and track inventory changes in the Products section. The system automatically updates inventory when orders are placed.",
      category: "products"
    },
    {
      id: 7,
      question: "What analytics are available?",
      answer: "The Analytics dashboard provides insights into sales performance, customer behavior, popular products, and revenue trends. You can view data by different time periods and export reports.",
      category: "getting-started"
    },
    {
      id: 8,
      question: "How do I handle returns and refunds?",
      answer: "Returns can be processed through the Orders page. You can issue partial or full refunds, update order status, and communicate with customers about return procedures.",
      category: "orders"
    }
  ];

  const quickLinks = [
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: <Book className="h-5 w-5" />,
      link: "#"
    },
    {
      title: "Community Forum",
      description: "Connect with other vendors",
      icon: <MessageCircle className="h-5 w-5" />,
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Technical integration guides",
      icon: <ExternalLink className="h-5 w-5" />,
      link: "#"
    }
  ];

  const contactOptions = [
    {
      method: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@salesai.com",
      icon: <Mail className="h-5 w-5 text-blue-600" />,
      available: "24/7"
    },
    {
      method: "Phone Support",
      description: "Speak with our support team",
      contact: "+1 (555) 123-4567",
      icon: <Phone className="h-5 w-5 text-green-600" />,
      available: "Mon-Fri 9AM-6PM EST"
    },
    {
      method: "Live Chat",
      description: "Instant help from our team",
      contact: "Available in dashboard",
      icon: <MessageCircle className="h-5 w-5 text-purple-600" />,
      available: "Mon-Fri 9AM-6PM EST"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions, browse our documentation, or get in touch with our support team.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link, index) => (
          <a
            key={index}
            href={link.link}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                {link.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFaq === faq.id ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedFaq === faq.id && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse by category</p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactOptions.map((option, index) => (
            <div key={index} className="text-center p-6 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  {option.icon}
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{option.method}</h3>
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              <p className="font-medium text-gray-900 mb-2">{option.contact}</p>
              <p className="text-xs text-gray-500">{option.available}</p>
              <button className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
                Contact Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <h3 className="font-semibold text-green-900">All Systems Operational</h3>
        </div>
        <p className="text-green-700 text-sm">
          All services are running normally. Last updated: Nov 6, 2024 at 8:00 PM EST
        </p>
        <a href="#" className="text-green-600 hover:text-green-700 text-sm font-medium">
          View Status Page →
        </a>
      </div>
    </div>
  );
}
