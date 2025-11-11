import { useState, useEffect } from "react";
import { Upload, Save, RefreshCw, Globe, Eye, X, Loader2, Settings, Palette } from "lucide-react";

interface HomeSettings {
  _id?: string;
  name: string;
  tagline: string;
  logo?: {
    public_id?: string;
    url: string;
  };
  favicon?: {
    public_id?: string;
    url: string;
  };
  supportEmail: string;
  supportPhone: string;
  footerMessage: string;
  announcement: {
    enabled: boolean;
    message: string;
    link: string;
  };
}

const defaultSettings: HomeSettings = {
  name: "MultiVendor",
  tagline: "Where Great Products Meet Happy Customers",
  supportEmail: "support@multivendor.com",
  supportPhone: "+1 (555) 123-4567",
  footerMessage: "© 2024 MultiVendor. All rights reserved.",
  announcement: {
    enabled: false,
    message: "",
    link: ""
  }
};

export default function WebsiteSettingsPage() {
  const [settings, setSettings] = useState<HomeSettings>(defaultSettings);
  const [draft, setDraft] = useState<HomeSettings>(defaultSettings);
  const [showLogoPreview, setShowLogoPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/routes/home-settings');
      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
        setDraft(data.data);
      } else {
        showMessage('error', data.message || 'Failed to load settings');
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      showMessage('error', 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, key: "logo" | "favicon") => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Image size should be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please upload an image file');
      return;
    }

    try {
      // Set uploading state
      if (key === 'logo') {
        setIsUploadingLogo(true);
      } else {
        setIsUploadingFavicon(true);
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('files', file);
      formData.append('folder', 'home-settings');

      // Upload to Cloudinary via API
      const response = await fetch('/api/routes/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        const uploadedImage = data.data[0];
        setDraft((prev) => ({ 
          ...prev, 
          [key]: { 
            url: uploadedImage.secure_url || uploadedImage.url,
            public_id: uploadedImage.public_id 
          } 
        }));
        showMessage('success', `${key === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully!`);
      } else {
        showMessage('error', data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      // Reset uploading state
      if (key === 'logo') {
        setIsUploadingLogo(false);
      } else {
        setIsUploadingFavicon(false);
      }
    }
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && confirm("Reset all changes to last saved state?")) {
      setDraft(settings);
      showMessage('success', 'Changes reset');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/routes/home-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
        setDraft(data.data);
        showMessage('success', 'Settings saved successfully!');
      } else {
        showMessage('error', data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Save settings error:', error);
      showMessage('error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Reset all settings to default? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSaving(true);
      
      const response = await fetch('/api/routes/home-settings', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
        setDraft(data.data);
        showMessage('success', 'Settings reset to default successfully!');
      } else {
        showMessage('error', data.message || 'Failed to reset settings');
      }
    } catch (error) {
      console.error('Reset settings error:', error);
      showMessage('error', 'Failed to reset settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Website Identity & Branding</h1>
          <p className="text-gray-600 mt-2">Manage marketplace identity, colors, and contact details shown across the platform.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </button>
          <button
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings className="h-4 w-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Brand Basics</h2>
                <p className="text-sm text-gray-500">Logo, name, tagline, and primary contact information.</p>
              </div>
              <Palette className="h-5 w-5 text-purple-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Name</label>
                <input
                  value={draft.name}
                  onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  value={draft.tagline}
                  onChange={(event) => setDraft((prev) => ({ ...prev, tagline: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={draft.supportEmail}
                  onChange={(event) => setDraft((prev) => ({ ...prev, supportEmail: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                <input
                  value={draft.supportPhone}
                  onChange={(event) => setDraft((prev) => ({ ...prev, supportPhone: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Message</label>
              <textarea
                value={draft.footerMessage}
                onChange={(event) => setDraft((prev) => ({ ...prev, footerMessage: event.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Logo & Favicon</h2>
                <p className="text-sm text-gray-500">Upload your brand logo and favicon images.</p>
              </div>
              <Upload className="h-5 w-5 text-purple-500" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-32 text-sm text-gray-500 transition-colors ${
                  isUploadingLogo ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-purple-500'
                }`}>
                  {isUploadingLogo ? (
                    <>
                      <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                      <span className="mt-2 text-purple-600 font-medium">Uploading...</span>
                    </>
                  ) : draft.logo?.url ? (
                    <img src={draft.logo.url} alt="Logo preview" className="h-20 object-contain" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span>Click to upload logo</span>
                      <span className="text-xs text-gray-400 mt-1">Max 2MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingLogo}
                    onChange={(event) => handleImageUpload(event, "logo")}
                  />
                </label>
                {draft.logo?.url && !isUploadingLogo && (
                  <button
                    onClick={() => setShowLogoPreview(true)}
                    className="mt-2 text-xs text-purple-600 hover:underline flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" /> Preview large
                  </button>
                )}
              </div>
              <div className="w-36">
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <label className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-32 text-sm text-gray-500 transition-colors ${
                  isUploadingFavicon ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-purple-500'
                }`}>
                  {isUploadingFavicon ? (
                    <>
                      <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                      <span className="mt-2 text-purple-600 font-medium text-[11px]">Uploading...</span>
                    </>
                  ) : draft.favicon?.url ? (
                    <img src={draft.favicon.url} alt="Favicon preview" className="h-12 object-contain" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span className="text-[11px]">Upload favicon</span>
                      <span className="text-[10px] text-gray-400 mt-1">Max 2MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingFavicon}
                    onChange={(event) => handleImageUpload(event, "favicon")}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Announcement Bar</h2>
                <p className="text-sm text-gray-500">Configure top-of-site announcement messages.</p>
              </div>
              <Globe className="h-5 w-5 text-sky-500" />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={draft.announcement.enabled}
                onChange={(event) => setDraft((prev) => ({ ...prev, announcement: { ...prev.announcement, enabled: event.target.checked } }))}
                className="h-4 w-4"
                id="announcement-enabled"
              />
              <label htmlFor="announcement-enabled" className="text-sm text-gray-700">Enable announcement bar</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Message</label>
                <textarea
                  value={draft.announcement.message}
                  onChange={(event) => setDraft((prev) => ({ ...prev, announcement: { ...prev.announcement, message: event.target.value } }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  value={draft.announcement.link}
                  onChange={(event) => setDraft((prev) => ({ ...prev, announcement: { ...prev.announcement, link: event.target.value } }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4 sticky top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              <Eye className="h-5 w-5 text-purple-500" />
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-900 text-white px-4 py-3 text-sm">/homepage</div>
              <div className="p-6 space-y-4 border-t-4 border-purple-500">
                {/* Logo Preview */}
                {draft.logo?.url && (
                  <div className="flex justify-center py-2">
                    <img src={draft.logo.url} alt="Logo" className="h-16 object-contain" />
                  </div>
                )}
                
                {/* Brand Info */}
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{draft.name}</div>
                  <div className="text-sm text-gray-500 mt-1">{draft.tagline}</div>
                </div>

                {/* Announcement Preview */}
                {draft.announcement.enabled && draft.announcement.message && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                    <p className="text-sm font-medium text-purple-700">{draft.announcement.message}</p>
                    {draft.announcement.link && (
                      <a href={draft.announcement.link} className="text-xs text-purple-600 hover:underline mt-1 inline-block">
                        {draft.announcement.link}
                      </a>
                    )}
                  </div>
                )}
                <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">{draft.footerMessage}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showLogoPreview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setShowLogoPreview(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo Preview</h2>
            <div className="border border-dashed border-gray-300 rounded-xl p-6 grid place-items-center">
              <img src={draft.logo?.url} alt="Logo preview" className="max-h-32 object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
