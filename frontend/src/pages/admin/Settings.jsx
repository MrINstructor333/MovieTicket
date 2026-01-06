import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import SkeuToggle from '../../components/ui/SkeuToggle';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General
    siteName: 'CineVerse',
    siteDescription: 'Your premium movie booking experience',
    timezone: 'UTC',
    currency: 'USD',
    // Notifications
    emailNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    // Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    ipWhitelist: '',
    // Appearance
    theme: 'dark',
    accentColor: '#0066ff',
    showAnimations: true,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Settings saved successfully');
    setSaving(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-dark-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your application settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="neu-button-primary inline-flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-12 gap-6"
      >
        {/* Sidebar Tabs */}
        <motion.div variants={itemVariants} className="col-span-12 md:col-span-3">
          <div className="bento-card p-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`neu-tab w-full flex items-center gap-3 px-4 py-3 text-left ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={itemVariants} className="col-span-12 md:col-span-9">
          <div className="bento-card p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-white">General Settings</h2>
                </div>

                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => handleChange('siteName', e.target.value)}
                      className="neu-input-admin w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Site Description</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleChange('siteDescription', e.target.value)}
                      rows={3}
                      className="neu-textarea w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleChange('timezone', e.target.value)}
                        className="neu-select w-full"
                      >
                        <option value="UTC">UTC</option>
                        <option value="EST">EST</option>
                        <option value="PST">PST</option>
                        <option value="GMT">GMT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="neu-select w-full"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="TZS">TZS (TSh)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email notifications for important updates' },
                    { key: 'bookingAlerts', label: 'Booking Alerts', description: 'Get notified when new bookings are made' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional emails and offers' },
                    { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly summary reports via email' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-5 bg-dark-800 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <div>
                        <h3 className="text-white font-medium">{item.label}</h3>
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      </div>
                      <SkeuToggle
                        checked={settings[item.key]}
                        onChange={(value) => handleChange(item.key, value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-white">Security Settings</h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-5 bg-dark-800 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <SkeuToggle
                      checked={settings.twoFactorAuth}
                      onChange={(value) => handleChange('twoFactorAuth', value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Session Timeout (minutes)</label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                      className="neu-select w-full"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">IP Whitelist</label>
                    <textarea
                      value={settings.ipWhitelist}
                      onChange={(e) => handleChange('ipWhitelist', e.target.value)}
                      placeholder="Enter IP addresses, one per line"
                      rows={4}
                      className="neu-textarea w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty to allow all IPs</p>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Palette className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-semibold text-white">Appearance Settings</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">Theme</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['light', 'dark', 'system'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleChange('theme', theme)}
                          className={`p-4 rounded-xl border-2 transition-colors ${
                            settings.theme === theme
                              ? 'border-primary bg-primary/10'
                              : 'border-white/5 hover:border-white/10 bg-dark-800'
                          }`}
                        >
                          <div className={`w-full h-12 rounded-lg mb-3 ${
                            theme === 'light' ? 'bg-gray-100' :
                            theme === 'dark' ? 'bg-dark-900' :
                            'bg-gradient-to-r from-gray-100 to-dark-900'
                          }`} />
                          <span className="text-white font-medium capitalize">{theme}</span>
                          {settings.theme === theme && (
                            <Check className="w-4 h-4 text-primary mt-2 mx-auto" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Accent Color</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="w-12 h-12 rounded-xl border border-white/5 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.accentColor}
                        onChange={(e) => handleChange('accentColor', e.target.value)}
                        className="neu-input-admin flex-1 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-dark-800 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <div>
                      <h3 className="text-white font-medium">Show Animations</h3>
                      <p className="text-sm text-gray-400 mt-1">Enable smooth animations throughout the app</p>
                    </div>
                    <SkeuToggle
                      checked={settings.showAnimations}
                      onChange={(value) => handleChange('showAnimations', value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
