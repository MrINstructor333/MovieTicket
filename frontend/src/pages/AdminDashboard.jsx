import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Film, 
  Ticket, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { GlassCard, BentoGrid, BentoItem, Loader } from '../components/ui';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      toast.error('Access denied. Admin only.');
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboard();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats if API fails
        setStats({
          total_users: 0,
          total_movies: 0,
          total_bookings: 0,
          total_revenue: 0,
          recent_bookings: [],
          popular_movies: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: '+12%',
    },
    {
      title: 'Total Movies',
      value: stats?.total_movies || 0,
      icon: Film,
      color: 'from-purple-500 to-pink-500',
      change: '+5%',
    },
    {
      title: 'Total Bookings',
      value: stats?.total_bookings || 0,
      icon: Ticket,
      color: 'from-green-500 to-emerald-500',
      change: '+23%',
    },
    {
      title: 'Revenue',
      value: `TZS ${(stats?.total_revenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500',
      change: '+18%',
    },
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Admin</span>
            <span className="text-white"> Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Welcome back! Here's what's happening with your cinema today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2 text-green-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Bento Grid Dashboard */}
        <BentoGrid>
          {/* Recent Bookings */}
          <BentoItem span={2} rowSpan={2}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recent Bookings</h3>
                <Calendar className="w-5 h-5 text-accent-cyan" />
              </div>
              <div className="flex-1 space-y-3">
                {(stats?.recent_bookings || []).slice(0, 5).map((booking, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                        <Ticket className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {booking.movie || 'Movie'}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {booking.user || 'User'} • {booking.seats} seats
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${booking.status === 'CONFIRMED'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
                {(!stats?.recent_bookings || stats.recent_bookings.length === 0) && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No recent bookings
                  </div>
                )}
              </div>
            </div>
          </BentoItem>

          {/* Revenue Chart Placeholder */}
          <BentoItem span={2}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
                <BarChart3 className="w-5 h-5 text-accent-purple" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-accent-cyan" />
                  </div>
                  <p className="text-gray-400">Revenue analytics coming soon</p>
                </div>
              </div>
            </div>
          </BentoItem>

          {/* Top Movies */}
          <BentoItem span={2}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Top Movies</h3>
                <PieChart className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1 space-y-3">
                {(stats?.top_movies || []).slice(0, 3).map((movie, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-white font-medium">{movie.title}</span>
                    </div>
                    <span className="text-accent-cyan font-semibold">
                      {movie.bookings} bookings
                    </span>
                  </div>
                ))}
                {(!stats?.top_movies || stats.top_movies.length === 0) && (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </div>
            </div>
          </BentoItem>

          {/* Quick Actions */}
          <BentoItem span={2}>
            <div className="h-full">
              <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Add Movie', icon: Film, color: 'from-primary to-accent-cyan' },
                  { label: 'Add Show', icon: Calendar, color: 'from-accent-purple to-pink-500' },
                  { label: 'View Reports', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
                  { label: 'Manage Users', icon: Users, color: 'from-yellow-500 to-orange-500' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </BentoItem>

          {/* Today's Shows */}
          <BentoItem span={2}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Today's Shows</h3>
                <span className="text-accent-cyan font-semibold">
                  {stats?.todays_shows || 0} shows
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl font-bold gradient-text mb-2">
                    {stats?.todays_shows || 0}
                  </p>
                  <p className="text-gray-400">Shows scheduled for today</p>
                </div>
              </div>
            </div>
          </BentoItem>
        </BentoGrid>
      </div>
    </div>
  );
};

export default AdminDashboard;
