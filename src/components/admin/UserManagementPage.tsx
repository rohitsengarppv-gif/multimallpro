import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, UserPlus, Shield, Filter, X, Loader, RefreshCw, Eye } from "lucide-react";
import UserDetailPage from "./UserDetailPage";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user";
  createdAt: string;
}

interface Vendor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  status: "pending" | "approved" | "rejected";
  role: "vendor";
  createdAt: string;
}

interface CombinedUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "vendor";
  status: "active" | "pending" | "rejected";
  businessName?: string;
  joinedAt: string;
  originalData: User | Vendor;
}

const roleBadges: Record<CombinedUser["role"], string> = {
  customer: "bg-blue-100 text-blue-700",
  vendor: "bg-purple-100 text-purple-700",
};

const statusBadges: Record<CombinedUser["status"], string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | CombinedUser["role"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | CombinedUser["status"]>("all");
  const [users, setUsers] = useState<CombinedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{ id: string; type: "customer" | "vendor" } | null>(null);

  // Fetch users and vendors from APIs
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Fetch both users and vendors in parallel
      const [usersResponse, vendorsResponse] = await Promise.all([
        fetch("/api/routes/users"),
        fetch("/api/vendors")
      ]);

      const usersData = await usersResponse.json();
      const vendorsData = await vendorsResponse.json();

      const combinedUsers: CombinedUser[] = [];

      // Add regular users
      if (usersData.success && Array.isArray(usersData.data)) {
        usersData.data.forEach((user: User) => {
          combinedUsers.push({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: "customer",
            status: "active",
            joinedAt: user.createdAt,
            originalData: user,
          });
        });
      }

      // Add vendors
      if (vendorsData.success && Array.isArray(vendorsData.data)) {
        vendorsData.data.forEach((vendor: Vendor) => {
          combinedUsers.push({
            _id: vendor._id,
            name: `${vendor.firstName} ${vendor.lastName}`,
            email: vendor.email,
            phone: vendor.phone,
            role: "vendor",
            status: vendor.status === "approved" ? "active" : vendor.status,
            businessName: vendor.businessName,
            joinedAt: vendor.createdAt,
            originalData: vendor,
          });
        });
      }

      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.businessName && user.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const handleViewDetails = (user: CombinedUser) => {
    setSelectedUser({
      id: user._id,
      type: user.role,
    });
  };

  const handleDelete = async (user: CombinedUser) => {
    const confirmMsg = `Are you sure you want to delete ${user.role} "${user.name}"? This action cannot be undone.`;
    if (!confirm(confirmMsg)) return;

    try {
      const endpoint = user.role === "vendor" 
        ? `/api/vendors/${user._id}` 
        : `/api/routes/users/${user._id}`;
      
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
        alert(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} deleted successfully`);
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user");
    }
  };

  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalCustomers = users.filter((user) => user.role === "customer").length;
  const totalVendors = users.filter((user) => user.role === "vendor").length;

  // Show detail page if a user is selected
  if (selectedUser) {
    return (
      <UserDetailPage
        userId={selectedUser.id}
        userType={selectedUser.type}
        onBack={() => setSelectedUser(null)}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading users and vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User & Customer Management</h1>
          <p className="text-gray-600 mt-1">Monitor accounts, adjust roles, and control access.</p>
        </div>
        <button
          onClick={fetchAllData}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2 w-fit"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Shield className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Filter className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Role</span>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User/Vendor Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadges[user.role]}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadges[user.status]}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.businessName || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(user.joinedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-emerald-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        title="Delete user"
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">No users match the current filters.</div>
        )}
      </div>
    </div>
  );
}
