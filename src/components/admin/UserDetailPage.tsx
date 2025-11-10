import { useState, useEffect } from "react";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, ShoppingBag, Store, CheckCircle, XCircle, Clock, Loader } from "lucide-react";

interface UserDetail {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
  isVerified?: boolean;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  // Vendor specific fields
  avatar?: {
    public_id?: string;
    url?: string;
  };
  bio?: string;
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  businessDescription?: string;
  productCategories?: string[];
  productTypes?: string;
  averageOrderValue?: string;
  monthlyVolume?: string;
  businessLicense?: {
    public_id?: string;
    url?: string;
  };
  taxId?: string;
  bankAccount?: string;
  status?: string;
  termsAccepted?: boolean;
  marketingConsent?: boolean;
  products?: any[];
}

interface UserDetailPageProps {
  userId: string;
  userType: "customer" | "vendor";
  onBack: () => void;
}

export default function UserDetailPage({ userId, userType, onBack }: UserDetailPageProps) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDetails();
  }, [userId, userType]);

  const fetchUserDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = userType === "vendor" 
        ? `/api/vendors/${userId}` 
        : `/api/routes/users/${userId}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        setUser(data.data);
      } else {
        setError(data.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("An error occurred while fetching user details");
    } finally {
      setIsLoading(false);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Users
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error || "User not found"}</p>
        </div>
      </div>
    );
  }

  const displayName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Users
        </button>
        <div className="flex items-center gap-2">
          {userType === "vendor" ? (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Vendor
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              Customer
            </span>
          )}
        </div>
      </div>

      {/* User Header Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-6 flex-1">
            {user.avatar?.url && (
              <div className="flex-shrink-0">
                <img 
                  src={user.avatar.url} 
                  alt={displayName}
                  className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
              <p className="text-emerald-100 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              {user.phone && (
                <p className="text-emerald-100 flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </p>
              )}
              {user.website && (
                <a 
                  href={user.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-emerald-100 hover:text-white underline mt-1 inline-block"
                >
                  {user.website}
                </a>
              )}
            </div>
          </div>
          <div className="text-right">
            {user.isVerified !== undefined && (
              <div className="flex items-center gap-2 mb-2">
                {user.isVerified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-white" />
                    <span className="font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <Clock className="h-5 w-5 text-yellow-200" />
                    <span className="font-medium">Not Verified</span>
                  </>
                )}
              </div>
            )}
            {user.status && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.status === "approved" || user.status === "active"
                  ? "bg-green-500 text-white"
                  : user.status === "pending"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-500 text-white"
              }`}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-emerald-600" />
            Basic Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">User ID</p>
              <p className="text-gray-900 font-mono text-sm">{user._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{user.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
            {user.updatedAt && (
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900">{formatDate(user.updatedAt)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        {user.address && Object.keys(user.address).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Address
            </h2>
            <div className="space-y-2">
              {user.address.street && <p className="text-gray-900">{user.address.street}</p>}
              <p className="text-gray-900">
                {[user.address.city, user.address.state, user.address.zipCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {user.address.country && <p className="text-gray-900">{user.address.country}</p>}
            </div>
          </div>
        )}

        {/* Vendor Specific - Business Information */}
        {userType === "vendor" && user.businessName && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Store className="h-5 w-5 text-emerald-600" />
              Business Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="text-gray-900 font-semibold">{user.businessName}</p>
              </div>
              {user.businessType && (
                <div>
                  <p className="text-sm text-gray-500">Business Type</p>
                  <p className="text-gray-900">{user.businessType}</p>
                </div>
              )}
              {user.businessAddress && (
                <div>
                  <p className="text-sm text-gray-500">Business Address</p>
                  <p className="text-gray-900">{user.businessAddress}</p>
                </div>
              )}
              {(user.city || user.state) && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">
                    {[user.city, user.state, user.zipCode, user.country].filter(Boolean).join(", ")}
                  </p>
                </div>
              )}
              {user.taxId && (
                <div>
                  <p className="text-sm text-gray-500">Tax ID</p>
                  <p className="text-gray-900">{user.taxId}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vendor Specific - Product Information */}
        {userType === "vendor" && user.productCategories && user.productCategories.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              Product Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Product Categories</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.productCategories.map((category, index) => (
                    <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              {user.productTypes && (
                <div>
                  <p className="text-sm text-gray-500">Product Types</p>
                  <p className="text-gray-900">{user.productTypes}</p>
                </div>
              )}
              {user.averageOrderValue && (
                <div>
                  <p className="text-sm text-gray-500">Average Order Value</p>
                  <p className="text-gray-900">{user.averageOrderValue}</p>
                </div>
              )}
              {user.monthlyVolume && (
                <div>
                  <p className="text-sm text-gray-500">Monthly Volume</p>
                  <p className="text-gray-900">{user.monthlyVolume} orders</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vendor Specific - Bank Account */}
        {userType === "vendor" && user.bankAccount && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-emerald-600" />
              Bank Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="text-gray-900 font-mono">{user.bankAccount}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Business Description */}
      {user.businessDescription && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Business Description</h2>
          <p className="text-gray-700 leading-relaxed">{user.businessDescription}</p>
        </div>
      )}

      {/* Bio */}
      {user.bio && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Bio</h2>
          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Business License Document */}
      {userType === "vendor" && user.businessLicense?.url && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Business License</h2>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <img 
              src={user.businessLicense.url} 
              alt="Business License"
              className="w-full h-auto object-contain max-h-96"
            />
          </div>
          <a 
            href={user.businessLicense.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium"
          >
            View Full Document →
          </a>
        </div>
      )}

      {/* Products Count for Vendors */}
      {userType === "vendor" && user.products && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-emerald-600" />
            Products
          </h2>
          <p className="text-gray-900">
            Total Products: <span className="font-semibold text-emerald-600">{user.products.length}</span>
          </p>
        </div>
      )}
    </div>
  );
}
