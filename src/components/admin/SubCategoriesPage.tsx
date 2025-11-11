"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2, Tag, Layers } from "lucide-react";

interface SubCategory {
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
  parentCategory: {
    _id: string;
    name: string;
  };
  status: string;
  level: number;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function SubCategoriesPage() {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubCategory | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", status: "active" });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setIsLoading(true);
      // Pass role=admin to bypass vendor filtering and get all subcategories
      const response = await fetch('/api/routes/subcategories?role=admin');
      const data = await response.json();

      console.log('Subcategories API Response:', data); // Debug log

      if (data.success) {
        const subcategoriesData = Array.isArray(data.data) 
          ? data.data 
          : Array.isArray(data.data?.subcategories) 
          ? data.data.subcategories 
          : [];
        
        console.log('Subcategories Data:', subcategoriesData); // Debug log
        setSubcategories(subcategoriesData);
      } else {
        showMessage('error', data.message || 'Failed to load subcategories');
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Fetch subcategories error:', error);
      showMessage('error', 'Failed to load subcategories');
      setSubcategories([]);
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
      const url = editingSubcategory
        ? `/api/routes/subcategories/${editingSubcategory._id}`
        : '/api/routes/subcategories';
      
      const response = await fetch(url, {
        method: editingSubcategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `Subcategory ${editingSubcategory ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        setEditingSubcategory(null);
        setFormData({ name: "", description: "", status: "active" });
        fetchSubcategories();
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
      const response = await fetch(`/api/routes/subcategories/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Subcategory deleted');
        fetchSubcategories();
      } else {
        showMessage('error', data.message || 'Delete failed');
      }
    } catch (error) {
      showMessage('error', 'Delete failed');
    }
  };

  const filteredSubcategories = Array.isArray(subcategories) 
    ? subcategories.filter(sub =>
        sub.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.parentCategory?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Subcategories Management</h1>
          <p className="text-gray-600 mt-2">Manage all subcategories across the platform</p>
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
            placeholder="Search subcategories or parent categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubcategories.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
            <Layers className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No subcategories found</p>
          </div>
        ) : (
          filteredSubcategories.map((subcategory) => (
            <div key={subcategory._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {subcategory.image?.url ? (
                    <img src={subcategory.image.url} alt={subcategory.name} className="h-14 w-14 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Layers className="h-7 w-7 text-indigo-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{subcategory.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        subcategory.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {subcategory.status}
                      </span>
                      {subcategory.isDefault && (
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
                      setEditingSubcategory(subcategory);
                      setFormData({ name: subcategory.name, description: subcategory.description || "", status: subcategory.status });
                      setShowModal(true);
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(subcategory._id, subcategory.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Parent Category */}
              <div className="mb-2 p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-500">Parent Category</p>
                <p className="text-sm font-medium text-gray-900 truncate">{subcategory.parentCategory?.name || 'N/A'}</p>
              </div>

              {subcategory.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{subcategory.description}</p>
              )}
              
              {/* Vendor Info */}
              {subcategory.vendor && !subcategory.isDefault && (
                <div className="mb-2 p-2 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-500">Vendor</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{subcategory.vendor.businessName || subcategory.vendorName}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full ${
                    subcategory.role === 'admin' || subcategory.role === 'master-admin' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                  }`}>
                    {subcategory.role === 'admin' || subcategory.role === 'master-admin' ? 'Admin' : 'Vendor'}
                  </span>
                  <span className="text-gray-400">Level {subcategory.level}</span>
                </div>
                <span className="text-gray-400">{new Date(subcategory.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingSubcategory ? 'Edit' : 'Add'} Subcategory</h2>
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
                  {editingSubcategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
