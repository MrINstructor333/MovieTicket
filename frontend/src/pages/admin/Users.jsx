import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users as UsersIcon, 
  Search, 
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  Filter,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../api/services';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mock data for demonstration
  const mockUsers = [
    { id: 1, username: 'admin', email: 'admin@cinema.com', role: 'admin', is_active: true, date_joined: '2024-01-01' },
    { id: 2, username: 'john_doe', email: 'john@example.com', role: 'customer', is_active: true, date_joined: '2024-06-15' },
    { id: 3, username: 'jane_smith', email: 'jane@example.com', role: 'customer', is_active: true, date_joined: '2024-08-20' },
    { id: 4, username: 'mike_wilson', email: 'mike@example.com', role: 'customer', is_active: false, date_joined: '2024-09-10' },
    { id: 5, username: 'sarah_jones', email: 'sarah@example.com', role: 'customer', is_active: true, date_joined: '2024-10-05' },
    { id: 6, username: 'emma_davis', email: 'emma@example.com', role: 'customer', is_active: true, date_joined: '2024-11-12' },
    { id: 7, username: 'david_brown', email: 'david@example.com', role: 'customer', is_active: true, date_joined: '2024-12-01' },
  ];

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      // Handle both paginated (results array) and direct array responses
      const userList = data.results || data || [];
      setUsers(userList.length > 0 ? userList : mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Use mock data on error
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-dark-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 lg:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Users</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage user accounts</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bento-card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <UsersIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <UserCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-500/10">
              <Shield className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bento-card p-4 mb-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="neu-search w-full"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="neu-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Table - Desktop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:block bento-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Joined</th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  variants={itemVariants}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent-cyan/30 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UsersIcon className="w-3 h-3" />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                      user.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {user.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(user.date_joined).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State - Desktop */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </motion.div>

      {/* Users Cards - Mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="md:hidden space-y-4"
      >
        {filteredUsers.length === 0 ? (
          <div className="bento-card text-center py-12">
            <UsersIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              variants={itemVariants}
              className="bento-card p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent-cyan/30 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{user.username}</h3>
                    <p className="text-gray-400 text-sm truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  user.role === 'admin'
                    ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UsersIcon className="w-3 h-3" />}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  user.is_active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {user.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-xs pt-3 border-t border-white/5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(user.date_joined).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default AdminUsers;
