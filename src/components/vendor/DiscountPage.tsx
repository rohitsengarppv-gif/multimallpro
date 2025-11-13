import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Copy, Percent, Calendar, Users, Eye, Grid, List, X } from "lucide-react";

type DiscountType = "percentage" | "fixed" | "shipping";
type DiscountStatus = "active" | "expired" | "draft" | "paused" | "pending";

interface Discount {
  _id?: string;
  id?: number;
  code: string;
  name: string;
  type: DiscountType;
  value: number;
  status: DiscountStatus;
  usageCount: number;
  usageLimit: number | null;
  startDate: string;
  endDate: string;
  minOrderAmount: number;
  description: string;
  image?: string;
}

export default function DiscountPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [discounts, setDiscounts] = useState<Discount[]>([]);

  // Get vendor data from localStorage
  const vendorData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vendorData') || '{}') : {};

  // Fetch discounts on component mount
  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
    fetchCategories();
  }, [statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams({
        vendor: vendorData._id || '',
        limit: '100',
      });
      const response = await fetch(`/api/routes/products?${params}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const params = new URLSearchParams({
        vendorId: vendorData._id || '',
        role: vendorData.role || 'vendor',
        status: 'active',
      });
      const response = await fetch(`/api/categories?${params}`);
      const data = await response.json();
      if (data.success || Array.isArray(data?.data)) {
        setCategories(Array.isArray(data?.data) ? data.data : []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        vendor: vendorData._id || '',
        status: statusFilter,
      });

      const response = await fetch(`/api/routes/discounts?${params}`);
      const data = await response.json();
      
      console.log('API Response:', data);
      console.log('Discounts array:', data.data);

      if (data.success && Array.isArray(data.data)) {
        console.log('Setting discounts:', data.data.length, 'items');
        setDiscounts(data.data);
      } else {
        setDiscounts([]);
        console.warn('Invalid discounts data received:', data);
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setDiscounts([]); // Ensure discounts is always an array
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "percentage" as DiscountType,
    value: "",
    status: "draft" as DiscountStatus,
    usageCount: "0",
    usageLimit: "",
    startDate: "",
    endDate: "",
    minOrderAmount: "",
    description: "",
    image: "",
    applicableProducts: [] as string[],
    applicableCategories: [] as string[],
    firstTimeCustomersOnly: false,
  });

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      type: "percentage",
      value: "",
      status: "draft",
      usageCount: "0",
      usageLimit: "",
      startDate: "",
      endDate: "",
      minOrderAmount: "",
      description: "",
      image: "",
      applicableProducts: [],
      applicableCategories: [],
      firstTimeCustomersOnly: false,
    });
    setEditingDiscount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        type: formData.type,
        value: Number(formData.value) || 0,
        status: formData.status,
        usageCount: Number(formData.usageCount) || 0,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        startDate: formData.startDate,
        endDate: formData.endDate,
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        description: formData.description.trim(),
        image: formData.image,
        applicableProducts: formData.applicableProducts,
        applicableCategories: formData.applicableCategories,
        firstTimeCustomersOnly: formData.firstTimeCustomersOnly,
        vendor: vendorData._id,
      };

      const url = editingDiscount ? `/api/routes/discounts/${editingDiscount._id}` : '/api/routes/discounts';
      const method = editingDiscount ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message || 'Discount saved successfully!');
        setShowModal(false);
        resetForm();
        fetchDiscounts();
      } else {
        alert(result.message || 'Failed to save discount');
      }
    } catch (error) {
      console.error('Error saving discount:', error);
      alert('Failed to save discount');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      name: discount.name,
      type: discount.type,
      value: discount.value.toString(),
      status: discount.status,
      usageCount: discount.usageCount.toString(),
      usageLimit: discount.usageLimit?.toString() || "",
      startDate: discount.startDate,
      endDate: discount.endDate,
      minOrderAmount: discount.minOrderAmount.toString(),
      description: discount.description,
      image: typeof discount.image === 'string' ? discount.image : (discount as any).image?.url || "",
      applicableProducts: (discount as any).applicableProducts || [],
      applicableCategories: (discount as any).applicableCategories || [],
      firstTimeCustomersOnly: (discount as any).firstTimeCustomersOnly || false,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('files', file);
      formDataUpload.append('folder', 'discounts');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success && result.data[0]) {
        setFormData(prev => ({ ...prev, image: result.data[0].url }));
      } else {
        // Fallback to base64 if Cloudinary fails
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (result && typeof result === "string") {
            setFormData(prev => ({ ...prev, image: result }));
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === "string") {
          setFormData(prev => ({ ...prev, image: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined" && !confirm("Delete this discount?")) return;

    try {
      const response = await fetch(`/api/routes/discounts/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Discount deleted successfully!');
        fetchDiscounts();
        if (selectedDiscount?._id === id) {
          setSelectedDiscount(null);
        }
      } else {
        alert(result.message || 'Failed to delete discount');
      }
    } catch (error) {
      console.error('Error deleting discount:', error);
      alert('Failed to delete discount');
    }
  };

  const handleCopy = (code: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      alert(`Copied code ${code}`);
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "expired": return "bg-red-100 text-red-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "percentage": return <Percent className="h-4 w-4" />;
      case "fixed": return <span className="text-sm font-bold">₹</span>;
      case "shipping": return <span className="text-xs font-bold">FREE</span>;
      default: return <Percent className="h-4 w-4" />;
    }
  };

  const formatValue = (type: string, value: number) => {
    switch (type) {
      case "percentage": return `${value}%`;
      case "fixed": return `₹${value}`;
      case "shipping": return "Free Shipping";
      default: return value;
    }
  };

  const filteredDiscounts = (discounts || []).filter(discount => {
    const matchesSearch = discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discount.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || discount.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log('Total discounts:', discounts?.length || 0);
  console.log('Filtered discounts:', filteredDiscounts.length);
  console.log('Search term:', searchTerm);
  console.log('Status filter:', statusFilter);

  const activeDiscounts = (discounts || []).filter(d => d.status === 'active').length;
  const totalUsage = (discounts || []).reduce((sum, d) => sum + d.usageCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-600 mt-1">
            Create and manage discount codes for your customers. {activeDiscounts} active discounts.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 w-fit"
        >
          <Plus className="h-4 w-4" />
          Create Discount
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Percent className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{activeDiscounts}</div>
              <div className="text-sm text-gray-600">Active Discounts</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalUsage}</div>
              <div className="text-sm text-gray-600">Total Usage</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{discounts.length}</div>
              <div className="text-sm text-gray-600">Total Discounts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search discount codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 rounded-lg ${viewMode === "cards" ? "bg-orange-100 text-orange-600" : "hover:bg-gray-50"}`}
                title="Card View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg ${viewMode === "table" ? "bg-orange-100 text-orange-600" : "hover:bg-gray-50"}`}
                title="Table View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Discounts List */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiscounts.map((discount) => (
            <div key={discount._id || discount.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow p-4 space-y-4">
              {(discount.image || (discount as any).image?.url) && (
                <img
                  src={typeof discount.image === 'string' ? discount.image : (discount as any).image?.url || ''}
                  alt={discount.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    {getTypeIcon(discount.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{discount.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{discount.code}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(discount.status)}`}>
                  {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                </span>
              </div>

              <p className="text-sm text-gray-600">{discount.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Discount</p>
                  <p className="font-semibold text-gray-900">{formatValue(discount.type, discount.value)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Minimum Order</p>
                  <p className="font-semibold text-gray-900">₹{discount.minOrderAmount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Usage</p>
                  <p className="font-semibold text-gray-900">
                    {discount.usageCount}{discount.usageLimit ? `/${discount.usageLimit}` : ""}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Valid Until</p>
                  <p className="font-semibold text-gray-900">{discount.endDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(discount.code)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy Code
                </button>
                <button
                  onClick={() => setSelectedDiscount(discount)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(discount)}
                  className="flex-1 bg-orange-500 text-white px-3 py-2 rounded-lg hover:bg-orange-600 text-sm flex items-center justify-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(discount._id || discount.id?.toString() || '')}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 text-sm flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Code</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Discount</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Usage</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Valid Period</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDiscounts.map((discount) => (
                <tr key={discount._id || discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                    {(discount.image || (discount as any).image?.url) ? (
                      <img
                        src={typeof discount.image === 'string' ? discount.image : (discount as any).image?.url || ''}
                        alt={discount.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="p-2 bg-orange-100 rounded-lg">
                        {getTypeIcon(discount.type)}
                      </div>
                    )}
                    <div>
                      <div className="font-mono font-medium text-gray-900">{discount.code}</div>
                      <div className="text-sm text-gray-500">{discount.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-lg font-bold text-orange-600">{formatValue(discount.type, discount.value)}</div>
                      <div className="text-sm text-gray-500">Min: ₹{discount.minOrderAmount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {discount.usageCount}{discount.usageLimit ? `/${discount.usageLimit}` : ''}
                      </div>
                      {discount.usageLimit && (
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(discount.usageCount / discount.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(discount.status)}`}>
                      {discount.status.charAt(0).toUpperCase() + discount.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{discount.startDate}</div>
                      <div className="text-gray-500">to {discount.endDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(discount.code)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Copy Code"
                      >
                        <Copy className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => setSelectedDiscount(discount)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleEdit(discount)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(discount._id || discount.id?.toString() || '')}
                        className="p-1 hover:bg-gray-100 rounded"
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

      {filteredDiscounts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Percent className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No discounts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedDiscount && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center md:justify-center z-50">
          <div className="bg-white w-full md:max-w-xl md:rounded-2xl rounded-t-2xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDiscount.name}</h2>
                <p className="text-gray-500 font-mono">{selectedDiscount.code}</p>
              </div>
              <button
                onClick={() => setSelectedDiscount(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              <div className="space-y-1">
                <p className="text-gray-500">Discount Type</p>
                <p className="font-semibold text-gray-900 capitalize">{selectedDiscount.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Value</p>
                <p className="font-semibold text-gray-900">{formatValue(selectedDiscount.type, selectedDiscount.value)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedDiscount.status)}`}>
                  {selectedDiscount.status}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Usage</p>
                <p className="font-semibold text-gray-900">
                  {selectedDiscount.usageCount}{selectedDiscount.usageLimit ? `/${selectedDiscount.usageLimit}` : ""}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Validity</p>
                <p className="font-semibold text-gray-900">{selectedDiscount.startDate} – {selectedDiscount.endDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500">Minimum Order</p>
                <p className="font-semibold text-gray-900">${selectedDiscount.minOrderAmount}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
              {selectedDiscount.description}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 mt-6">
              <button
                onClick={() => handleCopy(selectedDiscount.code)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center gap-2 justify-center"
              >
                <Copy className="h-4 w-4" /> Copy Code
              </button>
              <button
                onClick={() => {
                  handleEdit(selectedDiscount);
                  setSelectedDiscount(null);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm flex items-center gap-2 justify-center"
              >
                <Edit className="h-4 w-4" /> Edit Discount
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingDiscount ? "Edit Discount" : "Create Discount"}
                </h2>
                <p className="text-gray-500 text-sm">
                  {editingDiscount ? "Update the discount details" : "Create a new discount code for your store"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                    placeholder="WELCOME20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Launch Day Discount"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DiscountType }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder={formData.type === "percentage" ? "20" : "50"}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderAmount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as DiscountStatus }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending">Pending Approval</option>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Leave blank for unlimited"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Usage</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.usageCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageCount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Promo Image</label>
                  <label className="w-full h-28 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-orange-500 text-sm text-gray-500">
                    {formData.image ? (
                      <img src={formData.image} alt="Discount" className="h-24 object-cover rounded" />
                    ) : (
                      <>
                        <span>Click to upload</span>
                        <span className="text-xs text-gray-400">PNG or JPG, max 2MB</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                      className="mt-2 text-xs text-red-500 hover:underline"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>

              {/* Applicable Products */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Products (Optional)
                  <span className="text-xs text-gray-500 ml-2">Leave empty for all products</span>
                </label>
                <select
                  multiple
                  value={formData.applicableProducts}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, applicableProducts: selected }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
                >
                  {loadingProducts ? (
                    <option disabled>Loading products...</option>
                  ) : (
                    products.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - ₹{product.price}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple products</p>
              </div>

              {/* Applicable Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Categories (Optional)
                  <span className="text-xs text-gray-500 ml-2">Leave empty for all categories</span>
                </label>
                <select
                  multiple
                  value={formData.applicableCategories}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFormData(prev => ({ ...prev, applicableCategories: selected }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
                >
                  {loadingCategories ? (
                    <option disabled>Loading categories...</option>
                  ) : (
                    categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
              </div>

              {/* First Time Customers Only */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="firstTimeCustomersOnly"
                  checked={formData.firstTimeCustomersOnly}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstTimeCustomersOnly: e.target.checked }))}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="firstTimeCustomersOnly" className="flex-1 cursor-pointer">
                  <span className="block text-sm font-medium text-gray-900">First-Time Customers Only</span>
                  <span className="block text-xs text-gray-500">This discount can only be used by customers making their first purchase</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe the discount details..."
                />
              </div>

              <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (editingDiscount ? "Update Discount" : "Create Discount")}
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
