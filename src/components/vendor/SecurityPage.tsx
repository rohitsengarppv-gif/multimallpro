import { useState } from "react";
import { Shield, Key, Smartphone, Eye, EyeOff, Check, X, AlertTriangle } from "lucide-react";

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState([
    "1234-5678", "9876-5432", "2468-1357", "8642-9753", "1357-2468"
  ]);

  const securityLogs = [
    {
      id: 1,
      action: "Password Changed",
      timestamp: "2024-11-06 10:30 AM",
      ip: "192.168.1.100",
      device: "Chrome on Windows",
      status: "success"
    },
    {
      id: 2,
      action: "Login Attempt",
      timestamp: "2024-11-06 09:15 AM",
      ip: "192.168.1.100",
      device: "Chrome on Windows",
      status: "success"
    },
    {
      id: 3,
      action: "Failed Login",
      timestamp: "2024-11-05 11:45 PM",
      ip: "203.0.113.1",
      device: "Unknown Device",
      status: "failed"
    },
    {
      id: 4,
      action: "2FA Enabled",
      timestamp: "2024-11-05 02:20 PM",
      ip: "192.168.1.100",
      device: "Chrome on Windows",
      status: "success"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600";
      case "failed": return "text-red-600";
      case "warning": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <Check className="h-4 w-4 text-green-600" />;
      case "failed": return <X className="h-4 w-4 text-red-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account security and privacy settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-600">Update your account password</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Authenticator App</h4>
                <p className="text-sm text-gray-600">Use an app like Google Authenticator</p>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </div>
            </div>

            {twoFactorEnabled && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Backup Codes</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Save these codes in a safe place. You can use them to access your account if you lose your phone.
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="font-mono text-sm bg-white p-2 rounded border">
                      {code}
                    </div>
                  ))}
                </div>
                <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
                  Generate New Codes
                </button>
              </div>
            )}

            <button 
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                twoFactorEnabled 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </button>
          </div>
        </div>
      </div>

      {/* Security Activity Log */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Security Activity</h3>
            <p className="text-sm text-gray-600">Recent security events for your account</p>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="block md:hidden space-y-4">
          {securityLogs.map((log) => (
            <div key={log.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{log.action}</span>
                {getStatusIcon(log.status)}
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{log.timestamp}</p>
                <p>IP: {log.ip}</p>
                <p>{log.device}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Action</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Timestamp</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">IP Address</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Device</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{log.action}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{log.timestamp}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{log.ip}</td>
                  <td className="px-4 py-4 text-sm text-gray-600">{log.device}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.status)}
                      <span className={`text-sm font-medium ${getStatusColor(log.status)}`}>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
