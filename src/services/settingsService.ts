import {
  ProfileUpdateData,
  StoreUpdateData,
  PasswordUpdateData,
  VendorProfileData,
  ApiResponse,
} from "@/types/settings";

const API_BASE_URL = "/api/settings";

/**
 * Get vendor profile data
 */
export const getVendorProfile = async (
  vendorId: string
): Promise<ApiResponse<VendorProfileData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "x-vendor-id": vendorId,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching vendor profile:", error);
    return {
      success: false,
      message: "Failed to fetch profile data",
    };
  }
};

/**
 * Update vendor profile (name, avatar, bio)
 */
export const updateVendorProfile = async (
  vendorId: string,
  profileData: ProfileUpdateData
): Promise<ApiResponse<VendorProfileData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-vendor-id": vendorId,
      },
      body: JSON.stringify(profileData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating vendor profile:", error);
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
};

/**
 * Update store settings (name, description, categories, address)
 */
export const updateStoreSettings = async (
  vendorId: string,
  storeData: StoreUpdateData
): Promise<ApiResponse<VendorProfileData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/store`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-vendor-id": vendorId,
      },
      body: JSON.stringify(storeData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating store settings:", error);
    return {
      success: false,
      message: "Failed to update store settings",
    };
  }
};

/**
 * Update vendor password
 */
export const updatePassword = async (
  vendorId: string,
  passwordData: PasswordUpdateData
): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/security`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-vendor-id": vendorId,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating password:", error);
    return {
      success: false,
      message: "Failed to update password",
    };
  }
};

/**
 * Upload avatar image
 * This uses the existing upload endpoint
 */
export const uploadAvatar = async (file: File): Promise<ApiResponse<{ public_id: string; url: string }>> => {
  try {
    const formData = new FormData();
    formData.append("files", file); // API expects 'files' key
    formData.append("folder", "avatars"); // Optional: specify folder

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    
    // Upload API returns array, extract first item
    if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
      return {
        success: true,
        data: {
          public_id: data.data[0].public_id,
          url: data.data[0].url || data.data[0].secure_url,
        },
      };
    }
    
    return data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return {
      success: false,
      message: "Failed to upload avatar",
    };
  }
};
