import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter,
  Calendar,
  Clock,
  CreditCard,
  Eye,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Download,
  TrendingUp,
  Wallet,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import api from '../../api/axios';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments/');
      setPayments(response.data.results || response.data || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      // Mock data for demonstration
      setPayments([
        {
          id: 'PAY-001',
          booking_id: 'BK-001',
          user: { name: 'John Doe', email: 'john@example.com' },
          amount: 45.00,
          method: 'credit_card',
          card_last_four: '4242',
          card_brand: 'Visa',
          status: 'completed',
          transaction_id: 'txn_1234567890',
          created_at: '2026-01-05T14:30:00Z',
        },
        {
          id: 'PAY-002',
          booking_id: 'BK-002',
          user: { name: 'Jane Smith', email: 'jane@example.com' },
          amount: 32.50,
          method: 'paypal',
          paypal_email: 'jane@paypal.com',
          status: 'completed',
          transaction_id: 'txn_0987654321',
          created_at: '2026-01-05T12:15:00Z',
        },
        {
          id: 'PAY-003',
          booking_id: 'BK-003',
          user: { name: 'Mike Johnson', email: 'mike@example.com' },
          amount: 67.00,
          method: 'credit_card',
          card_last_four: '1234',
          card_brand: 'Mastercard',
          status: 'pending',
          transaction_id: 'txn_1122334455',
          created_at: '2026-01-04T18:45:00Z',
        },
        {
          id: 'PAY-004',
          booking_id: 'BK-004',
          user: { name: 'Sarah Williams', email: 'sarah@example.com' },
          amount: 28.00,
          method: 'debit_card',
          card_last_four: '5678',
          card_brand: 'Visa',
          status: 'completed',
          transaction_id: 'txn_5566778899',
          created_at: '2026-01-04T10:20:00Z',
        },
        {
          id: 'PAY-005',
          booking_id: 'BK-005',
          user: { name: 'Tom Brown', email: 'tom@example.com' },
          amount: 54.50,
          method: 'credit_card',
          card_last_four: '9999',
          card_brand: 'Amex',
          status: 'failed',
          transaction_id: 'txn_9988776655',
          error_message: 'Insufficient funds',
          created_at: '2026-01-03T16:00:00Z',
        },
        {
          id: 'PAY-006',
          booking_id: 'BK-006',
          user: { name: 'Emily Davis', email: 'emily@example.com' },
          amount: 41.00,
          method: 'mobile_payment',
          mobile_provider: 'Apple Pay',
          status: 'completed',
          transaction_id: 'txn_4433221100',
          created_at: '2026-01-03T09:30:00Z',
        },
        {
          id: 'PAY-007',
          booking_id: 'BK-007',
          user: { name: 'Chris Wilson', email: 'chris@example.com' },
          amount: 72.00,
          method: 'credit_card',
          card_last_four: '3333',
          card_brand: 'Visa',
          status: 'refunded',
          transaction_id: 'txn_1357924680',
          refund_reason: 'Customer requested cancellation',
          created_at: '2026-01-02T14:00:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        label: 'Completed'
      },
      pending: {
        icon: AlertCircle,
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        label: 'Pending'
      },
      failed: {
        icon: XCircle,
        className: 'bg-red-500/10 text-red-400 border-red-500/20',
        label: 'Failed'
      },
      refunded: {
        icon: RefreshCw,
        className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        label: 'Refunded'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'paypal':
        return <Wallet className="w-4 h-4" />;
      case 'mobile_payment':
        return <Receipt className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getMethodLabel = (method, payment) => {
    switch (method) {
      case 'credit_card':
        return `${payment.card_brand} •••• ${payment.card_last_four}`;
      case 'debit_card':
        return `Debit ${payment.card_brand} •••• ${payment.card_last_four}`;
      case 'paypal':
        return 'PayPal';
      case 'mobile_payment':
        return payment.mobile_provider || 'Mobile Payment';
      default:
        return method;
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
    pending: payments.filter(p => p.status === 'pending').length,
    failed: payments.filter(p => p.status === 'failed').length,
    refunded: payments.filter(p => p.status === 'refunded').length,
    totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    totalRefunded: payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0),
  };

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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Payments</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Track and manage all transactions</p>
        </div>
        <motion.button
          className="neu-button-secondary inline-flex items-center gap-2 w-full sm:w-auto justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-5 h-5" />
          Export Report
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
      >
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <Receipt className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.completed}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.failed}</p>
              <p className="text-sm text-gray-400">Failed</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-500/10">
              <TrendingUp className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-sm text-gray-400">Revenue</p>
            </div>
          </div>
        </div>
        <div className="bento-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">${stats.totalRefunded.toFixed(0)}</p>
              <p className="text-sm text-gray-400">Refunded</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
          <input
            type="text"
            placeholder="Search by ID, name, email, or transaction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="neu-search w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="neu-select min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Method Filter */}
        <div className="relative">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="neu-select min-w-[150px]"
          >
            <option value="all">All Methods</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="mobile_payment">Mobile Payment</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </motion.div>

      {/* Payments Table - Desktop */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="hidden md:block"
      >
        <motion.div variants={itemVariants} className="bento-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Payment ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                  <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-center py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center">
                      <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No payments found</h3>
                      <p className="text-gray-400">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-white font-mono text-sm">{payment.id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-medium">{payment.user?.name}</p>
                          <p className="text-gray-500 text-sm">{payment.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-300">
                          {getMethodIcon(payment.method)}
                          <span className="text-sm">{getMethodLabel(payment.method, payment)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-400 font-mono text-xs">{payment.transaction_id}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-white">{formatDate(payment.created_at)}</p>
                          <p className="text-gray-500">{formatTime(payment.created_at)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`font-semibold ${payment.status === 'refunded' ? 'text-blue-400' : 'text-white'}`}>
                          {payment.status === 'refunded' ? '-' : ''}${payment.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Payments Cards - Mobile */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="md:hidden space-y-4"
      >
        {filteredPayments.length === 0 ? (
          <div className="bento-card text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No payments found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <motion.div
              key={payment.id}
              variants={itemVariants}
              className="bento-card p-4"
            >
              {/* Header with ID and Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-mono text-xs">#{payment.id}</span>
                {getStatusBadge(payment.status)}
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-accent-cyan/30 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {payment.user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{payment.user?.name}</p>
                  <p className="text-gray-500 text-sm truncate">{payment.user?.email}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-gray-300">
                  {getMethodIcon(payment.method)}
                  <span className="text-sm">{getMethodLabel(payment.method, payment)}</span>
                </div>
                <span className={`text-lg font-bold ${payment.status === 'refunded' ? 'text-blue-400' : 'text-white'}`}>
                  {payment.status === 'refunded' ? '-' : ''}${payment.amount.toFixed(2)}
                </span>
              </div>

              {/* Transaction ID and Date */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5">
                <span className="font-mono truncate max-w-[150px]">{payment.transaction_id}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(payment.created_at)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedPayment(payment)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                           bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedPayment(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg bg-dark-800 border border-white/10 rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div>
                <h3 className="text-lg font-semibold text-white">Payment Details</h3>
                <p className="text-sm text-gray-400">ID: {selectedPayment.id}</p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Amount & Status */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Amount</p>
                  <p className={`text-3xl font-bold ${selectedPayment.status === 'refunded' ? 'text-blue-400' : 'text-white'}`}>
                    {selectedPayment.status === 'refunded' ? '-' : ''}${selectedPayment.amount.toFixed(2)}
                  </p>
                </div>
                {getStatusBadge(selectedPayment.status)}
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-xl bg-dark-900/50 border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-accent-cyan/30 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {selectedPayment.user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedPayment.user?.name}</p>
                    <p className="text-gray-400 text-sm">{selectedPayment.user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="p-4 rounded-xl bg-dark-900/50 border border-white/5">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Payment Method</p>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white/5">
                    {getMethodIcon(selectedPayment.method)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{getMethodLabel(selectedPayment.method, selectedPayment)}</p>
                    {selectedPayment.paypal_email && (
                      <p className="text-gray-400 text-sm">{selectedPayment.paypal_email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Transaction ID</span>
                  <span className="text-white font-mono text-sm">{selectedPayment.transaction_id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Booking ID</span>
                  <span className="text-white font-mono text-sm">{selectedPayment.booking_id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Date & Time</span>
                  <span className="text-white text-sm">{formatDateTime(selectedPayment.created_at)}</span>
                </div>
                {selectedPayment.error_message && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-sm">
                      <strong>Error:</strong> {selectedPayment.error_message}
                    </p>
                  </div>
                )}
                {selectedPayment.refund_reason && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-blue-400 text-sm">
                      <strong>Refund Reason:</strong> {selectedPayment.refund_reason}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                {selectedPayment.status === 'completed' && (
                  <button className="neu-button-primary flex-1 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Process Refund
                  </button>
                )}
                <button className="neu-button-secondary flex-1 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPayments;
