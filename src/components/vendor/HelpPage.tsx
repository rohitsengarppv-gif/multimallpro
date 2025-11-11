import { useState, useEffect } from "react";
import { Search, Book, MessageCircle, Mail, Phone, ExternalLink, ChevronDown, ChevronRight, Loader2 } from "lucide-react";

interface HelpContent {
  _id: string;
  type: "faq" | "quickLink" | "contact" | "category";
  question?: string;
  answer?: string;
  category?: string;
  title?: string;
  description?: string;
  link?: string;
  icon?: string;
  method?: string;
  contact?: string;
  available?: string;
  categoryId?: string;
  categoryName?: string;
  status: string;
  sortOrder: number;
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [categories, setCategories] = useState([{ id: "all", name: "All Topics" }]);
  const [faqs, setFaqs] = useState<HelpContent[]>([]);
  const [quickLinks, setQuickLinks] = useState<HelpContent[]>([]);
  const [contactOptions, setContactOptions] = useState<HelpContent[]>([]);

  useEffect(() => {
    fetchHelpContent();
  }, []);

  const fetchHelpContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/routes/help-content?status=active');
      const data = await response.json();

      if (data.success) {
        const content = data.data || [];
        
        // Separate content by type
        const faqContent = content.filter((item: HelpContent) => item.type === 'faq');
        const quickLinkContent = content.filter((item: HelpContent) => item.type === 'quickLink');
        const contactContent = content.filter((item: HelpContent) => item.type === 'contact');
        const categoryContent = content.filter((item: HelpContent) => item.type === 'category');

        setFaqs(faqContent);
        setQuickLinks(quickLinkContent);
        setContactOptions(contactContent);
        
        // Build categories list
        const cats = [{ id: "all", name: "All Topics" }];
        categoryContent.forEach((cat: HelpContent) => {
          if (cat.categoryId && cat.categoryName) {
            cats.push({ id: cat.categoryId, name: cat.categoryName });
          }
        });
        setCategories(cats);
      }
    } catch (error) {
      console.error('Failed to fetch help content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getIconComponent = (iconName?: string) => {
    const icons: any = {
      Book: <Book className="h-5 w-5" />,
      MessageCircle: <MessageCircle className="h-5 w-5" />,
      ExternalLink: <ExternalLink className="h-5 w-5" />,
      Mail: <Mail className="h-5 w-5 text-blue-600" />,
      Phone: <Phone className="h-5 w-5 text-green-600" />,
    };
    return icons[iconName || 'Book'] || <Book className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

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
      {quickLinks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <a
              key={link._id}
              href={link.link || "#"}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  {getIconComponent(link.icon)}
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
      )}

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
            <div key={faq._id} className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq._id ? null : faq._id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {expandedFaq === faq._id ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {expandedFaq === faq._id && (
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
      {contactOptions.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option) => (
              <div key={option._id} className="text-center p-6 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {getIconComponent(option.icon)}
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
      )}

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
