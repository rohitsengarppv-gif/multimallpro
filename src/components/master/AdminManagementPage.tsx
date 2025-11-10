import { useState, useEffect } from "react";
import { Search, ShieldCheck, CheckCircle, XCircle, Clock, Loader, Trash2, RefreshCw } from "lucide-react";

type AdminRole = "admin" | "master_admin";

type AdminStatus = "pending" | "approved" | "rejected";

interface AdminAccount {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: AdminRole;
  status: AdminStatus;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

const roleLabels: Record<AdminRole, string> = {
  admin: "Admin",
  master_admin: "Master Admin",
};

const statusClasses: Record<AdminStatus, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

const statusIcons: Record<AdminStatus, any> = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function AdminManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminStatus>("all");
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Fetch admins from API
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admins");
      const data = await response.json();
      
      if (data.success) {
        setAdmins(data.data);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (adminId: string) => {
    setIsProcessing(adminId);
    try {
      const response = await fetch(`/api/admins/${adminId}/approve`, {
        method: "PUT",
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setAdmins((prev) =>
          prev.map((admin) =>
            admin._id === adminId ? { ...admin, status: "approved" as AdminStatus } : admin
          )
        );
        alert("Admin approved successfully!");
      } else {
        alert(data.message || "Failed to approve admin");
      }
    } catch (error) {
      console.error("Error approving admin:", error);
      alert("Error approving admin");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (adminId: string) => {
    if (!confirm("Are you sure you want to reject this admin application?")) {
      return;
    }

    setIsProcessing(adminId);
    try {
      const response = await fetch(`/api/admins/${adminId}/reject`, {
        method: "PUT",
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setAdmins((prev) =>
          prev.map((admin) =>
            admin._id === adminId ? { ...admin, status: "rejected" as AdminStatus } : admin
          )
        );
        alert("Admin rejected successfully");
      } else {
        alert(data.message || "Failed to reject admin");
      }
    } catch (error) {
      console.error("Error rejecting admin:", error);
      alert("Error rejecting admin");
    } finally {
      setIsProcessing(null);
    }
  };

  const handleDelete = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      return;
    }

    setIsProcessing(adminId);
    try {
      const response = await fetch(`/api/admins/${adminId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove from local state
        setAdmins((prev) => prev.filter((admin) => admin._id !== adminId));
        alert("Admin deleted successfully");
      } else {
        alert(data.message || "Failed to delete admin");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("Error deleting admin");
    } finally {
      setIsProcessing(null);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return "Never";
    const date = new Date(lastLogin);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return formatDate(lastLogin);
  };

  const pendingCount = admins.filter((admin) => admin.status === "pending").length;
  const approvedCount = admins.filter((admin) => admin.status === "approved").length;
  const rejectedCount = admins.filter((admin) => admin.status === "rejected").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-600 mt-1">Approve or reject admin applications and manage existing admins.</p>
        </div>
        <button
          onClick={fetchAdmins}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Applications</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved Admins</p>
              <p className="text-2xl font-bold text-emerald-600">{approvedCount}</p>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <XCircle className="h-5 w-5" />
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
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Table */}
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
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin Details</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAdmins.map((admin) => {
                const StatusIcon = statusIcons[admin.status];
                return (
                  <tr key={admin._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">
                        {admin.firstName} {admin.lastName}
                      </div>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                      <p className="text-xs text-gray-500">{admin.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{admin.department}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {roleLabels[admin.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[admin.status]}`}>
                          {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(admin.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatLastLogin(admin.lastLogin)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {admin.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(admin._id)}
                              disabled={isProcessing === admin._id}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-medium"
                              title="Approve admin"
                            >
                              {isProcessing === admin._id ? (
                                <Loader className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(admin._id)}
                              disabled={isProcessing === admin._id}
                              className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-medium"
                              title="Reject admin"
                            >
                              {isProcessing === admin._id ? (
                                <Loader className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3" />
                              )}
                              Reject
                            </button>
                          </>
                        )}
                        {admin.role !== "master_admin" && (
                          <button
                            onClick={() => handleDelete(admin._id)}
                            disabled={isProcessing === admin._id}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete admin"
                          >
                            {isProcessing === admin._id ? (
                              <Loader className="h-4 w-4 text-red-500 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-red-500" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No admin applications match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
