import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Film, 
  Users, 
  Ticket, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal
} from 'lucide-react';
import { adminService, movieService, bookingService } from '../../api/services';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    topMovies: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [movies, bookings] = await Promise.all([
        movieService.getAll(),
        bookingService.getMyBookings(),
      ]);

      // Calculate stats
      const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

      setStats({
        totalMovies: movies.length || 0,
        totalUsers: 156, // Mock data - would come from admin API
        totalBookings: bookings.length || 0,
        totalRevenue: totalRevenue,
        recentBookings: bookings.slice(0, 5),
        topMovies: movies.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Movies',
      value: stats.totalMovies,
      change: '+12%',
      isPositive: true,
      icon: Film,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: '+8%',
      isPositive: true,
      icon: Users,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Bookings',
      value: stats.totalBookings,
      change: '+23%',
      isPositive: true,
      icon: Ticket,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-500/10',
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: '-5%',
      isPositive: false,
      icon: DollarSign,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
    },
  ];

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your cinema.</p>
      </motion.div>

      {/* Bento Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-12 gap-6"
      >
        {/* Stat Cards - Row 1 */}
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={itemVariants}
            className="col-span-12 sm:col-span-6 lg:col-span-3"
          >
            <div className="bento-card p-6 h-full">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} 
                    style={{ color: stat.color.includes('blue') ? '#3b82f6' : 
                             stat.color.includes('emerald') ? '#10b981' :
                             stat.color.includes('violet') ? '#8b5cf6' : '#f59e0b' }} 
                  />
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="mt-4">
                <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className={`flex items-center text-xs font-medium ${
                    stat.isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Revenue Chart - Large Card */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-8"
        >
          <div className="bento-card p-6 h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                <p className="text-sm text-gray-400">Monthly revenue statistics</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-white bg-primary/20 rounded-lg border border-primary/30">
                  Monthly
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  Weekly
                </button>
              </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-[280px] flex items-end justify-between gap-3 px-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const height = Math.random() * 80 + 20;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-primary/80 to-accent-cyan/60 rounded-t-lg relative group cursor-pointer"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${Math.floor(height * 100)}
                      </div>
                    </motion.div>
                    <span className="text-xs text-gray-500">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats - Side Card */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-4"
        >
          <div className="bento-card p-6 h-[400px]">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>
            
            <div className="space-y-6">
              {/* Today's Bookings */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Today's Bookings</p>
                  <p className="text-xl font-bold text-white">24</p>
                </div>
                <span className="text-emerald-400 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> 12%
                </span>
              </div>

              {/* Active Shows */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-violet-500/10">
                  <Clock className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Active Shows</p>
                  <p className="text-xl font-bold text-white">8</p>
                </div>
                <span className="text-emerald-400 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> 3%
                </span>
              </div>

              {/* Avg Ticket Price */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Avg Ticket Price</p>
                  <p className="text-xl font-bold text-white">$12.50</p>
                </div>
                <span className="text-red-400 text-sm font-medium flex items-center">
                  <TrendingDown className="w-4 h-4 mr-1" /> 2%
                </span>
              </div>

              {/* Seat Occupancy */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Seat Occupancy</p>
                  <p className="text-xl font-bold text-white">78%</p>
                </div>
                <span className="text-emerald-400 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" /> 5%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Bookings Table */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-7"
        >
          <div className="bento-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
              <button className="text-sm text-accent-cyan hover:underline">View All</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Booking ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Movie</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentBookings.length > 0 ? (
                    stats.recentBookings.map((booking, i) => (
                      <tr key={booking.id || i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 text-sm text-white font-mono">#{booking.id || `BK${1000 + i}`}</td>
                        <td className="py-4 px-4 text-sm text-gray-300">{booking.movie_title || 'Unknown Movie'}</td>
                        <td className="py-4 px-4 text-sm text-gray-300">{booking.user_name || 'Customer'}</td>
                        <td className="py-4 px-4 text-sm text-white font-medium">${booking.total_price || '0.00'}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === 'CONFIRMED' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : booking.status === 'PENDING'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {booking.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Mock data if no real bookings
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 text-sm text-white font-mono">#BK{1000 + i}</td>
                        <td className="py-4 px-4 text-sm text-gray-300">The Dark Knight</td>
                        <td className="py-4 px-4 text-sm text-gray-300">John Doe</td>
                        <td className="py-4 px-4 text-sm text-white font-medium">${(Math.random() * 50 + 10).toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Confirmed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Top Movies */}
        <motion.div
          variants={itemVariants}
          className="col-span-12 lg:col-span-5"
        >
          <div className="bento-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Top Movies</h3>
              <button className="text-sm text-accent-cyan hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {(stats.topMovies.length > 0 ? stats.topMovies : [
                { title: 'The Dark Knight', genre: 'Action', rating: 9.0 },
                { title: 'Inception', genre: 'Sci-Fi', rating: 8.8 },
                { title: 'Interstellar', genre: 'Sci-Fi', rating: 8.6 },
                { title: 'The Hangover', genre: 'Comedy', rating: 7.7 },
                { title: 'Titanic', genre: 'Romance', rating: 7.9 },
              ]).map((movie, i) => (
                <div key={movie.id || i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center text-sm font-bold text-accent-cyan">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{movie.title}</p>
                    <p className="text-xs text-gray-500">{movie.genre}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{movie.rating || '8.5'}</p>
                    <p className="text-xs text-gray-500">rating</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
