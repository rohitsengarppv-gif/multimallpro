import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Grid, List, Tag, Loader2 } from "lucide-react";

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: { public_id: string; url: string } | string | null;
  vendor?: string;
  vendorName?: string;
  role: "vendor" | "admin" | "master-admin";
  parentCategory: string | { _id: string; name: string };
  subcategories?: string[];
  status: "active" | "inactive";
  level: number;
  sortOrder: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  parentCategoryName?: string;
}

interface Category {
  _id: string;
  name: string;
  description?: string;
  status: "active" | "inactive";
}

export default function SubCategoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showModal, setShowModal] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [parentCategoryFilter, setParentCategoryFilter] = useState<string>("all");

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    parentCategory: string;
    status: "active" | "inactive";
  }>({
    name: "",
    description: "",
    parentCategory: "",
    status: "active"
  });

  // Get vendor data from localStorage
  const vendorToken = typeof window !== 'undefined' ? localStorage.getItem("vendorToken") : null;
  const vendorData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("vendorData") || "{}") : {};

  // Fetch categories (parent categories)
  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories?vendorId=${vendorData._id}&role=vendor&status=active`, {
        headers: {
          'Authorization': `Bearer ${vendorToken}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError("Failed to load categories");
      }
    } catch (error) {
      console.error("Fetch categories error:", error);
      setError("Failed to load categories");
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subcategories?vendorId=${vendorData._id}&role=vendor`, {
        headers: {
          'Authorization': `Bearer ${vendorToken}`,
        },
      });
      const result = await response.json();

      if (result.success) {
        setSubCategories(result.data);
        setError("");
      } else {
        setError("Failed to load subcategories");
      }
    } catch (error) {
      console.error("Fetch subcategories error:", error);
      setError("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorToken && vendorData._id) {
      fetchCategories();
      fetchSubCategories();
    }
  }, [vendorToken, vendorData._id]);

  const filteredSubCategories = subCategories.filter(subCategory => {
    const matchesSearch = subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subCategory.description && subCategory.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesParentCategory = parentCategoryFilter === "all" || subCategory.parentCategory === parentCategoryFilter;
    return matchesSearch && matchesParentCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.parentCategory) return;

    try {
      setActionLoading("submit");

      const url = editingSubCategory ? `/api/subcategories/${editingSubCategory._id}` : '/api/subcategories';
      const method = editingSubCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vendorToken}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          parentCategory: formData.parentCategory,
          vendorId: vendorData._id,
          role: "vendor",
          status: formData.status
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowModal(false);
        setEditingSubCategory(null);
        setFormData({ name: "", description: "", parentCategory: "", status: "active" });
        fetchSubCategories(); // Refresh the list
        setError("");
      } else {
        setError(result.message || "Failed to save subcategory");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError("Failed to save subcategory");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      description: subCategory.description || "",
      parentCategory: typeof subCategory.parentCategory === 'object' 
        ? subCategory.parentCategory._id 
        : subCategory.parentCategory,
      status: subCategory.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && confirm('Delete this subcategory? This action cannot be undone.')) {
      try {
        setActionLoading(id);
        const response = await fetch(`/api/subcategories/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${vendorToken}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          fetchSubCategories(); // Refresh the list
          setError("");
        } else {
          setError(result.message || "Failed to delete subcategory");
        }
      } catch (error) {
        console.error("Delete error:", error);
        setError("Failed to delete subcategory");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      setActionLoading(id);
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      const response = await fetch(`/api/subcategories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vendorToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        fetchSubCategories(); // Refresh the list
        setError("");
      } else {
        setError(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status toggle error:", error);
      setError("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sub Categories</h1>
          <p className="text-gray-600 mt-1">
            Manage product sub-categories. {subCategories.filter(s => s.status === 'active').length} active sub-categories.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={loading || !vendorToken}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          Add Sub Category
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{subCategories.length}</div>
          <div className="text-sm text-gray-600">Total Sub Categories</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {subCategories.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600">Active Sub Categories</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {subCategories.reduce((sum, s) => sum + (s.subcategories?.length || 0), 0)}
          </div>
          <div className="text-sm text-gray-600">Sub-Sub Categories</div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sub-categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <select
            value={parentCategoryFilter}
            onChange={(e) => setParentCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Parent Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg ${viewMode === 'cards' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-50'}`}
              title="Card View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-50'}`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Categories Display */}
      {loading ? (
        <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-200 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading subcategories...</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubCategories.map((subCategory) => (
            <div key={subCategory._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow group">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{subCategory.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${subCategory.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{subCategory.description || "No description"}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {typeof subCategory.parentCategory === 'object' 
                      ? subCategory.parentCategory.name 
                      : subCategory.parentCategoryName || subCategory.parentCategory}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{subCategory.subcategories?.length || 0} sub-sub-categories</span>
                  <button
                    onClick={() => toggleStatus(subCategory._id, subCategory.status)}
                    disabled={actionLoading === subCategory._id}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      subCategory.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    } disabled:opacity-50`}
                  >
                    {actionLoading === subCategory._id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      subCategory.status === 'active' ? 'Active' : 'Inactive'
                    )}
                  </button>
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(subCategory)}
                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-1"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subCategory._id)}
                    disabled={actionLoading === subCategory._id}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {actionLoading === subCategory._id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Sub Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Parent Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubCategories.map((subCategory) => (
                  <tr key={subCategory._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{subCategory.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {typeof subCategory.parentCategory === 'object' 
                          ? subCategory.parentCategory.name 
                          : subCategory.parentCategoryName || subCategory.parentCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {subCategory.description || "No description"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">Level {subCategory.level}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(subCategory._id, subCategory.status)}
                        disabled={actionLoading === subCategory._id}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subCategory.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        } disabled:opacity-50`}
                      >
                        {actionLoading === subCategory._id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          subCategory.status === 'active' ? 'Active' : 'Inactive'
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(subCategory.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(subCategory)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(subCategory._id)}
                          disabled={actionLoading === subCategory._id}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Delete"
                        >
                          {actionLoading === subCategory._id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredSubCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Tag className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sub-categories found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingSubCategory ? 'Edit Sub Category' : 'Add New Sub Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                  disabled={actionLoading === "submit"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
                <select
                  value={formData.parentCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                  disabled={actionLoading === "submit"}
                >
                  <option value="">Select a parent category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  disabled={actionLoading === "submit"}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'active' : 'inactive' }))}
                  id="status"
                  disabled={actionLoading === "submit"}
                />
                <label htmlFor="status" className="text-sm text-gray-700">Active</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSubCategory(null);
                    setFormData({ name: "", description: "", parentCategory: "", status: "active" });
                  }}
                  disabled={actionLoading === "submit"}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === "submit"}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === "submit" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingSubCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
