"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit,
  Camera,
  Loader2,
  ArrowLeft,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        router.push("/auth/login");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch("/api/users/me", {
          headers: {
            "x-user-id": JSON.parse(userData).id,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setUser(data.data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Profile not found"}
            </h1>
            <p className="text-gray-600 mb-6">
              Please try logging in again or contact support if the problem persists.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push("/auth/login")}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-center">
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center border-4 border-gray-200 mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}

                <h2 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-gray-600 mb-2 capitalize">{user.role}</p>

                {user.isVerified && (
                  <div className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                    <Shield className="h-4 w-4" />
                    Verified Account
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <button className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900">{user.phone || "Not provided"}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-900 capitalize">{user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {user.address && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h3>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-gray-900">
                    {user.address.street && <p>{user.address.street}</p>}
                    <p>
                      {user.address.city && `${user.address.city}, `}
                      {user.address.state && `${user.address.state} `}
                      {user.address.zipCode && `${user.address.zipCode}`}
                    </p>
                    {user.address.country && <p>{user.address.country}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span className={`font-medium ${user.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="/orders"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-rose-300 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">My Orders</p>
                    <p className="text-sm text-gray-600">View order history</p>
                  </div>
                </a>

                <a
                  href="/wishlist"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-rose-300 transition-colors"
                >
                  <div className="p-2 bg-red-100 rounded-lg">
                    <User className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Wishlist</p>
                    <p className="text-sm text-gray-600">Saved items</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
