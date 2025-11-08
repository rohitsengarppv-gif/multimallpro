// Settings API Types

export interface Avatar {
  public_id: string;
  url: string;
}

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  avatar?: Avatar;
  bio?: string;
}

export interface StoreUpdateData {
  businessName: string;
  businessDescription: string;
  businessType?: string;
  website?: string;
  productCategories: string[];
  productTypes?: string;
  averageOrderValue?: string;
  monthlyVolume?: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode?: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VendorProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: Avatar;
  bio?: string;
  businessName: string;
  businessDescription: string;
  businessType?: string;
  website?: string;
  productCategories: string[];
  productTypes?: string;
  averageOrderValue?: string;
  monthlyVolume?: string;
  businessAddress: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  taxId?: string;
  bankAccount?: string;
  businessLicense?: Avatar;
  status: "pending" | "approved" | "rejected";
  isVerified?: boolean;
  termsAccepted?: boolean;
  marketingConsent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}
