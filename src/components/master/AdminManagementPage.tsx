import { useState } from "react";
import { Search, ShieldCheck, UserPlus, Edit, Trash2, X, Award } from "lucide-react";

type AdminRole = "super" | "security" | "operations" | "support";

type AdminStatus = "active" | "invited" | "disabled";

interface AdminAccount {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastActive: string;
  createdAt: string;
  teams: string[];
}

const roleLabels: Record<AdminRole, string> = {
  super: "Super Admin",
  security: "Security",
  operations: "Operations",
  support: "Support"
};

const statusClasses: Record<AdminStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  invited: "bg-blue-100 text-blue-700",
  disabled: "bg-red-100 text-red-700"
};

export default function AdminManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AdminRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);

  const [admins, setAdmins] = useState<AdminAccount[]>([
    {
      id: 1,
      name: "Alex Doe",
      email: "alex.doe@multivendor.com",
      role: "super",
      status: "active",
      lastActive: "2 minutes ago",
      createdAt: "2020-01-15",
      teams: ["Leadership", "Operations"]
    },
    {
      id: 2,
      name: "Bianca Rivers",
      email: "bianca.rivers@multivendor.com",
      role: "operations",
      status: "active",
      lastActive: "18 minutes ago",
      createdAt: "2021-03-22",
      teams: ["Vendor Ops", "Growth"]
    },
    {
      id: 3,
      name: "Carlos Mendes",
      email: "carlos.mendes@multivendor.com",
      role: "security",
      status: "invited",
      lastActive: "—",
      createdAt: "2024-10-02",
      teams: ["Security"]
    },
    {
      id: 4,
      name: "Dana Kapoor",
      email: "dana.kapoor@multivendor.com",
      role: "support",
      status: "disabled",
      lastActive: "Jul 18, 2024",
      createdAt: "2022-07-10",
      teams: ["Support", "Experience"]
    }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "operations" as AdminRole,
    status: "active" as AdminStatus,
    teams: ""
  });

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: AdminAccount = {
      id: editingAdmin ? editingAdmin.id : Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      status: formData.status,
      teams: formData.teams
        .split(",")
        .map((team) => team.trim())
        .filter(Boolean),
      createdAt: editingAdmin ? editingAdmin.createdAt : new Date().toISOString().split("T")[0],
      lastActive: editingAdmin ? editingAdmin.lastActive : "Just added"
    };

    if (editingAdmin) {
      setAdmins((prev) => prev.map((admin) => (admin.id === editingAdmin.id ? payload : admin)));
    } else {
      setAdmins((prev) => [payload, ...prev]);
    }

    setShowModal(false);
    setEditingAdmin(null);
    setFormData({ name: "", email: "", role: "operations", status: "active", teams: "" });
  };

  const handleEdit = (admin: AdminAccount) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      teams: admin.teams.join(", ")
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (typeof window !== "undefined" && confirm("Remove this admin account?")) {
      setAdmins((prev) => prev.filter((admin) => admin.id !== id));
    }
  };

  const activeCount = admins.filter((admin) => admin.status === "active").length;
  const pendingInvites = admins.filter((admin) => admin.status === "invited").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-1">Create, monitor, and govern platform administrator access.</p>
        </div>
        <button
          onClick={() => {
            setEditingAdmin(null);
            setFormData({ name: "", email: "", role: "operations", status: "active", teams: "" });
            setShowModal(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Invite Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Admins</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Invites</p>
              <p className="text-2xl font-bold text-gray-900">{pendingInvites}</p>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Admins</p>
              <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <UserPlus className="h-5 w-5" />
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
              placeholder="Search admin name or email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="all">All roles</option>
              <option value="super">Super Admin</option>
              <option value="security">Security</option>
              <option value="operations">Operations</option>
              <option value="support">Support</option>
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="all">All status</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Teams</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{admin.name}</div>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{roleLabels[admin.role]}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[admin.status]}`}>
                      {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{admin.teams.join(", ") || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{admin.lastActive}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        title="Edit admin"
                      >
                        <Edit className="h-4 w-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100"
                        title="Remove admin"
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

        {filteredAdmins.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">No admin accounts match the current filters.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingAdmin ? "Update Admin" : "Invite New Admin"}
                  </h2>
                  <p className="text-sm text-gray-500">Assign role, initial status and team visibility.</p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingAdmin(null);
                    setFormData({ name: "", email: "", role: "operations", status: "active", teams: "" });
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value as AdminRole }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    >
                      <option value="super">Super Admin</option>
                      <option value="operations">Operations</option>
                      <option value="security">Security</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value as AdminStatus }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    >
                      <option value="active">Active</option>
                      <option value="invited">Invited</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teams (comma separated)</label>
                  <input
                    value={formData.teams}
                    onChange={(event) => setFormData((prev) => ({ ...prev, teams: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                    placeholder="Leadership, Security, ..."
                  />
                </div>

                <div className="flex flex-col md:flex-row md:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAdmin(null);
                      setFormData({ name: "", email: "", role: "operations", status: "active", teams: "" });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {editingAdmin ? "Save Changes" : "Send Invite"}
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
