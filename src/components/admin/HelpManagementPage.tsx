"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2, HelpCircle, Book, MessageCircle, Mail, Phone, ExternalLink } from "lucide-react";

interface HelpContent {
  _id: string;
  type: "faq" | "quickLink" | "contact" | "category";
  
  // FAQ fields
  question?: string;
  answer?: string;
  category?: string;
  
  // Quick Link fields
  title?: string;
  description?: string;
  link?: string;
  icon?: string;
  
  // Contact fields
  method?: string;
  contact?: string;
  available?: string;
  
  // Category fields
  categoryId?: string;
  categoryName?: string;
  
  status: "active" | "inactive";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function HelpManagementPage() {
  const [helpContent, setHelpContent] = useState<HelpContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<HelpContent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    type: "faq" as "faq" | "quickLink" | "contact" | "category",
    question: "",
    answer: "",
    category: "",
    title: "",
    description: "",
    link: "",
    icon: "Book",
    method: "",
    contact: "",
    available: "",
    categoryId: "",
    categoryName: "",
    status: "active" as "active" | "inactive",
    sortOrder: 0
  });

  useEffect(() => {
    fetchHelpContent();
  }, []);

  const fetchHelpContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/routes/help-content');
      const data = await response.json();

      if (data.success) {
        setHelpContent(data.data || []);
      } else {
        showMessage('error', data.message || 'Failed to load help content');
      }
    } catch (error) {
      console.error('Fetch help content error:', error);
      showMessage('error', 'Failed to load help content');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingItem
        ? `/api/routes/help-content/${editingItem._id}`
        : '/api/routes/help-content';

      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', data.message || `Help content ${editingItem ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        fetchHelpContent();
        resetForm();
      } else {
        showMessage('error', data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showMessage('error', 'Failed to save help content');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this help content?')) return;

    try {
      const response = await fetch(`/api/routes/help-content/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Help content deleted successfully');
        fetchHelpContent();
      } else {
        showMessage('error', data.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', 'Failed to delete help content');
    }
  };

  const resetForm = () => {
    setFormData({
      type: "faq",
      question: "",
      answer: "",
      category: "",
      title: "",
      description: "",
      link: "",
      icon: "Book",
      method: "",
      contact: "",
      available: "",
      categoryId: "",
      categoryName: "",
      status: "active",
      sortOrder: 0
    });
    setEditingItem(null);
  };

  const filteredContent = helpContent.filter(item => {
    const matchesSearch = 
      item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const getIconComponent = (iconName: string) => {
    const icons: any = {
      Book: <Book className="h-5 w-5" />,
      MessageCircle: <MessageCircle className="h-5 w-5" />,
      ExternalLink: <ExternalLink className="h-5 w-5" />,
      Mail: <Mail className="h-5 w-5" />,
      Phone: <Phone className="h-5 w-5" />,
      HelpCircle: <HelpCircle className="h-5 w-5" />
    };
    return icons[iconName] || <HelpCircle className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help Content Management</h1>
          <p className="text-gray-600 mt-2">Manage FAQs, quick links, contact options, and categories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add Help Content
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search help content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Types</option>
            <option value="faq">FAQs</option>
            <option value="quickLink">Quick Links</option>
            <option value="contact">Contact Options</option>
            <option value="category">Categories</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredContent.map((item) => (
          <div key={item._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.type === 'faq' ? 'bg-blue-100 text-blue-800' :
                    item.type === 'quickLink' ? 'bg-green-100 text-green-800' :
                    item.type === 'contact' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {item.type === 'faq' ? 'FAQ' :
                     item.type === 'quickLink' ? 'Quick Link' :
                     item.type === 'contact' ? 'Contact' : 'Category'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-500">Order: {item.sortOrder}</span>
                </div>

                {item.type === 'faq' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.question}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.answer}</p>
                    {item.category && (
                      <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        Category: {item.category}
                      </span>
                    )}
                  </div>
                )}

                {item.type === 'quickLink' && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {item.icon && getIconComponent(item.icon)}
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                    {item.link && (
                      <a href={item.link} className="text-xs text-blue-600 hover:underline">
                        {item.link}
                      </a>
                    )}
                  </div>
                )}

                {item.type === 'contact' && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.method}</h3>
                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                    <p className="text-sm font-medium text-gray-900">{item.contact}</p>
                    {item.available && (
                      <p className="text-xs text-gray-500">Available: {item.available}</p>
                    )}
                  </div>
                )}

                {item.type === 'category' && (
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.categoryName}</h3>
                    <p className="text-xs text-gray-500">ID: {item.categoryId}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setFormData({
                      type: item.type,
                      question: item.question || "",
                      answer: item.answer || "",
                      category: item.category || "",
                      title: item.title || "",
                      description: item.description || "",
                      link: item.link || "",
                      icon: item.icon || "Book",
                      method: item.method || "",
                      contact: item.contact || "",
                      available: item.available || "",
                      categoryId: item.categoryId || "",
                      categoryName: item.categoryName || "",
                      status: item.status,
                      sortOrder: item.sortOrder
                    });
                    setShowModal(true);
                  }}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
          <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No help content found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Help Content' : 'Add Help Content'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="faq">FAQ</option>
                  <option value="quickLink">Quick Link</option>
                  <option value="contact">Contact Option</option>
                  <option value="category">Category</option>
                </select>
              </div>

              {/* FAQ Fields */}
              {formData.type === 'faq' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question *
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer *
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., getting-started, products, orders"
                    />
                  </div>
                </>
              )}

              {/* Quick Link Fields */}
              {formData.type === 'quickLink' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link
                    </label>
                    <input
                      type="text"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Book">Book</option>
                      <option value="MessageCircle">Message Circle</option>
                      <option value="ExternalLink">External Link</option>
                      <option value="HelpCircle">Help Circle</option>
                    </select>
                  </div>
                </>
              )}

              {/* Contact Fields */}
              {formData.type === 'contact' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Method *
                    </label>
                    <input
                      type="text"
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Email Support, Phone Support"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact *
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., support@example.com, +1 234 567 8900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available
                    </label>
                    <input
                      type="text"
                      value={formData.available}
                      onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 24/7, Mon-Fri 9AM-6PM"
                    />
                  </div>
                </>
              )}

              {/* Category Fields */}
              {formData.type === 'category' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category ID *
                    </label>
                    <input
                      type="text"
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., getting-started"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={formData.categoryName}
                      onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Getting Started"
                      required
                    />
                  </div>
                </>
              )}

              {/* Common Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-medium"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
