import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Input, GlassCard, Loader } from '../components/ui';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">My</span>
            <span className="text-white"> Profile</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center text-4xl font-bold text-white">
                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-400">@{user.username}</p>
                {user.is_staff && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-purple/20 text-accent-purple border border-accent-purple/30">
                    Admin
                  </span>
                )}
              </div>
              {!editing && (
                <Button
                  variant="glass"
                  icon={Edit2}
                  onClick={() => setEditing(true)}
                  className="ml-auto"
                >
                  Edit
                </Button>
              )}
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={User}
                />
                <Input
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={!editing}
                  icon={User}
                />
              </div>

              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                icon={Mail}
              />

              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                icon={Phone}
              />

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user.date_joined).toLocaleDateString()}</span>
              </div>

              {editing && (
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="clay"
                    icon={Save}
                    loading={loading}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    icon={X}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </GlassCard>
        </motion.div>

        {/* Additional Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <GlassCard>
            <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                <span className="text-gray-300">Change Password</span>
                <span className="text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                <span className="text-gray-300">Notification Preferences</span>
                <span className="text-gray-500">→</span>
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-all text-left">
                <span className="text-red-400">Delete Account</span>
                <span className="text-red-500">→</span>
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
