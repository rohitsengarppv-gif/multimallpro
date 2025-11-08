import { useState } from "react";
import { Search, Plus, Edit, Trash2, UserPlus, Shield, Filter, X } from "lucide-react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  status: "active" | "suspended" | "invited";
  orders: number;
  spend: number;
  joinedAt: string;
}

const roleBadges: Record<AdminUser["role"], string> = {
  customer: "bg-blue-100 text-blue-700",
  vendor: "bg-purple-100 text-purple-700",
  admin: "bg-emerald-100 text-emerald-700"
};

const statusBadges: Record<AdminUser["status"], string> = {
  active: "bg-green-100 text-green-700",
  suspended: "bg-red-100 text-red-700",
  invited: "bg-amber-100 text-amber-700"
};

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AdminUser["role"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminUser["status"]>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([
    { id: 1, name: "Ava Green", email: "ava.green@example.com", role: "admin", status: "active", orders: 0, spend: 0, joinedAt: "2024-01-10" },
    { id: 2, name: "Liam Brown", email: "liam.brown@example.com", role: "vendor", status: "active", orders: 128, spend: 32000, joinedAt: "2023-08-02" },
    { id: 3, name: "Noah Smith", email: "noah.smith@example.com", role: "customer", status: "active", orders: 58, spend: 4280, joinedAt: "2023-12-14" },
    { id: 4, name: "Emma Johnson", email: "emma.j@example.com", role: "vendor", status: "suspended", orders: 212, spend: 51200, joinedAt: "2022-05-19" },
    { id: 5, name: "Sophia Lee", email: "sophia.lee@example.com", role: "customer", status: "invited", orders: 0, spend: 0, joinedAt: "2024-10-01" }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer" as AdminUser["role"],
    status: "active" as AdminUser["status"],
    orders: "0",
    spend: "0"
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: AdminUser = {
      id: editingUser ? editingUser.id : Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      status: formData.status,
      orders: Number(formData.orders) || 0,
      spend: Number(formData.spend) || 0,
      joinedAt: editingUser ? editingUser.joinedAt : new Date().toISOString().split("T")[0]
    };

    if (editingUser) {
      setUsers((prev) => prev.map((user) => user.id === editingUser.id ? payload : user));
    } else {
      setUsers((prev) => [payload, ...prev]);
    }

    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "customer", status: "active", orders: "0", spend: "0" });
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      orders: user.orders.toString(),
      spend: user.spend.toString()
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (typeof window !== "undefined" && confirm("Remove this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  const activeUsers = users.filter((user) => user.status === "active").length;
  const totalVendors = users.filter((user) => user.role === "vendor").length;
  const totalSpend = users.reduce((sum, user) => sum + user.spend, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User & Customer Management</h1>
          <p className="text-gray-600 mt-1">Monitor accounts, adjust roles, and control access.</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", email: "", role: "customer", status: "active", orders: "0", spend: "0" });
            setShowModal(true);
          }}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2 w-fit"
        >
          <UserPlus className="h-4 w-4" />
          Invite User
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
              <p className="text-sm text-gray-500">Vendors</p>
              <p className="text-2xl font-bold text-gray-900">{totalVendors}</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <UserPlus className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Lifetime Spend</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpend.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
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
                <option value="admin">Admin</option>
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
                <option value="suspended">Suspended</option>
                <option value="invited">Invited</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Spend</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
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
                  <td className="px-4 py-3 text-sm text-gray-600">{user.orders}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${user.spend.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.joinedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100"
                        title="Remove user"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingUser ? "Update User" : "Invite New User"}
                  </h2>
                  <p className="text-sm text-gray-500">Define access level and set initial status.</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingUser(null);
                    setFormData({ name: "", email: "", role: "customer", status: "active", orders: "0", spend: "0" });
                  }}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value as AdminUser["role"] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value as AdminUser["status"] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="invited">Invited</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Orders</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.orders}
                      onChange={(event) => setFormData((prev) => ({ ...prev, orders: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lifetime Spend ($)</label>
                    <input
                      type="number"
                      min={0}
                      value={formData.spend}
                      onChange={(event) => setFormData((prev) => ({ ...prev, spend: event.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingUser(null);
                      setFormData({ name: "", email: "", role: "customer", status: "active", orders: "0", spend: "0" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    {editingUser ? "Save Changes" : "Send Invite"}
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
