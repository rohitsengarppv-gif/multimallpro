"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { 
  User, 
  Building, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  Mail,
  Globe,
  Package,
  DollarSign,
  Shield,
  Star,
  Lock,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

export default function BecomeVendorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: number]: boolean}>({});
  const [activeTab, setActiveTab] = useState("register"); // "register" or "login"
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    
    // Business Information
    businessName: "",
    businessType: "",
    businessAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    website: "",
    businessDescription: "",
    
    // Product Information
    productCategories: [] as string[],
    productTypes: "",
    averageOrderValue: "",
    monthlyVolume: "",
    
    // Documents
    businessLicense: null as { public_id: string; url: string } | null,
    taxId: "",
    bankAccount: "",
    
    // Agreement
    termsAccepted: false,
    marketingConsent: false
  });

  const steps = [
    {
      id: 1,
      title: "Personal Info",
      icon: User,
      description: "Your personal details"
    },
    {
      id: 2,
      title: "Business Info",
      icon: Building,
      description: "Business information"
    },
    {
      id: 3,
      title: "Products",
      icon: Package,
      description: "Product details"
    },
    {
      id: 4,
      title: "Documents",
      icon: FileText,
      description: "Required documents"
    },
    {
      id: 5,
      title: "Review",
      icon: CheckCircle,
      description: "Review & submit"
    }
  ];

  const businessTypes = [
    "Sole Proprietorship",
    "Partnership",
    "Corporation",
    "LLC",
    "Non-profit",
    "Other"
  ];

  const productCategories = [
    "Electronics",
    "Fashion & Clothing",
    "Home & Garden",
    "Beauty & Personal Care",
    "Sports & Outdoors",
    "Books & Media",
    "Toys & Games",
    "Automotive",
    "Health & Wellness",
    "Food & Beverages"
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Commission",
      description: "Low fees with transparent pricing structure"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Access to customers in 25+ countries"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Fast and secure payment processing"
    },
    {
      icon: Star,
      title: "Marketing Support",
      description: "Promotional tools and marketing assistance"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (loginError) setLoginError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setLoginSuccess("");

    try {
      const response = await fetch("/api/vendors/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.success) {
        setLoginSuccess("Login successful! Redirecting to dashboard...");
        localStorage.setItem("vendorToken", result.token);
        localStorage.setItem("vendorData", JSON.stringify(result.data));

        setTimeout(() => {
          router.push("/vendor-dashboard");
        }, 1500);
      } else {
        setLoginError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Network error. Please check your connection and try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('folder', 'vendor-documents');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // Store the uploaded file info in form data
        setFormData(prev => ({
          ...prev,
          businessLicense: {
            public_id: result.data[0].public_id,
            url: result.data[0].url,
          }
        }));

        setUploadProgress(100);

        // Show different message for mock uploads
        if (result.message && result.message.includes('Mock upload')) {
          console.log('Using mock upload:', result.message);
        } else {
          console.log('Upload successful to Cloudinary');
        }

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          // Success message shown in modal
        }, 500);
      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file type (PDF, JPG, JPEG, PNG)');
        return;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      handleFileUpload(file);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Information
        return !!(
          formData.firstName.trim() &&
          formData.lastName.trim() &&
          formData.email.trim() &&
          formData.phone.trim() &&
          formData.password.trim() &&
          formData.password.length >= 6
        );

      case 2: // Business Information
        return !!(
          formData.businessName.trim() &&
          formData.businessType &&
          formData.businessAddress.trim() &&
          formData.city.trim() &&
          formData.state.trim() &&
          formData.businessDescription.trim()
        );

      case 3: // Product Information
        return formData.productCategories.length > 0;

      case 4: // Documents
        return !!(
          formData.businessLicense &&
          formData.taxId.trim() &&
          formData.bankAccount.trim()
        );

      case 5: // Review
        return formData.termsAccepted;

      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 5) {
      // Validate current step before proceeding
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
        // Clear validation error for current step when moving forward
        setValidationErrors(prev => ({
          ...prev,
          [currentStep]: false
        }));
      } else {
        // Show validation error and mark step as having validation errors
        setValidationErrors(prev => ({
          ...prev,
          [currentStep]: true
        }));
        alert(`Please complete all required fields in Step ${currentStep} before proceeding to the next step.`);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Prepare form data for API
      const vendorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        businessName: formData.businessName,
        businessType: formData.businessType,
        businessAddress: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country || "India",
        website: formData.website,
        businessDescription: formData.businessDescription,
        productCategories: formData.productCategories,
        productTypes: formData.productTypes,
        averageOrderValue: formData.averageOrderValue,
        monthlyVolume: formData.monthlyVolume,
        businessLicense: formData.businessLicense,
        taxId: formData.taxId,
        bankAccount: formData.bankAccount,
        termsAccepted: formData.termsAccepted,
        marketingConsent: formData.marketingConsent,
      };

      const response = await fetch("/api/vendors/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Thank you! Your vendor application has been submitted successfully. You will receive an email once your account is approved.");
        // Redirect to vendor login page
        window.location.href = "/vendor-login";
      } else {
        alert(`Registration failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  };

  // Upload Modal Component
  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={() => setIsUploading(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          disabled={uploadProgress >= 90} // Prevent closing during final stages
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          {/* Animated Upload Icon */}
          <div className="mb-6">
            <div className="relative w-20 h-20 mx-auto">
              {uploadProgress < 100 ? (
                <>
                  <div className="absolute inset-0 border-4 border-rose-200 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 border-4 border-rose-600 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-rose-600 animate-bounce" />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {uploadProgress < 100 ? 'Uploading Document' : 'Upload Complete! 🎉'}
          </h3>
          <p className="text-gray-600 mb-6">
            {uploadProgress < 100
              ? (uploadedFile ? `Uploading ${uploadedFile.name}...` : 'Preparing upload...')
              : 'Your document has been successfully uploaded to Cloudinary!'
            }
          </p>

          {/* Show preview when upload is complete */}
          {uploadProgress === 100 && formData.businessLicense && !formData.businessLicense.url.includes('.pdf') && (
            <div className="mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="text-sm font-medium text-gray-900 mb-3 text-center">Upload Complete!</h4>
                <img
                  src={formData.businessLicense.url}
                  alt="Uploaded document"
                  className="w-full h-32 object-contain rounded border bg-white mx-auto"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Preview+Unavailable';
                  }}
                />
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">{uploadProgress}% complete</p>
          </div>

          {/* File Info */}
          {uploadedFile && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
              <p className="text-xs text-gray-600">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {/* Animated dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[1] && !formData.firstName.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Your first name"
                />
                {validationErrors[1] && !formData.firstName.trim() && (
                  <p className="text-red-500 text-xs mt-1">First name is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[1] && !formData.lastName.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Your last name"
                />
                {validationErrors[1] && !formData.lastName.trim() && (
                  <p className="text-red-500 text-xs mt-1">Last name is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[1] && !formData.email.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {validationErrors[1] && !formData.email.trim() && (
                  <p className="text-red-500 text-xs mt-1">Email is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[1] && !formData.phone.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {validationErrors[1] && !formData.phone.trim() && (
                  <p className="text-red-500 text-xs mt-1">Phone number is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[1] && (!formData.password || formData.password.length < 6) ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Create a password (min 6 characters)"
                />
                {validationErrors[1] && (!formData.password || formData.password.length < 6) && (
                  <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[2] && !formData.businessName.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Your business name"
                />
                {validationErrors[2] && !formData.businessName.trim() && (
                  <p className="text-red-500 text-xs mt-1">Business name is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[2] && !formData.businessType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select business type</option>
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {validationErrors[2] && !formData.businessType && (
                  <p className="text-red-500 text-xs mt-1">Business type is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="https://yourbusiness.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Address *
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[2] && !formData.businessAddress.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Street address"
                />
                {validationErrors[2] && !formData.businessAddress.trim() && (
                  <p className="text-red-500 text-xs mt-1">Business address is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[2] && !formData.city.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="City"
                />
                {validationErrors[2] && !formData.city.trim() && (
                  <p className="text-red-500 text-xs mt-1">City is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State/Province *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                    validationErrors[2] && !formData.state.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="State/Province"
                />
                {validationErrors[2] && !formData.state.trim() && (
                  <p className="text-red-500 text-xs mt-1">State/Province is required</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Zip Code"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business Description *
                </label>
                <textarea
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none ${
                    validationErrors[2] && !formData.businessDescription.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Tell us about your business..."
                />
                {validationErrors[2] && !formData.businessDescription.trim() && (
                  <p className="text-red-500 text-xs mt-1">Business description is required</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h3>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Product Categories * (Select all that apply)
              </label>
              <div className={`grid md:grid-cols-2 gap-3 p-4 rounded-lg ${
                validationErrors[3] && formData.productCategories.length === 0 ? 'border border-red-300 bg-red-50' : 'border border-gray-200 bg-gray-50'
              }`}>
                {productCategories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.productCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-3 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
              {validationErrors[3] && formData.productCategories.length === 0 && (
                <p className="text-red-500 text-xs mt-2">Please select at least one product category</p>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Average Order Value (₹)
                </label>
                <input
                  type="text"
                  name="averageOrderValue"
                  value={formData.averageOrderValue}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="e.g., ₹500-1000 or ₹2500"
                  list="order-value-suggestions"
                />
                <datalist id="order-value-suggestions">
                  <option value="Under ₹500" />
                  <option value="₹500-1000" />
                  <option value="₹1000-2500" />
                  <option value="₹2500-5000" />
                  <option value="Over ₹5000" />
                </datalist>
                <p className="text-xs text-gray-500 mt-1">Enter amount in rupees or select from suggestions</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Monthly Volume
                </label>
                <select
                  name="monthlyVolume"
                  value={formData.monthlyVolume}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="">Select volume</option>
                  <option value="1-10">1-10 orders</option>
                  <option value="11-50">11-50 orders</option>
                  <option value="51-100">51-100 orders</option>
                  <option value="101-500">101-500 orders</option>
                  <option value="over-500">500+ orders</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Types & Details
              </label>
              <textarea
                name="productTypes"
                value={formData.productTypes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 resize-none"
                placeholder="Describe the types of products you plan to sell..."
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Documents</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Business License/Registration *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.businessLicense ? 'Replace your uploaded document' : 'Upload your business license or registration document'}
                  </p>
                  {formData.businessLicense && (
                    <div className="mt-4 space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">✓ Document uploaded successfully to Cloudinary</p>
                        <p className="text-xs text-green-600 mt-1">File ready for submission</p>
                      </div>

                      {/* Image Preview */}
                      <div className="relative">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900">📸 Document Preview</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                {formData.businessLicense.url.includes('.pdf') ? 'PDF Document' : 'Image Uploaded'}
                              </span>
                              <button
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    businessLicense: null
                                  }));
                                }}
                                className="text-xs text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors"
                                title="Remove document"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {formData.businessLicense.url.includes('.pdf') ? (
                            // PDF Preview
                            <div className="flex items-center justify-center p-8 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                              <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="mt-2 text-sm text-gray-600">PDF Document</p>
                                <p className="text-xs text-gray-500">Preview not available for PDF files</p>
                              </div>
                            </div>
                          ) : (
                            // Image Preview
                            <div className="relative">
                              <img
                                src={formData.businessLicense.url}
                                alt="Uploaded document"
                                className="w-full h-64 object-contain rounded border bg-white shadow-sm"
                                onError={(e) => {
                                  // Fallback for broken images
                                  e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Preview+Unavailable';
                                }}
                              />
                              <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow">
                                ✅ Uploaded to Cloudinary
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="businessLicense"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="businessLicense"
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer ${
                      isUploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUploading ? 'Uploading...' : formData.businessLicense ? 'Replace File' : 'Choose File'}
                  </label>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tax ID/EIN *
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                      validationErrors[4] && !formData.taxId.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="XX-XXXXXXX"
                  />
                  {validationErrors[4] && !formData.taxId.trim() && (
                    <p className="text-red-500 text-xs mt-1">Tax ID is required</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank Account Number *
                  </label>
                  <input
                    type="text"
                    name="bankAccount"
                    value={formData.bankAccount}
                    onChange={handleInputChange}
                    required
                    maxLength={30}
                    minLength={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 ${
                      validationErrors[4] && !formData.bankAccount.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter full bank account number"
                  />
                  {validationErrors[4] && !formData.bankAccount.trim() && (
                    <p className="text-red-500 text-xs mt-1">Bank account number is required</p>
                  )}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All documents will be securely stored and used only for verification purposes. 
                  We support PDF, JPG, JPEG, and PNG formats up to 10MB.
                </p>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Application</h3>
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Personal Information</h4>
                <p className="text-sm text-gray-600">
                  {formData.firstName} {formData.lastName} • {formData.email} • {formData.phone}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Business Information</h4>
                <p className="text-sm text-gray-600">
                  {formData.businessName} • {formData.businessType} • {formData.city}, {formData.state}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Product Categories</h4>
                <p className="text-sm text-gray-600">
                  {formData.productCategories.join(", ") || "None selected"}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  required
                  className={`mr-3 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded mt-1 ${
                    validationErrors[5] && !formData.termsAccepted ? 'border-red-300' : ''
                  }`}
                />
                <div className={`${validationErrors[5] && !formData.termsAccepted ? 'text-red-700' : 'text-gray-700'}`}>
                  <span className="text-sm">
                    I agree to the <a href="/terms-conditions" className="text-rose-600 hover:underline">Terms & Conditions</a> and 
                    <a href="/privacy-policy" className="text-rose-600 hover:underline ml-1">Privacy Policy</a>
                  </span>
                  {validationErrors[5] && !formData.termsAccepted && (
                    <p className="text-red-500 text-xs mt-1">You must accept the terms and conditions to continue</p>
                  )}
                </div>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleInputChange}
                  className="mr-3 h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded mt-1"
                />
                <span className="text-sm text-gray-700">
                  I consent to receive marketing communications and updates about vendor opportunities
                </span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Upload Modal */}
      {isUploading && <UploadModal />}
      
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {activeTab === "register" ? "Become a Vendor" : "Vendor Portal"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {activeTab === "register" 
              ? "Join thousands of successful vendors on our platform and grow your business with us. Start selling to customers worldwide today!"
              : "Access your vendor dashboard to manage your products, orders, and business analytics."
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab("register")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "register"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Become a Vendor
            </button>
            <button
              onClick={() => setActiveTab("login")}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-rose-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Login
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          {activeTab === "register" ? (
            <>
              {/* Benefits Section - Only show for registration */}
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                      <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-rose-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Progress Steps */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-8">
                  {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isActive ? 'bg-rose-600 text-white' : 
                          isCompleted ? 'bg-green-600 text-white' : 
                          'bg-gray-200 text-gray-600'
                        }`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-medium ${isActive ? 'text-rose-600' : 'text-gray-600'}`}>
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`hidden md:block absolute w-full h-0.5 top-6 left-1/2 ${
                            isCompleted ? 'bg-green-600' : 'bg-gray-200'
                          }`} style={{ transform: 'translateX(50%)', width: 'calc(100% - 48px)' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="bg-gray-50 rounded-xl p-6">
                {renderStepContent()}
              </div>
            </>
          ) : (
            /* Login Form */
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-rose-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Vendor Login</h3>
                <p className="text-gray-600">Access your vendor dashboard</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="your@email.com"
                      disabled={loginLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginInputChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your password"
                      disabled={loginLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loginLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {loginError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{loginError}</span>
                  </div>
                )}

                {/* Success Message */}
                {loginSuccess && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{loginSuccess}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-rose-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In to Dashboard
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="text-center space-y-2 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    Become a Vendor
                  </button>
                </p>
                <p className="text-sm text-gray-600">
                  <a
                    href="/forgot-password"
                    className="text-rose-600 hover:text-rose-700"
                  >
                    Forgot your password?
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons - Only show for registration */}
        {activeTab === "register" && (
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Previous
            </button>
            
            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  validateStep(currentStep)
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.termsAccepted}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle className="h-5 w-5" />
                Submit Application
              </button>
            )}
          </div>
        )}

        {/* Additional Info - Only show for registration */}
        {activeTab === "register" && (
          <div className="mt-12 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-xl mb-6 opacity-90">
              Join our community of successful vendors and start growing your business today!
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">2-3 Days</div>
                <div className="opacity-90">Application Review</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="opacity-90">Vendor Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">No Setup</div>
                <div className="opacity-90">Fees to Start</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
