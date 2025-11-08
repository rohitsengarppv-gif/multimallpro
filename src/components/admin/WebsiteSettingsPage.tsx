import { useState } from "react";
import { Upload, Save, RefreshCw, Palette, Globe, Eye, X } from "lucide-react";

interface BrandingPreview {
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  supportPhone: string;
  footerMessage: string;
}

const defaultBranding: BrandingPreview = {
  name: "MultiVendor",
  tagline: "Where Great Products Meet Happy Customers",
  primaryColor: "#7c3aed",
  secondaryColor: "#f97316",
  logoUrl: "https://dummyimage.com/200x80/7c3aed/ffffff&text=MultiVendor",
  faviconUrl: "https://dummyimage.com/64x64/f97316/ffffff&text=MV",
  supportEmail: "support@multivendor.com",
  supportPhone: "+1 (555) 123-4567",
  footerMessage: "© 2024 MultiVendor. All rights reserved."
};

export default function WebsiteSettingsPage() {
  const [branding, setBranding] = useState(defaultBranding);
  const [draft, setDraft] = useState(defaultBranding);
  const [announcement, setAnnouncement] = useState({
    enabled: true,
    message: "Holiday Sale Week! Free shipping on orders over $50.",
    link: "/deals",
  });
  const [showLogoPreview, setShowLogoPreview] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, key: "logoUrl" | "faviconUrl") => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (result) => {
      const url = typeof result.target?.result === "string" ? result.target.result : "";
      setDraft((prev) => ({ ...prev, [key]: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    if (typeof window !== "undefined" && confirm("Reset all branding changes?")) {
      setDraft(branding);
    }
  };

  const handleSave = () => {
    setBranding(draft);
    alert("Branding changes saved.");
  };

  const primaryStyles = {
    backgroundColor: draft.primaryColor,
    borderColor: draft.primaryColor,
    color: draft.primaryColor,
  };

  const secondaryStyles = {
    backgroundColor: draft.secondaryColor,
    borderColor: draft.secondaryColor,
    color: draft.secondaryColor,
  };

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
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
          >
            <Save className="h-4 w-4" />
            Save Branding
          </button>
        </div>
      </div>

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
                <h2 className="text-lg font-semibold text-gray-900">Colors & Identity</h2>
                <p className="text-sm text-gray-500">Choose brand colors used in buttons, highlights, and badges.</p>
              </div>
              <Globe className="h-5 w-5 text-orange-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.primaryColor}
                    onChange={(event) => setDraft((prev) => ({ ...prev, primaryColor: event.target.value }))}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    value={draft.primaryColor}
                    onChange={(event) => setDraft((prev) => ({ ...prev, primaryColor: event.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={draft.secondaryColor}
                    onChange={(event) => setDraft((prev) => ({ ...prev, secondaryColor: event.target.value }))}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    value={draft.secondaryColor}
                    onChange={(event) => setDraft((prev) => ({ ...prev, secondaryColor: event.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-32 cursor-pointer hover:border-purple-500 text-sm text-gray-500">
                  {draft.logoUrl ? (
                    <img src={draft.logoUrl} alt="Logo preview" className="h-20 object-contain" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span>Click to upload logo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, "logoUrl")}
                  />
                </label>
                {draft.logoUrl && (
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
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl h-32 cursor-pointer hover:border-purple-500 text-sm text-gray-500">
                  {draft.faviconUrl ? (
                    <img src={draft.faviconUrl} alt="Favicon preview" className="h-12 object-contain" />
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-gray-400" />
                      <span>Upload favicon</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, "faviconUrl")}
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
                checked={announcement.enabled}
                onChange={(event) => setAnnouncement((prev) => ({ ...prev, enabled: event.target.checked }))}
                className="h-4 w-4"
                id="announcement-enabled"
              />
              <label htmlFor="announcement-enabled" className="text-sm text-gray-700">Enable announcement bar</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Announcement Message</label>
                <textarea
                  value={announcement.message}
                  onChange={(event) => setAnnouncement((prev) => ({ ...prev, message: event.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                <input
                  value={announcement.link}
                  onChange={(event) => setAnnouncement((prev) => ({ ...prev, link: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4 sticky top-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              <Palette className="h-5 w-5 text-purple-500" />
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-900 text-white px-4 py-3 text-sm">/homepage</div>
              <div className="p-6 space-y-4" style={{ borderTop: `4px solid ${draft.primaryColor}` }}>
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 rounded-lg grid place-items-center text-white text-sm font-bold"
                    style={primaryStyles}
                  >
                    {draft.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{draft.name}</div>
                    <div className="text-sm text-gray-500">{draft.tagline}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs font-semibold text-white rounded-full" style={primaryStyles}>
                    Primary Button
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold text-white rounded-full" style={secondaryStyles}>
                    Secondary Button
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold text-gray-700 border border-gray-300 rounded-full">
                    Neutral
                  </span>
                </div>
                {announcement.enabled && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3">
                    <p className="text-sm font-medium text-purple-700">{announcement.message}</p>
                    {announcement.link && (
                      <a href={announcement.link} className="text-xs text-purple-500 hover:underline">
                        Visit {announcement.link}
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
              <img src={draft.logoUrl} alt="Logo preview" className="max-h-32 object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
