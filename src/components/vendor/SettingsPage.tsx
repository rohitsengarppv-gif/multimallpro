import { useState, useEffect } from "react";
import { Save, Upload, Bell, Shield, User, Store, X, Plus, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  getVendorProfile,
  updateVendorProfile,
  updateStoreSettings,
  updatePassword,
  uploadAvatar,
} from "@/services/settingsService";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  // Get vendor ID from JWT token or localStorage
  const getVendorId = () => {
    if (typeof window === "undefined") return "";
    
    // First try to get from vendorId directly
    const storedVendorId = localStorage.getItem("vendorId");
    if (storedVendorId) return storedVendorId;
    
    // Try to extract from JWT token
    const token = localStorage.getItem("vendorToken") || localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.id) {
          localStorage.setItem("vendorId", payload.id); // Store for future use
          return payload.id;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    return "";
  };
  
  const vendorId = getVendorId();

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    avatar: { public_id: "", url: "" },
  });

  // Store state
  const [storeData, setStoreData] = useState({
    businessName: "",
    businessDescription: "",
    businessType: "",
    website: "",
    productCategories: [] as string[],
    productTypes: "",
    averageOrderValue: "",
    monthlyVolume: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    taxId: "",
    bankAccount: "",
  });

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Category input
  const [categoryInput, setCategoryInput] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Vendor metadata
  const [vendorMetadata, setVendorMetadata] = useState({
    vendorId: "",
    status: "" as "pending" | "approved" | "rejected" | "",
    isVerified: false,
    createdAt: "",
    updatedAt: "",
  });

  // Fetch vendor data on mount
  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    console.log("Fetching vendor data for ID:", vendorId);
    
    if (!vendorId) {
      console.error("No vendor ID found in localStorage or token");
      setMessage({ type: "error", text: "Please login to access settings. Vendor ID not found." });
      setFetchingData(false);
      return;
    }

    try {
      setFetchingData(true);
      console.log("Calling getVendorProfile API...");
      const result = await getVendorProfile(vendorId);
      console.log("API Response:", result);
      
      if (result.success && result.data) {
        // Set vendor metadata
        setVendorMetadata({
          vendorId: result.data._id || "",
          status: result.data.status || "",
          isVerified: result.data.isVerified || false,
          createdAt: result.data.createdAt ? new Date(result.data.createdAt).toISOString() : "",
          updatedAt: result.data.updatedAt ? new Date(result.data.updatedAt).toISOString() : "",
        });

        setProfileData({
          firstName: result.data.firstName || "",
          lastName: result.data.lastName || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          bio: result.data.bio || "",
          avatar: result.data.avatar || { public_id: "", url: "" },
        });

        setStoreData({
          businessName: result.data.businessName || "",
          businessDescription: result.data.businessDescription || "",
          businessType: result.data.businessType || "",
          website: result.data.website || "",
          productCategories: result.data.productCategories || [],
          productTypes: result.data.productTypes || "",
          averageOrderValue: result.data.averageOrderValue || "",
          monthlyVolume: result.data.monthlyVolume || "",
          businessAddress: result.data.businessAddress || "",
          city: result.data.city || "",
          state: result.data.state || "",
          zipCode: result.data.zipCode || "",
          taxId: result.data.taxId || "",
          bankAccount: result.data.bankAccount || "",
        });
      } else {
        console.error("Failed to fetch vendor data:", result);
        setMessage({ 
          type: "error", 
          text: result.message || "Failed to load vendor data. Please try logging in again." 
        });
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setMessage({ type: "error", text: "Failed to load profile data. Please check your connection." });
    } finally {
      setFetchingData(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: "error", text: "Please upload an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size should be less than 5MB" });
      return;
    }

    try {
      setUploadingAvatar(true);
      console.log("Uploading avatar...");
      
      const result = await uploadAvatar(file);
      console.log("Avatar upload result:", result);
      
      if (result.success && result.data) {
        // Update local state
        const newAvatar = result.data;
        
        // Update state first
        const updatedProfileData = {
          ...profileData,
          avatar: newAvatar
        };
        
        setProfileData(updatedProfileData);
        
        // Automatically save to vendor profile with proper data
        console.log("Saving avatar to vendor profile...", {
          firstName: updatedProfileData.firstName,
          lastName: updatedProfileData.lastName,
          hasAvatar: !!updatedProfileData.avatar
        });
        
        const updateResult = await updateVendorProfile(vendorId, updatedProfileData);
        
        if (updateResult.success) {
          setMessage({ type: "success", text: "Avatar uploaded and saved successfully!" });
          console.log("Avatar saved to database:", updateResult.data?.avatar);
          // Refresh vendor data to show updated avatar
          await fetchVendorData();
        } else {
          console.error("Failed to save avatar:", updateResult);
          setMessage({ type: "error", text: updateResult.message || "Avatar uploaded but failed to save to profile" });
        }
      } else {
        setMessage({ type: "error", text: result.message || "Failed to upload avatar" });
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileSubmit = async () => {
    if (!profileData.firstName || !profileData.lastName) {
      setMessage({ type: "error", text: "First name and last name are required" });
      return;
    }

    try {
      setLoading(true);
      const result = await updateVendorProfile(vendorId, profileData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSubmit = async () => {
    if (!storeData.businessName || !storeData.businessDescription) {
      setMessage({ type: "error", text: "Store name and description are required" });
      return;
    }

    if (storeData.productCategories.length === 0) {
      setMessage({ type: "error", text: "Please add at least one category" });
      return;
    }

    if (!storeData.businessAddress || !storeData.city || !storeData.state) {
      setMessage({ type: "error", text: "Complete address is required" });
      return;
    }

    try {
      setLoading(true);
      const result = await updateStoreSettings(vendorId, storeData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Store settings updated successfully" });
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update store settings" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update store settings" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: "error", text: "All password fields are required" });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      setLoading(true);
      const result = await updatePassword(vendorId, passwordData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Password updated successfully" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update password" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = () => {
    if (categoryInput.trim() && !storeData.productCategories.includes(categoryInput.trim())) {
      setStoreData(prev => ({
        ...prev,
        productCategories: [...prev.productCategories, categoryInput.trim()]
      }));
      setCategoryInput("");
    }
  };

  const removeCategory = (category: string) => {
    setStoreData(prev => ({
      ...prev,
      productCategories: prev.productCategories.filter(c => c !== category)
    }));
  };

  const handleSaveChanges = () => {
    switch (activeTab) {
      case "profile":
        handleProfileSubmit();
        break;
      case "store":
        handleStoreSubmit();
        break;
      case "security":
        handlePasswordSubmit();
        break;
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "store", label: "Store Settings", icon: Store },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },

  ];

  const renderTabContent = () => {
    if (fetchingData) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
            
              <div>
                <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                <p className="text-sm text-gray-500">Upload your profile picture (JPG, PNG)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <input 
                  type="text" 
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <input 
                  type="text" 
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  value={profileData.phone}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Phone cannot be changed</p>
              </div>
            </div>

            
          </div>
        );

      case "store":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Name *</label>
              <input 
                type="text" 
                value={storeData.businessName}
                onChange={(e) => setStoreData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter your store name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Description *</label>
              <textarea 
                rows={4}
                value={storeData.businessDescription}
                onChange={(e) => setStoreData(prev => ({ ...prev, businessDescription: e.target.value }))}
                placeholder="Describe your store and products (max 1000 characters)"
                maxLength={1000}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">{storeData.businessDescription.length}/1000 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select 
                  value={storeData.businessType}
                  onChange={(e) => setStoreData(prev => ({ ...prev, businessType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input 
                  type="url" 
                  value={storeData.website}
                  onChange={(e) => setStoreData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourwebsite.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Categories *</label>
              <div className="flex gap-2 mb-3">
                <input 
                  type="text" 
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                  placeholder="Add a category (e.g., Electronics, Fashion)"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              {storeData.productCategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {storeData.productCategories.map((category, index) => (
                    <div key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="text-sm">{category}</span>
                      <button
                        type="button"
                        onClick={() => removeCategory(category)}
                        className="hover:bg-orange-200 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {storeData.productCategories.length === 0 && (
                <p className="text-sm text-gray-500">No categories added yet. Please add at least one.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Types</label>
              <textarea 
                rows={3}
                value={storeData.productTypes}
                onChange={(e) => setStoreData(prev => ({ ...prev, productTypes: e.target.value }))}
                placeholder="Describe the types of products you sell (e.g., Electronics, Clothing, etc.)"
                maxLength={500}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Order Value</label>
                <select 
                  value={storeData.averageOrderValue}
                  onChange={(e) => setStoreData(prev => ({ ...prev, averageOrderValue: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select range</option>
                  <option value="under-50">Under ₹50</option>
                  <option value="50-100">₹50 - ₹100</option>
                  <option value="100-250">₹100 - ₹250</option>
                  <option value="250-500">₹250 - ₹500</option>
                  <option value="over-500">Over ₹500</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Volume</label>
                <select 
                  value={storeData.monthlyVolume}
                  onChange={(e) => setStoreData(prev => ({ ...prev, monthlyVolume: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select range</option>
                  <option value="1-10">1 - 10 orders</option>
                  <option value="11-50">11 - 50 orders</option>
                  <option value="51-100">51 - 100 orders</option>
                  <option value="101-500">101 - 500 orders</option>
                  <option value="over-500">Over 500 orders</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                <input 
                  type="text" 
                  value="India"
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Country cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                <input 
                  type="text" 
                  value={storeData.zipCode}
                  onChange={(e) => setStoreData(prev => ({ ...prev, zipCode: e.target.value }))}
                  placeholder="Enter zip code"
                  maxLength={10}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input 
                  type="text" 
                  value={storeData.city}
                  onChange={(e) => setStoreData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Enter city"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <input 
                  type="text" 
                  value={storeData.state}
                  onChange={(e) => setStoreData(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Store Address *</label>
              <textarea 
                rows={3}
                value={storeData.businessAddress}
                onChange={(e) => setStoreData(prev => ({ ...prev, businessAddress: e.target.value }))}
                placeholder="Enter complete store address"
                maxLength={200}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Documents</h3>
              <p className="text-sm text-gray-500 mb-4">These fields are read-only and were set during registration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                <input 
                  type="text" 
                  value={storeData.taxId}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account (Last 4 digits)</label>
                <input 
                  type="text" 
                  value={storeData.bankAccount}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
              
              <div className="space-y-3">
                {[
                  { label: "New Orders", description: "Get notified when you receive new orders" },
                  { label: "Order Updates", description: "Updates on order status changes" },
                  { label: "Customer Messages", description: "New messages from customers" },
                  { label: "Low Stock Alerts", description: "When products are running low" },
                  { label: "Weekly Reports", description: "Weekly performance summaries" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                    <div className="w-10 h-6 rounded-full p-1 bg-orange-500 transition-colors">
                      <div className="w-4 h-4 rounded-full bg-white transition-transform translate-x-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password *</label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-sm text-red-600">Passwords do not match</p>
                )}
                {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                  <p className="text-sm text-red-600">Password must be at least 6 characters</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Enable 2FA</h4>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account (Coming soon)</p>
                  </div>
                  <button 
                    disabled
                    className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed text-sm"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Settings for {activeTab} coming soon...</p>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your account and store preferences</p>
      </div>

      {/* Vendor Info Card */}
      {vendorMetadata.vendorId && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Vendor Information</h2>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(vendorMetadata.status)}`}>
                  {vendorMetadata.status ? vendorMetadata.status.toUpperCase() : "N/A"}
                </span>
                {vendorMetadata.isVerified && (
                  <span className="px-3 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-800 border-blue-200">
                    ✓ VERIFIED
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Vendor ID</p>
                  <p className="text-sm font-mono font-medium text-gray-900 mt-1">
                    {vendorMetadata.vendorId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Account Created</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(vendorMetadata.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {formatDate(vendorMetadata.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="flex-1">{message.text}</span>
          <button 
            onClick={() => setMessage(null)}
            className="text-current hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
            {renderTabContent()}
            
            {activeTab !== "notifications" && (
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleSaveChanges}
                  disabled={loading || fetchingData}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
