import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Search, Grid, List, AlertCircle, Plus, Package } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  sku: string;
  stock: number;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
  };
  status: "draft" | "pending" | "published";
  visibility: "public" | "private" | "hidden";
  isActive: boolean;
  isFeatured: boolean;
  mainImage?: {
    url: string;
  };
  images: Array<{
    url: string;
  }>;
  category?: {
    name: string;
  };
  subcategory?: {
    name: string;
  };
  vendor?: {
    businessName: string;
  };
  createdAt: string;
}

interface ProductsPageProps {
  onNavigateToAddProduct?: () => void;
  onNavigateToEditProduct?: (productId: string) => void;
  onNavigateToViewProduct?: (productId: string) => void;
  onDeleteProduct?: (productId: string) => void;
}

export default function ProductsPage({ onNavigateToAddProduct, onNavigateToEditProduct, onNavigateToViewProduct, onDeleteProduct }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Get vendor data from localStorage
  const vendorData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vendorData') || '{}') : {};

  const fetchProducts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        vendor: vendorData._id || '',
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/routes/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setTotalProducts(data.data.pagination.total);
        setCurrentPage(page);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(1, searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    // If onDeleteProduct callback is provided, use it (for admin dashboard)
    if (onDeleteProduct) {
      onDeleteProduct(productId);
      return;
    }

    try {
      setActionLoading(productId);

      const response = await fetch(`/api/routes/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setProducts(products.filter(p => p._id !== productId));
        setTotalProducts(prev => prev - 1);
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      alert('Failed to delete product');
      console.error('Error deleting product:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const toggleStatus = async (product: Product) => {
    try {
      setActionLoading(product._id);

      const response = await fetch(`/api/routes/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !product.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProducts(products.map(p =>
          p._id === product._id
            ? { ...p, isActive: !p.isActive }
            : p
        ));
      } else {
        alert(data.message || 'Failed to update product status');
      }
    } catch (err) {
      alert('Failed to update product status');
      console.error('Error updating product status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(totalProducts / 20);
  const startIndex = (currentPage - 1) * 20;
  const endIndex = startIndex + 20;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory. {totalProducts} total products.
          </p>
        </div>
        <button
          onClick={onNavigateToAddProduct}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Add Product
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
          <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
          <div className="text-sm text-gray-600">Total Products</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {products.filter(p => p.isActive).length}
          </div>
          <div className="text-sm text-gray-600">Active Products</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {products.filter(p => p.status === 'published').length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {products.filter(p => p.stock <= (p.inventory?.lowStockThreshold || 5)).length}
          </div>
          <div className="text-sm text-gray-600">Low Stock</div>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
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

      {/* Products Display */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No products found</p>
          <button
            onClick={onNavigateToAddProduct}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Add Your First Product
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow group overflow-hidden">
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={product.mainImage?.url || product.images[0]?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                    alt={product.name}
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
                  {product.isFeatured && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                      Featured
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shadow-md ${
                    product.status === "published"
                      ? 'bg-green-500 text-white'
                      : product.status === "pending"
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.status === "published" ? 'Published' : product.status === "pending" ? 'Pending' : 'Draft'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => onNavigateToViewProduct?.(product._id)}
                    disabled={actionLoading === product._id}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-blue-50 disabled:opacity-50 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => onNavigateToEditProduct?.(product._id)}
                    disabled={actionLoading === product._id}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-orange-50 disabled:opacity-50 transition-colors"
                    title="Edit Product"
                  >
                    <Edit className="h-4 w-4 text-orange-600" />
                  </button>
                  <button
                    onClick={() => toggleStatus(product)}
                    disabled={actionLoading === product._id}
                    className={`p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-${product.isActive ? 'red' : 'green'}-50 disabled:opacity-50 transition-colors`}
                    title={product.isActive ? 'Deactivate Product' : 'Activate Product'}
                  >
                    {product.isActive ? (
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={actionLoading === product._id}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-red-50 disabled:opacity-50 transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    SKU: {product.sku}
                  </p>
                </div>

                {/* Product Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                    {product.category?.name || 'No Category'}
                  </span>
                  <span>
                    {product.inventory?.quantity || product.stock} in stock
                  </span>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <p className="text-lg font-bold text-gray-900">
                    ${product.price}
                    {product.comparePrice && product.comparePrice > product.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${product.comparePrice}
                      </span>
                    )}
                  </p>
                </div>

                {/* Stock Progress */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Stock</span>
                    <span className="text-gray-600">{product.inventory?.quantity || product.stock}/{product.inventory?.quantity || product.stock}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        (product.inventory?.quantity || product.stock) <= (product.inventory?.lowStockThreshold || 5)
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${((product.inventory?.quantity || product.stock) / Math.max(product.inventory?.quantity || product.stock, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Vendor Info */}
                {product.vendor?.businessName && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-xs">
                        {product.vendor.businessName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>by {product.vendor.businessName}</span>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(product)}
                      disabled={actionLoading === product._id}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        product.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } disabled:opacity-50`}
                    >
                      {actionLoading === product._id ? "..." : (product.isActive ? 'Active' : 'Inactive')}
                    </button>
                  </div>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Product info</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Stock Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img className="h-12 w-12 rounded-lg object-cover" src={product.mainImage?.url || product.images[0]?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial, sans-serif' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3C/svg%3E"} alt={product.name} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${product.price}
                      {product.comparePrice && product.comparePrice > product.price && (
                        <div className="text-xs text-gray-500 line-through">
                          ${product.comparePrice}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 mb-1">{product.inventory?.quantity || product.stock}</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (product.inventory?.quantity || product.stock) <= (product.inventory?.lowStockThreshold || 5)
                              ? 'bg-red-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${((product.inventory?.quantity || product.stock) / Math.max(product.inventory?.quantity || product.stock, 1)) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{product.inventory?.quantity || product.stock} units</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{product.category?.name || 'No Category'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          product.status === "published"
                            ? 'text-green-800'
                            : product.status === "pending"
                            ? 'text-yellow-800'
                            : 'text-gray-800'
                        }`}>
                          {product.status === "published" ? 'Published' : product.status === "pending" ? 'Pending' : 'Draft'}
                        </span>
                        <div className={`w-10 h-6 rounded-full p-1 ${product.isActive ? 'bg-green-500' : 'bg-gray-300'} transition-colors`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${product.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigateToViewProduct?.(product._id)}
                          disabled={actionLoading === product._id}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => onNavigateToEditProduct?.(product._id)}
                          disabled={actionLoading === product._id}
                          className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4 text-orange-600" />
                        </button>
                        <button
                          onClick={() => toggleStatus(product)}
                          disabled={actionLoading === product._id}
                          className={`p-1.5 hover:bg-${product.isActive ? 'red' : 'green'}-50 rounded-lg transition-colors disabled:opacity-50`}
                          title={product.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {product.isActive ? (
                            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={actionLoading === product._id}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, totalProducts)} of {totalProducts} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchProducts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchProducts(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
