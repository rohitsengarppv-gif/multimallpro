"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2, Percent, Calendar } from "lucide-react";

interface Discount {
  _id: string;
  code: string;
  name?: string;
  description?: string;
  type: string; // percentage | fixed | shipping
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  status: string;
  vendor?: {
    _id: string;
    businessName: string;
    email: string;
  };
  createdBy?: string;
  createdAt: string;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchase: 0,
    maxDiscount: 0,
    startDate: "",
    endDate: "",
    usageLimit: 0,
    status: "active"
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/routes/discounts');
      const data = await response.json();

      console.log('Discounts API Response:', data);

      if (data.success) {
        // Handle different response structures
        const discountsData = Array.isArray(data.data) 
          ? data.data 
          : Array.isArray(data.data?.discounts) 
          ? data.data.discounts 
          : [];
        
        console.log('Discounts Data:', discountsData);
        console.log('Sample Discount:', discountsData[0]);
        setDiscounts(discountsData);
      } else {
        showMessage('error', data.message || 'Failed to load discounts');
        setDiscounts([]);
      }
    } catch (error) {
      console.error('Fetch discounts error:', error);
      showMessage('error', 'Failed to load discounts');
      setDiscounts([]);
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
      const url = editingDiscount
        ? `/api/routes/discounts/${editingDiscount._id}`
        : '/api/routes/discounts';
      
      const response = await fetch(url, {
        method: editingDiscount ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showMessage('success', `Discount ${editingDiscount ? 'updated' : 'created'} successfully`);
        setShowModal(false);
        setEditingDiscount(null);
        resetForm();
        fetchDiscounts();
      } else {
        showMessage('error', data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showMessage('error', 'Operation failed');
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete discount code "${code}"?`)) return;

    try {
      const response = await fetch(`/api/routes/discounts/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        showMessage('success', 'Discount deleted');
        fetchDiscounts();
      } else {
        showMessage('error', data.message || 'Delete failed');
      }
    } catch (error) {
      showMessage('error', 'Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      minPurchase: 0,
      maxDiscount: 0,
      startDate: "",
      endDate: "",
      usageLimit: 0,
      status: "active"
    });
  };

  const filteredDiscounts = Array.isArray(discounts) 
    ? discounts.filter(discount =>
        discount.code?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Discounts & Coupons</h1>
          <p className="text-gray-600 mt-2">Manage discount codes and promotional offers</p>
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
            placeholder="Search discount codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Discounts Table - Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredDiscounts.map((discount) => (
              <tr key={discount._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-mono font-bold text-purple-600">{discount.code}</div>
                  {discount.description && (
                    <div className="text-xs text-gray-500">{discount.description}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {discount.vendor ? (
                    <div>
                      <div className="text-sm font-medium text-gray-900">{discount.vendor.businessName}</div>
                      <div className="text-xs text-gray-500">{discount.vendor.email}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">System</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                    {discount.type || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {discount.type === 'percentage' ? `${discount.value}%` : discount.type === 'fixed' ? `₹${discount.value}` : 'Free Shipping'}
                  </div>
                  {discount.minOrderAmount && discount.minOrderAmount > 0 && (
                    <div className="text-xs text-gray-500">Min: ₹{discount.minOrderAmount}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    {discount.usageCount || 0} / {discount.usageLimit || '∞'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {new Date(discount.startDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    to {new Date(discount.endDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    discount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {discount.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingDiscount(discount);
                        setFormData({
                          code: discount.code,
                          description: discount.description || "",
                          discountType: discount.type,
                          discountValue: discount.value,
                          minPurchase: discount.minOrderAmount || 0,
                          maxDiscount: discount.maxDiscount || 0,
                          startDate: discount.startDate.split('T')[0],
                          endDate: discount.endDate.split('T')[0],
                          usageLimit: discount.usageLimit || 0,
                          status: discount.status
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(discount._id, discount.code)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Discounts Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredDiscounts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
            <Percent className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No discounts found</p>
          </div>
        ) : (
          filteredDiscounts.map((discount) => (
            <div key={discount._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-mono font-bold text-purple-600 text-lg">{discount.code}</h3>
                  {discount.description && (
                    <p className="text-sm text-gray-600 mt-1">{discount.description}</p>
                  )}
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  discount.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {discount.status}
                </span>
              </div>

              {discount.vendor && (
                <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-500">Vendor</p>
                  <p className="font-medium text-gray-900 text-sm">{discount.vendor.businessName}</p>
                  <p className="text-xs text-gray-600">{discount.vendor.email}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium text-gray-900 capitalize">{discount.type || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Value:</span>
                  <p className="font-bold text-purple-600">
                    {discount.type === 'percentage' ? `${discount.value}%` : discount.type === 'fixed' ? `₹${discount.value}` : 'Free Shipping'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Usage:</span>
                  <p className="font-medium text-gray-900">
                    {discount.usageCount || 0} / {discount.usageLimit || '∞'}
                  </p>
                </div>
                {discount.minOrderAmount && discount.minOrderAmount > 0 && (
                  <div>
                    <span className="text-gray-500">Min Purchase:</span>
                    <p className="font-medium text-gray-900">₹{discount.minOrderAmount}</p>
                  </div>
                )}
              </div>

              <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Valid Period</p>
                <p className="text-sm text-gray-900">
                  {new Date(discount.startDate).toLocaleDateString()} - {new Date(discount.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingDiscount(discount);
                    setFormData({
                      code: discount.code,
                      description: discount.description || "",
                      discountType: discount.type,
                      discountValue: discount.value,
                      minPurchase: discount.minOrderAmount || 0,
                      maxDiscount: discount.maxDiscount || 0,
                      startDate: discount.startDate.split('T')[0],
                      endDate: discount.endDate.split('T')[0],
                      usageLimit: discount.usageLimit || 0,
                      status: discount.status
                    });
                    setShowModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 font-medium"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(discount._id, discount.code)}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
            <h2 className="text-xl font-bold mb-4">{editingDiscount ? 'Edit' : 'Create'} Discount</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"
                    required
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
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Value</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Purchase (₹)</label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  {editingDiscount ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
