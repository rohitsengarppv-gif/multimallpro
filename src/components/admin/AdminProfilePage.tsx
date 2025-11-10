"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  CheckCircle, 
  Clock, 
  LogOut,
  Key,
  Save
} from "lucide-react";

interface AdminData {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "master_admin";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt?: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    const adminDataString = localStorage.getItem("adminData");
    if (adminDataString) {
      try {
        const parsedData = JSON.parse(adminDataString);
        setAdminData(parsedData);
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      router.push("/admin-login");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    // Validation
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admins/${adminData?._id}/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordSuccess("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
      } else {
        setPasswordError(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setPasswordError("An error occurred while changing password");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">No admin data found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and information</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">{adminData.username}</h2>
              <p className="text-purple-100 flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4" />
                {adminData.email}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  adminData.role === "master_admin" 
                    ? "bg-yellow-400 text-yellow-900" 
                    : "bg-blue-400 text-blue-900"
                }`}>
                  {adminData.role === "master_admin" ? "Master Admin" : "Admin"}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  adminData.status === "approved" 
                    ? "bg-green-400 text-green-900" 
                    : adminData.status === "pending"
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-red-400 text-red-900"
                }`}>
                  {adminData.status === "approved" && <CheckCircle className="h-3 w-3 inline mr-1" />}
                  {adminData.status === "pending" && <Clock className="h-3 w-3 inline mr-1" />}
                  {adminData.status.charAt(0).toUpperCase() + adminData.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          Account Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Admin ID</p>
            <p className="text-gray-900 font-mono text-sm">{adminData._id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Username</p>
            <p className="text-gray-900 font-semibold">{adminData.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="text-gray-900">{adminData.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <p className="text-gray-900 capitalize">{adminData.role.replace("_", " ")}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Account Created
            </p>
            <p className="text-gray-900">{formatDate(adminData.createdAt)}</p>
          </div>
          {adminData.updatedAt && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Last Updated</p>
              <p className="text-gray-900">{formatDate(adminData.updatedAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Password Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Key className="h-5 w-5 text-purple-600" />
          Password Management
        </h3>

        {!isChangingPassword ? (
          <div>
            <p className="text-gray-600 mb-4">Keep your account secure by using a strong password</p>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save New Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setPasswordError("");
                  setPasswordSuccess("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Logout Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900 font-medium mb-1">Logout from Admin Dashboard</p>
            <p className="text-sm text-gray-600">Sign out of your admin account</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
