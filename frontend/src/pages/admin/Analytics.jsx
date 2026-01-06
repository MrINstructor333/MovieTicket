import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Ticket,
  Users,
  Film,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Target,
  PieChart
} from 'lucide-react';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  // Mock analytics data
  const analytics = {
    revenue: {
      total: 45680,
      change: 12.5,
      isPositive: true,
    },
    bookings: {
      total: 1284,
      change: 8.3,
      isPositive: true,
    },
    avgTicketPrice: {
      total: 14.50,
      change: -2.1,
      isPositive: false,
    },
    occupancyRate: {
      total: 78,
      change: 5.2,
      isPositive: true,
    }
  };

  const genreData = [
    { name: 'Action', value: 35, color: '#3b82f6' },
    { name: 'Drama', value: 25, color: '#8b5cf6' },
    { name: 'Comedy', value: 20, color: '#10b981' },
    { name: 'Sci-Fi', value: 12, color: '#f59e0b' },
    { name: 'Horror', value: 8, color: '#ef4444' },
  ];

  const dailyRevenue = [
    { day: 'Mon', revenue: 4200, bookings: 180 },
    { day: 'Tue', revenue: 3800, bookings: 150 },
    { day: 'Wed', revenue: 5100, bookings: 210 },
    { day: 'Thu', revenue: 4600, bookings: 195 },
    { day: 'Fri', revenue: 7200, bookings: 320 },
    { day: 'Sat', revenue: 8500, bookings: 380 },
    { day: 'Sun', revenue: 6800, bookings: 290 },
  ];

  const topPerformers = [
    { title: 'The Dark Knight', revenue: 12500, tickets: 540, occupancy: 92 },
    { title: 'Inception', revenue: 9800, tickets: 420, occupancy: 85 },
    { title: 'Interstellar', revenue: 8200, tickets: 350, occupancy: 78 },
    { title: 'The Hangover', revenue: 6500, tickets: 280, occupancy: 72 },
    { title: 'Titanic', revenue: 5400, tickets: 230, occupancy: 68 },
  ];

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-1">Track your cinema performance</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-dark-800 border border-white/5">
          {['week', 'month', 'quarter', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-12 gap-6"
      >
        {/* KPI Cards - Row 1 */}
        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bento-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <DollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                analytics.revenue.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {analytics.revenue.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {analytics.revenue.change}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-white mt-1">${analytics.revenue.total.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bento-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Ticket className="w-6 h-6 text-blue-400" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                analytics.bookings.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {analytics.bookings.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {analytics.bookings.change}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Total Bookings</h3>
            <p className="text-3xl font-bold text-white mt-1">{analytics.bookings.total.toLocaleString()}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bento-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Target className="w-6 h-6 text-amber-400" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                analytics.avgTicketPrice.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {analytics.avgTicketPrice.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(analytics.avgTicketPrice.change)}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Avg Ticket Price</h3>
            <p className="text-3xl font-bold text-white mt-1">${analytics.avgTicketPrice.total}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-12 sm:col-span-6 lg:col-span-3">
          <div className="bento-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-violet-500/10">
                <Users className="w-6 h-6 text-violet-400" />
              </div>
              <span className={`flex items-center text-sm font-medium ${
                analytics.occupancyRate.isPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {analytics.occupancyRate.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {analytics.occupancyRate.change}%
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">Occupancy Rate</h3>
            <p className="text-3xl font-bold text-white mt-1">{analytics.occupancyRate.total}%</p>
          </div>
        </motion.div>

        {/* Weekly Revenue Chart */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8">
          <div className="bento-card p-6 h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                <p className="text-sm text-gray-400">Daily revenue breakdown</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent-cyan" />
                  <span className="text-gray-400">Revenue</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-gray-400">Bookings</span>
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[280px] flex items-end justify-between gap-4 px-4">
              {dailyRevenue.map((day, i) => {
                const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue));
                const maxBookings = Math.max(...dailyRevenue.map(d => d.bookings));
                const revenueHeight = (day.revenue / maxRevenue) * 100;
                const bookingsHeight = (day.bookings / maxBookings) * 100;
                
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full h-[240px] flex items-end justify-center gap-1.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${revenueHeight}%` }}
                        transition={{ delay: i * 0.05, duration: 0.5 }}
                        className="w-6 bg-gradient-to-t from-primary to-accent-cyan rounded-t-md relative group cursor-pointer"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          ${day.revenue.toLocaleString()}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${bookingsHeight * 0.8}%` }}
                        transition={{ delay: i * 0.05 + 0.1, duration: 0.5 }}
                        className="w-4 bg-violet-500 rounded-t-md relative group cursor-pointer opacity-70"
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-dark-700 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {day.bookings} bookings
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Genre Distribution */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4">
          <div className="bento-card p-6 h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Genre Distribution</h3>
                <p className="text-sm text-gray-400">Bookings by genre</p>
              </div>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>

            {/* Simple bar representation */}
            <div className="space-y-4">
              {genreData.map((genre, i) => (
                <div key={genre.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-medium">{genre.name}</span>
                    <span className="text-gray-400">{genre.value}%</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${genre.value}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: genre.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-white/5">
              <div className="flex flex-wrap gap-3">
                {genreData.map((genre) => (
                  <span key={genre.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: genre.color }} />
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top Performing Movies */}
        <motion.div variants={itemVariants} className="col-span-12">
          <div className="bento-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Top Performing Movies</h3>
                <p className="text-sm text-gray-400">Best sellers this {timeRange}</p>
              </div>
              <Film className="w-5 h-5 text-gray-400" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Movie</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tickets Sold</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Occupancy</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topPerformers.map((movie, i) => (
                    <tr key={movie.title} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          i === 0 ? 'bg-amber-500/20 text-amber-400' :
                          i === 1 ? 'bg-gray-500/20 text-gray-400' :
                          i === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-dark-800 text-gray-500'
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-medium">{movie.title}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-white font-semibold">${movie.revenue.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-gray-300">{movie.tickets.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 h-2 bg-dark-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
                              style={{ width: `${movie.occupancy}%` }}
                            />
                          </div>
                          <span className="text-gray-400 text-sm w-10">{movie.occupancy}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="flex items-center justify-end text-emerald-400">
                          <TrendingUp className="w-4 h-4" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
