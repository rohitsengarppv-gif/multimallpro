import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Grid, List, AlertCircle, CheckCircle, Upload } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    public_id: string;
    url: string;
  };
  vendor?: {
    _id: string;
    businessName: string;
  };
  vendorName?: string;
  role: "vendor" | "admin" | "master-admin";
  parentCategory?: string;
  subcategories: string[];
  status: "active" | "inactive";
  level: number;
  sortOrder: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Upload Modal Component (defined outside to avoid hoisting issues)
const UploadModal = ({
  isUploading,
  setIsUploading,
  uploadProgress,
  formData,
  uploadedImage
}: {
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  uploadProgress: number;
  formData: { image: { public_id: string; url: string } | string | null };
  uploadedImage: File | null;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
      {/* Close button */}
      <button
        onClick={() => setIsUploading(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        disabled={uploadProgress >= 90} // Prevent closing during final stages
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center">
        {/* Animated Upload Icon */}
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto">
            {uploadProgress < 100 ? (
              <>
                <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-4 border-orange-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-orange-600 animate-bounce" />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600 animate-pulse" />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {uploadProgress < 100 ? 'Uploading Image' : 'Upload Complete! 🎉'}
        </h3>
        <p className="text-gray-600 mb-6">
          {uploadProgress < 100
            ? (uploadedImage ? `Uploading ${uploadedImage.name}...` : 'Preparing upload...')
            : 'Your image has been successfully uploaded to Cloudinary!'
          }
        </p>

        {/* Show preview when upload is complete */}
        {uploadProgress === 100 && formData.image && (
          <div className="mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <h4 className="text-sm font-medium text-gray-900 mb-3 text-center">Upload Complete!</h4>
              <img
                src={typeof formData.image === 'object' ? formData.image.url : formData.image}
                alt="Uploaded category image"
                className="w-full h-32 object-contain rounded border bg-white mx-auto"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"%3E%3Crect width="300" height="150" fill="%23f3f4f6"/%3E%3Ctext x="150" y="75" font-family="Arial, sans-serif" font-size="12" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EPreview Unavailable%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">{uploadProgress}% complete</p>
        </div>

        {/* File Info */}
        {uploadedImage && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-gray-900">{uploadedImage.name}</p>
            <p className="text-xs text-gray-600">
              {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  </div>
);

export default function CategoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: { public_id: string; url: string } | string | null;
    parentCategory: string;
    status: "active" | "inactive";
  }>({
    name: "",
    description: "",
    image: null,
    parentCategory: "",
    status: "active"
  });

  // Get vendor data from localStorage
  const vendorToken = typeof window !== 'undefined' ? localStorage.getItem("vendorToken") : null;
  const vendorData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("vendorData") || "{}") : {};

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories?vendorId=${vendorData._id}&role=vendor&status=active`);

      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        setError(result.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorData._id) {
      fetchCategories();
    }
  }, [vendorData._id]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (category.vendorName && category.vendorName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(editingCategory ? editingCategory._id : "create");

    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const payload = {
        ...formData,
        vendorId: vendorData._id,
        role: "vendor"
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${vendorToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: "", description: "", image: null, parentCategory: "", status: "active" });
        fetchCategories(); // Refresh the list
        setError("");
      } else {
        setError(result.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setError("Failed to save category");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      image: category.image || null, // Convert undefined to null
      parentCategory: category.parentCategory || "",
      status: category.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== 'undefined' && confirm('Delete this category? This action cannot be undone.')) {
      try {
        setActionLoading(id);
        const response = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${vendorToken}`,
          },
          body: JSON.stringify({
            vendorId: vendorData._id,
            role: "vendor"
          }),
        });

        const result = await response.json();

        if (result.success) {
          fetchCategories(); // Refresh the list
          setError("");
        } else {
          setError(result.message || "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        setError("Failed to delete category");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const toggleStatus = async (category: Category) => {
    try {
      setActionLoading(category._id);
      const newStatus = category.status === "active" ? "inactive" : "active";

      const response = await fetch(`/api/categories/${category._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${vendorToken}`,
        },
        body: JSON.stringify({
          status: newStatus,
          vendorId: vendorData._id,
          role: "vendor"
        }),
      });

      const result = await response.json();

      if (result.success) {
        fetchCategories(); // Refresh the list
        setError("");
      } else {
        setError(result.message || "Failed to update category status");
      }
    } catch (error) {
      console.error("Error updating category status:", error);
      setError("Failed to update category status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedImage(file);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('files', file);
      formDataUpload.append('folder', 'category-images');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // Store the uploaded file info in form data
        setFormData(prev => ({
          ...prev,
          image: result.data[0] // Store the full image object with public_id and url
        }));

        setUploadProgress(100);

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadedImage(null);
        }, 500);
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadedImage(null);
      alert('Upload failed. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image type (JPG, JPEG, PNG, WebP)');
        return;
      }

      // Validate file size (5MB limit for category images)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      handleImageUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Modal */}
      {isUploading && (
        <UploadModal
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          uploadProgress={uploadProgress}
          formData={formData}
          uploadedImage={uploadedImage}
        />
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">
            Manage product categories. {categories.filter(c => c.status === "active").length} active categories.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
          <div className="text-sm text-gray-600">Total Categories</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {categories.filter(c => c.status === "active").length}
          </div>
          <div className="text-sm text-gray-600">Active Categories</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {categories.filter(c => c.isDefault).length}
          </div>
          <div className="text-sm text-gray-600">System Categories</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {categories.filter(c => c.vendor?._id === vendorData._id).length}
          </div>
          <div className="text-sm text-gray-600">My Categories</div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
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

      {/* Categories Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group overflow-hidden">
              {/* Image Container - Enhanced */}
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={typeof category.image === 'object' ? category.image.url : category.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {category.isDefault && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                      System
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-md ${
                    category.status === "active"
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {category.status === "active" ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Action Buttons */}
                {!category.parentCategory && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(category)}
                      disabled={actionLoading === category._id}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white disabled:opacity-50 transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      disabled={actionLoading === category._id}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white disabled:opacity-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Category Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    Level {category.level}
                  </span>
                  <span>
                    {category.subcategories?.length || 0} subcategories
                  </span>
                </div>

                {/* Vendor Info */}
                {category.vendorName && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-xs">
                        {category.vendorName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>by {category.vendorName}</span>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => toggleStatus(category)}
                    disabled={actionLoading === category._id}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      category.status === "active"
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    } disabled:opacity-50`}
                  >
                    {actionLoading === category._id ? "..." : (category.status === "active" ? 'Active' : 'Inactive')}
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Level</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Vendor</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={typeof category.image === 'object' ? category.image.url : category.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='20' y='20' font-family='Arial, sans-serif' font-size='8' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo%3C/text%3E%3C/svg%3E"}
                          alt={category.name}
                          className="w-10 h-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%23f3f4f6'/%3E%3Ctext x='20' y='20' font-family='Arial, sans-serif' font-size='8' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div>
                          <div className="font-medium text-gray-900">{category.name}</div>
                          {category.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">System</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {category.description || "No description"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{category.level}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {category.vendorName || "System"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(category)}
                        disabled={actionLoading === category._id}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          category.status === "active" ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        } disabled:opacity-50`}
                      >
                        {actionLoading === category._id ? "..." : (category.status === "active" ? 'Active' : 'Inactive')}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          disabled={actionLoading === category._id}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={actionLoading === category._id}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400" />
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

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header - Fixed */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-white">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingCategory(null);
                  setFormData({ name: "", description: "", image: "", parentCategory: "", status: "active" });
                  setError("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                disabled={actionLoading !== null}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                        disabled={actionLoading === "create"}
                        placeholder="Enter category name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        disabled={actionLoading === "create"}
                        placeholder="Describe this category..."
                      />
                    </div>

                    {!editingCategory && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
                        <select
                          value={formData.parentCategory}
                          onChange={(e) => setFormData(prev => ({ ...prev, parentCategory: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          disabled={actionLoading === "create"}
                        >
                          <option value="">No parent (Main Category)</option>
                          {categories
                            .filter(cat => cat.status === "active" && !cat.parentCategory)
                            .map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    )}

                    {editingCategory && (
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.status === "active"}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            status: e.target.checked ? "active" : "inactive"
                          }))}
                          id="status"
                          disabled={actionLoading === editingCategory._id}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                        />
                        <label htmlFor="status" className="text-sm text-gray-700 font-medium">Active Category</label>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center">
                      {formData.image ? (
                        <div className="space-y-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 text-center">Current Image</h4>
                            <img
                              src={typeof formData.image === 'object' ? formData.image.url : formData.image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"%3E%3Crect width="300" height="150" fill="%23f3f4f6"/%3E%3Ctext x="150" y="75" font-family="Arial, sans-serif" font-size="12" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EPreview Unavailable%3C/text%3E%3C/svg%3E'}
                              alt="Category preview"
                              className="w-full h-24 md:h-32 object-contain rounded border bg-white mx-auto"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"%3E%3Crect width="300" height="150" fill="%23f3f4f6"/%3E%3Ctext x="150" y="75" font-family="Arial, sans-serif" font-size="12" fill="%239ca3af" text-anchor="middle" dominant-baseline="middle"%3EPreview Unavailable%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              className="hidden"
                              id="categoryImage"
                              onChange={handleImageChange}
                              disabled={isUploading}
                            />
                            <label
                              htmlFor="categoryImage"
                              className={`flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                                isUploading ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              {isUploading ? 'Uploading...' : 'Replace Image'}
                            </label>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                              className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">
                            Upload a category image
                          </p>
                          <p className="text-xs text-gray-500 mb-4">
                            PNG, JPG, JPEG, WebP up to 5MB
                          </p>
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            id="categoryImage"
                            onChange={handleImageChange}
                            disabled={isUploading}
                          />
                          <label
                            htmlFor="categoryImage"
                            className={`inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer w-full ${
                              isUploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {isUploading ? 'Uploading...' : 'Choose Image'}
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 bg-gray-50 -mx-4 md:-mx-6 px-4 md:px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCategory(null);
                      setFormData({ name: "", description: "", image: null, parentCategory: "", status: "active" });
                      setError("");
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                    disabled={actionLoading !== null}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading !== null}
                    className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center"
                  >
                    {actionLoading === "create" || (editingCategory && actionLoading === editingCategory._id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingCategory ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingCategory ? 'Update Category' : 'Create Category'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
