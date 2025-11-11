"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2, Tag, ChevronRight } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { url: string; public_id: string };
  vendor?: {
    _id: string;
    businessName: string;
  };
  vendorName?: string;
  role: string;
  status: string;
  level: number;
  isDefault: boolean;
  subcategories?: Category[];
  parentCategory?: { _id: string; name: string };
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", status: "active" });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      // Pass role=admin to bypass vendor filtering and get all categories
      const response = await fetch('/api/routes/categories?role=admin');
      const data = await response.json();

      console.log('Categories API Response:', data); // Debug log

      if (data.success) {
        // Handle different response structures
        const categoriesData = Array.isArray(data.data) 
          ? data.data 
          : Array.isArray(data.data?.categories) 
          ? data.data.categories 
          : [];
        
        console.log('Categories Data:', categoriesData); // Debug log
        setCategories(categoriesData);
      } else {
        showMessage('error', data.message || 'Failed to load categories');
        setCategories([]);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
      showMessage('error', 'Failed to load categories');
      setCategories([]);
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
      const url = editingCategory
        ? `/api/routes/categories/${editingCategory._id}`
        : '/api/routes/categories';
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `Category ${editingCategory ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", status: "active" });
        fetchCategories();
      } else {
        showMessage('error', data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showMessage('error', 'Operation failed');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/routes/categories/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Category deleted');
        fetchCategories();
      } else {
        showMessage('error', data.message || 'Delete failed');
      }
    } catch (error) {
      showMessage('error', 'Delete failed');
    }
  };

  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(cat =>
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage product categories and subcategories</p>
        </div>
      
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
            <Tag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No categories found</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div key={category._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {category.image?.url ? (
                  <img src={category.image.url} alt={category.name} className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Tag className="h-7 w-7 text-purple-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                    {category.isDefault && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        System
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setFormData({ name: category.name, description: category.description || "", status: category.status });
                    setShowModal(true);
                  }}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category._id, category.name)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{category.description}</p>
            )}
            
            {/* Vendor Info */}
            {category.vendor && !category.isDefault && (
              <div className="mb-2 p-2 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-500">Vendor</p>
                <p className="text-sm font-medium text-gray-900 truncate">{category.vendor.businessName || category.vendorName}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full ${
                  category.role === 'admin' || category.role === 'master-admin' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>
                  {category.role === 'admin' || category.role === 'master-admin' ? 'Admin' : 'Vendor'}
                </span>
                <span className="text-gray-400">Level {category.level}</span>
              </div>
              {category.subcategories && category.subcategories.length > 0 && (
                <span className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  {category.subcategories.length} subs
                </span>
              )}
            </div>
          </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit' : 'Add'} Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
