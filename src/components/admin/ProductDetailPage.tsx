"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Package, DollarSign, Loader2, Image as ImageIcon, Tag, Store, Calendar } from "lucide-react";
import Link from "next/link";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku?: string;
  images: { url: string; public_id: string }[];
  category: {
    _id: string;
    name: string;
  };
  vendor: {
    _id: string;
    businessName: string;
    email: string;
    phone?: string;
  };
  status: string;
  featured: boolean;
  tags?: string[];
  specifications?: { key: string; value: string }[];
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailPageProps {
  productId: string;
  onBack?: () => void;
}

export default function ProductDetailPage({ productId, onBack }: ProductDetailPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/routes/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
      } else {
        showMessage('error', data.message || 'Failed to load product');
      }
    } catch (error) {
      console.error('Fetch product error:', error);
      showMessage('error', 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product?.name}"?`)) return;

    try {
      const response = await fetch(`/api/routes/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Product deleted successfully');
        setTimeout(() => router.push('/admin/products'), 1500);
      } else {
        showMessage('error', data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage('error', 'Failed to delete product');
    }
  };

  const handleToggleStatus = async () => {
    if (!product) return;
    const newStatus = product.status === 'active' ? 'inactive' : 'active';

    try {
      const response = await fetch(`/api/routes/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        fetchProduct();
      } else {
        showMessage('error', data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      showMessage('error', 'Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Product not found</p>
        <Link href="/admin/products" className="text-purple-600 hover:underline mt-2 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onBack ? onBack() : router.push('/admin/products')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-1">Product Details</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm ${
              product.status === 'active'
                ? 'border-red-300 text-red-600 hover:bg-red-50'
                : 'border-green-300 text-green-600 hover:bg-green-50'
            }`}
          >
            {product.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          <Link
            href={`/admin/products/${productId}/edit`}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Product Images</h2>
            </div>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image.url}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No images available</div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description || 'No description available'}</p>
          </div>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex items-start gap-4 py-2 border-b border-gray-100 last:border-0">
                    <div className="font-medium text-gray-700 min-w-[150px]">{spec.key}:</div>
                    <div className="text-gray-600">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Info */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Status</div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                product.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : product.status === 'inactive'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {product.status}
              </span>
            </div>

            {product.featured && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Featured Product</div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                  Featured
                </span>
              </div>
            )}

            <div>
              <div className="text-sm text-gray-500 mb-1">SKU</div>
              <div className="text-sm font-medium text-gray-900">{product.sku || 'N/A'}</div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Price</div>
              <div className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</div>
            </div>
            {product.comparePrice && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Compare Price</div>
                <div className="text-lg font-medium text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</div>
                <div className="text-sm text-green-600 font-medium mt-1">
                  Save {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                </div>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Stock Level</div>
              <div className={`text-2xl font-bold ${
                product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {product.stock} units
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Category</h3>
            </div>
            <div className="text-sm font-medium text-gray-900">{product.category?.name || 'N/A'}</div>
          </div>

          {/* Vendor */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Store className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Vendor</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Business Name</div>
                <div className="text-sm font-medium text-gray-900">{product.vendor?.businessName || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-sm text-gray-900">{product.vendor?.email || 'N/A'}</div>
              </div>
              {product.vendor?.phone && (
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="text-sm text-gray-900">{product.vendor.phone}</div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Timestamps</h3>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-gray-500">Created</div>
                <div className="text-sm text-gray-900">{new Date(product.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-sm text-gray-900">{new Date(product.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
