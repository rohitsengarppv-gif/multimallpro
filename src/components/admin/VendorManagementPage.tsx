import { useMemo, useState, useEffect } from "react";
import { Search, Building, BadgeCheck, Edit, Trash2, Plus, PhoneCall, Mail, MapPin, Filter, X, Loader2 } from "lucide-react";

interface VendorAccount {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  businessAddress: string;
  city: string;
  state: string;
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  productCategories: string[];
  businessDescription: string;
  website?: string;
}

interface VendorStats {
  total: number;
  active: number;
  pending: number;
  rejected: number;
}

const statusBadge: Record<VendorAccount["status"], string> = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700"
};

export default function VendorManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VendorAccount["status"]>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [vendors, setVendors] = useState<VendorAccount[]>([]);
  const [stats, setStats] = useState<VendorStats>({ total: 0, active: 0, pending: 0, rejected: 0 });

  // Fetch vendors from API
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/vendors');
      const result = await response.json();

      if (result.success) {
        setVendors(result.data);

        // Calculate stats
        const total = result.data.length;
        const active = result.data.filter((v: VendorAccount) => v.status === 'approved').length;
        const pending = result.data.filter((v: VendorAccount) => v.status === 'pending').length;
        const rejected = result.data.filter((v: VendorAccount) => v.status === 'rejected').length;

        setStats({ total, active, pending, rejected });
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update vendor status
  const updateVendorStatus = async (vendorId: string, newStatus: VendorAccount["status"]) => {
    try {
      setActionLoading(vendorId);
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        setVendors(prev => prev.map(vendor =>
          vendor._id === vendorId ? { ...vendor, status: newStatus } : vendor
        ));
        fetchVendors(); // Refresh stats
      } else {
        alert('Failed to update vendor status');
      }
    } catch (error) {
      console.error('Error updating vendor status:', error);
      alert('Failed to update vendor status');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete vendor
  const deleteVendor = async (vendorId: string) => {
    if (!confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(vendorId);
      const response = await fetch(`/api/vendors/${vendorId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setVendors(prev => prev.filter(vendor => vendor._id !== vendorId));
        fetchVendors(); // Refresh stats
      } else {
        alert('Failed to delete vendor');
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('Failed to delete vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const [formData, setFormData] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessType: "",
    businessAddress: "",
    city: "",
    state: "",
    businessDescription: "",
    productCategories: [] as string[],
    website: "",
    status: "pending" as VendorAccount["status"],
  });

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === "all" ||
      vendor.productCategories.some(cat => cat.toLowerCase().includes(categoryFilter.toLowerCase()));
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!editingVendor) {
      alert('Creating new vendors is not supported from this interface. Vendors must register through the public form.');
      return;
    }

    try {
      setActionLoading(editingVendor._id);
      const response = await fetch(`/api/vendors/${editingVendor._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: formData.status,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setVendors(prev => prev.map(vendor =>
          vendor._id === editingVendor._id ? { ...vendor, status: formData.status } : vendor
        ));
        setShowModal(false);
        setEditingVendor(null);
        fetchVendors(); // Refresh stats
      } else {
        alert('Failed to update vendor');
      }
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = (vendor: VendorAccount) => {
    setEditingVendor(vendor);
    setFormData({
      businessName: vendor.businessName,
      firstName: vendor.firstName,
      lastName: vendor.lastName,
      email: vendor.email,
      phone: vendor.phone,
      businessType: vendor.businessType,
      businessAddress: vendor.businessAddress,
      city: vendor.city,
      state: vendor.state,
      businessDescription: vendor.businessDescription,
      productCategories: vendor.productCategories,
      website: vendor.website || "",
      status: vendor.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deleteVendor(id);
  };

  const categoryOptions = useMemo(() => {
    const allCategories = vendors.flatMap(vendor => vendor.productCategories);
    const uniqueCategories = [...new Set(allCategories)];
    return ["all", ...uniqueCategories.sort()];
  }, [vendors]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-1">Approve storefronts, monitor performance, and take actions.</p>
        </div>
        <button
          onClick={() => {
            setEditingVendor(null);
            setFormData({
              businessName: "",
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              businessType: "",
              businessAddress: "",
              city: "",
              state: "",
              businessDescription: "",
              productCategories: [],
              website: "",
              status: "pending"
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <BadgeCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <Filter className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Building className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col xl:flex-row xl:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search vendor, owner, or email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All Categories" : option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                      <span className="text-gray-500">Loading vendors...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
                      ? "No vendors match the current filters."
                      : "No vendor applications yet."
                    }
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor: VendorAccount) => (
                  <tr key={vendor._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{vendor.businessName}</div>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {vendor.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">{vendor.firstName} {vendor.lastName}</div>
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <PhoneCall className="h-3 w-3" />
                        {vendor.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {vendor.productCategories.join(", ") || "No categories"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge[vendor.status]}`}>
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                        {vendor.status === 'pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateVendorStatus(vendor._id, 'approved')}
                              disabled={actionLoading === vendor._id}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                            >
                              {actionLoading === vendor._id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Approve'}
                            </button>
                            <button
                              onClick={() => updateVendorStatus(vendor._id, 'rejected')}
                              disabled={actionLoading === vendor._id}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                            >
                              {actionLoading === vendor._id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Reject'}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(vendor)}
                          disabled={actionLoading === vendor._id}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                          title="Edit vendor"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => deleteVendor(vendor._id)}
                          disabled={actionLoading === vendor._id}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50"
                          title="Delete vendor"
                        >
                          {actionLoading === vendor._id ? <Loader2 className="h-4 w-4 animate-spin text-red-500" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredVendors.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500 text-sm">
            {searchTerm || statusFilter !== "all" || categoryFilter !== "all"
              ? "No vendors match the current filters."
              : "No vendor applications yet."
            }
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingVendor ? "Update Vendor" : "Register Vendor"}
                  </h2>
                  <p className="text-sm text-gray-500">Verify details before approving.</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingVendor(null);
                    setFormData({
                      businessName: "",
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      businessType: "",
                      businessAddress: "",
                      city: "",
                      state: "",
                      businessDescription: "",
                      productCategories: [],
                      website: "",
                      status: "pending"
                    });
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                  <input
                    value={formData.businessName}
                    onChange={(event) => setFormData((prev) => ({ ...prev, businessName: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      value={formData.firstName}
                      onChange={(event) => setFormData((prev) => ({ ...prev, firstName: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      value={formData.lastName}
                      onChange={(event) => setFormData((prev) => ({ ...prev, lastName: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <input
                      value={formData.phone}
                      onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                    <select
                      value={formData.businessType}
                      onChange={(event) => setFormData((prev) => ({ ...prev, businessType: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Corporation">Corporation</option>
                      <option value="LLC">LLC</option>
                      <option value="Non-profit">Non-profit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value as VendorAccount["status"] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                  <input
                    value={formData.businessAddress}
                    onChange={(event) => setFormData((prev) => ({ ...prev, businessAddress: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      value={formData.city}
                      onChange={(event) => setFormData((prev) => ({ ...prev, city: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      value={formData.state}
                      onChange={(event) => setFormData((prev) => ({ ...prev, state: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingVendor(null);
                      setFormData({
                        businessName: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        businessType: "",
                        businessAddress: "",
                        city: "",
                        state: "",
                        businessDescription: "",
                        productCategories: [],
                        website: "",
                        status: "pending"
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingVendor ? "Save Changes" : "Approve Vendor"}
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
