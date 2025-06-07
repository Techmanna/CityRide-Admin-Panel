import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, 
  Clock, 
  CheckCircle, 
  Calendar,
  User,
  CreditCard,
  Phone,
  Building,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Car,
  X
} from 'lucide-react';

import { supabase } from '../../lib/supabase';

const PayoutManagement = () => {
  // State management
  const [activeTimeTab, setActiveTimeTab] = useState('daily');
  const [activeStatusTab, setActiveStatusTab] = useState('unpaid');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states
  const [overallStats, setOverallStats] = useState({
    totalAmount: 0,
    pendingAmount: 0,
    paidAmount: 0
  });
  const [periodStats, setPeriodStats] = useState({
    daily: { unpaid: 0, paid: 0 },
    weekly: { unpaid: 0, paid: 0 },
    monthly: { unpaid: 0, paid: 0 }
  });
  const [drivers, setDrivers] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [processingPayouts, setProcessingPayouts] = useState(new Set());

  // Time period helpers
  const getDateRange = (period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'daily':
        return {
          start: today,
          end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
        };
      case 'weekly':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return { start: weekStart, end: weekEnd };
      case 'monthly':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        monthEnd.setHours(23, 59, 59, 999);
        return { start: monthStart, end: monthEnd };
      default:
        return { start: today, end: today };
    }
  };

  // Get payout frequency filter based on active time tab
  const getPayoutFrequencyFilter = (timeTab) => {
    switch (timeTab) {
      case 'daily':
        return 'daily';
      case 'weekly':
        return 'weekly';
      case 'monthly':
        return 'monthly';
      default:
        return 'weekly'; // default fallback
    }
  };

  // Fetch overall statistics
  const fetchOverallStats = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_earnings')
        .select('amount, status');

      if (error) throw error;

      const stats = data.reduce((acc, earning) => {
        const amount = parseFloat(earning.amount);
        acc.totalAmount += amount;
        if (earning.status === 'pending') {
          acc.pendingAmount += amount;
        } else {
          acc.paidAmount += amount;
        }
        return acc;
      }, { totalAmount: 0, pendingAmount: 0, paidAmount: 0 });

      setOverallStats(stats);
    } catch (err) {
      console.error('Error fetching overall stats:', err);
      setError('Failed to fetch overall statistics');
    }
  };

  // Fetch period statistics with payout frequency filter
  const fetchPeriodStats = async () => {
    try {
      const periods = ['daily', 'weekly', 'monthly'];
      const stats = {};

      for (const period of periods) {
        const { start, end } = getDateRange(period);
        const payoutFrequency = getPayoutFrequencyFilter(period);
        
        const { data, error } = await supabase
          .from('driver_earnings')
          .select(`
            amount, 
            status,
            drivers!fk_driver (
              payout_frequency
            )
          `)
          .gte('created_at', start.toISOString())
          .lte('created_at', end.toISOString());

        if (error) throw error;

        // Filter by payout frequency and calculate stats
        const filteredData = data.filter(earning => 
          earning.drivers?.payout_frequency === payoutFrequency
        );

        stats[period] = filteredData.reduce((acc, earning) => {
          const amount = parseFloat(earning.amount);
          if (earning.status === 'pending') {
            acc.unpaid += amount;
          } else {
            acc.paid += amount;
          }
          return acc;
        }, { unpaid: 0, paid: 0 });
      }

      setPeriodStats(stats);
    } catch (err) {
      console.error('Error fetching period stats:', err);
      setError('Failed to fetch period statistics');
    }
  };

  // Fetch drivers with earnings - Updated to include payout frequency filter
  const fetchDriversAlternative = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = getDateRange(activeTimeTab);
      const payoutFrequency = getPayoutFrequencyFilter(activeTimeTab);
      const offset = (page - 1) * itemsPerPage;

      // First get the earnings with driver payout frequency filter
      const { data: earnings, error: earningsError, count } = await supabase
        .from('driver_earnings')
        .select(`
          *,
          drivers!fk_driver (
            payout_frequency
          )
        `, { count: 'exact' })
        .eq('status', activeStatusTab === 'unpaid' ? 'pending' : 'paid')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: false });

      if (earningsError) throw earningsError;

      // Filter by payout frequency on the client side
      // (We could move this to the server side with a more complex query)
      const filteredEarnings = (earnings || []).filter(earning => 
        earning.drivers?.payout_frequency === payoutFrequency
      );

      // Apply pagination to filtered results
      const paginatedEarnings = filteredEarnings.slice(offset, offset + itemsPerPage);

      if (!paginatedEarnings || paginatedEarnings.length === 0) {
        setDrivers([]);
        setTotalPages(0);
        return;
      }

      // Get unique driver IDs from paginated results
      const driverIds = [...new Set(paginatedEarnings.map(e => e.driver_id))];

      // Fetch driver details
      const { data: driversData, error: driversError } = await supabase
        .from('drivers')
        .select(`
          id,
          plate_number,
          model,
          rating,
          user_id,
          payout_frequency,
          user_profiles!drivers_user_id_fkey (
            full_name,
            phone,
            email,
            bank_name,
            account_number,
            account_name
          )
        `)
        .in('id', driverIds);

      if (driversError) throw driversError;

      // Combine the data
      const driversMap = new Map(driversData.map(driver => [driver.id, driver]));
      
      const combinedData = paginatedEarnings.map(earning => ({
        ...earning,
        drivers: driversMap.get(earning.driver_id) || null
      }));

      // Apply search filter if provided
      let filteredData = combinedData;
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(earning => {
          const driverName = earning.drivers?.user_profiles?.full_name?.toLowerCase() || '';
          const plateNumber = earning.drivers?.plate_number?.toLowerCase() || '';
          return driverName.includes(searchLower) || plateNumber.includes(searchLower);
        });
      }

      setDrivers(filteredData);
      setTotalPages(Math.ceil(filteredEarnings.length / itemsPerPage));
      
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError('Failed to fetch driver data');
    } finally {
      setLoading(false);
    }
  };

  // Handle payout
  const handlePayout = async (earningId, driverId) => {
    try {
      setProcessingPayouts(prev => new Set([...prev, earningId]));

      const { error: updateError } = await supabase
        .from('driver_earnings')
        .update({
          status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', earningId);

      if (updateError) throw updateError;

      // Refresh data
      await Promise.all([
        fetchOverallStats(),
        fetchPeriodStats(),
        fetchDriversAlternative(currentPage)
      ]);

    } catch (err) {
      console.error('Error processing payout:', err);
      setError('Failed to process payout');
    } finally {
      setProcessingPayouts(prev => {
        const newSet = new Set(prev);
        newSet.delete(earningId);
        return newSet;
      });
    }
  };

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      await Promise.all([
        fetchOverallStats(),
        fetchPeriodStats()
      ]);
      setInitialLoading(false);
    };
    loadInitialData();
  }, []);

  // Fetch drivers when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchDriversAlternative(1);
  }, [activeTimeTab, activeStatusTab, searchTerm]);

  // Fetch drivers when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchDriversAlternative(currentPage);
    }
  }, [currentPage]);

  const refreshData = async () => {
    setInitialLoading(true);
    await Promise.all([
      fetchOverallStats(),
      fetchPeriodStats(),
      fetchDriversAlternative(currentPage)
    ]);
    setInitialLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600">Loading payout data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Driver Payouts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage driver earnings and payments • Showing drivers with {getPayoutFrequencyFilter(activeTimeTab)} payout frequency
            </p>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            disabled={initialLoading}
          >
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2"
        >
          <AlertCircle size={20} className="text-red-500" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Payments</p>
              <p className="text-3xl font-bold">#{overallStats.totalAmount.toFixed(2)}</p>
            </div>
            <TrendingUp size={32} className="text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Payments</p>
              <p className="text-3xl font-bold">#{overallStats.pendingAmount.toFixed(2)}</p>
            </div>
            <Clock size={32} className="text-yellow-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Paid Out</p>
              <p className="text-3xl font-bold">#{overallStats.paidAmount.toFixed(2)}</p>
            </div>
            <CheckCircle size={32} className="text-green-200" />
          </div>
        </motion.div>
      </div>

      {/* Time Period Tabs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setActiveTimeTab(period)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTimeTab === period
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {period}
                <span className="ml-1 text-xs text-gray-400">
                  ({getPayoutFrequencyFilter(period)})
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Period Statistics */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-800 text-sm font-medium">
                    Unpaid ({activeTimeTab} • {getPayoutFrequencyFilter(activeTimeTab)} frequency)
                  </p>
                  <p className="text-2xl font-bold text-red-900">
                    #{periodStats[activeTimeTab]?.unpaid.toFixed(2) || '0.00'}
                  </p>
                </div>
                <Hash size={24} className="text-red-600" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-800 text-sm font-medium">
                    Paid ({activeTimeTab} • {getPayoutFrequencyFilter(activeTimeTab)} frequency)
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    #{periodStats[activeTimeTab]?.paid.toFixed(2) || '0.00'}
                  </p>
                </div>
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            {['unpaid', 'paid'].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatusTab(status)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize ${
                  activeStatusTab === status
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by driver name or plate number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Drivers Table */}
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle & Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bank Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                        <span className="ml-3 text-gray-600">Loading drivers...</span>
                      </div>
                    </td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      <Car size={48} className="mx-auto mb-4 text-gray-400" />
                      <p>No {activeStatusTab} earnings found for {activeTimeTab} period</p>
                      <p className="text-sm mt-1">
                        (Showing only drivers with {getPayoutFrequencyFilter(activeTimeTab)} payout frequency)
                      </p>
                    </td>
                  </tr>
                ) : (
                  drivers.map((earning) => (
                    <motion.tr
                      key={earning.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                              <User size={20} className="text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {earning.drivers?.user_profiles?.full_name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {earning.drivers?.user_profiles?.phone || 'No phone'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {earning.drivers?.plate_number || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {earning.drivers?.model || 'N/A'}
                        </div>
                        <div className="text-xs text-blue-600 font-medium mt-1">
                          {earning.drivers?.payout_frequency || 'weekly'} payouts
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{parseFloat(earning.amount).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {earning.drivers?.user_profiles?.bank_name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {earning.drivers?.user_profiles?.account_number || 'No account'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          {new Date(earning.created_at).toLocaleDateString()}
                        </div>
                        {earning.paid_at && (
                          <div className="text-xs text-green-600">
                            Paid: {new Date(earning.paid_at).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {activeStatusTab === 'unpaid' ? (
                          <button
                            onClick={() => handlePayout(earning.id, earning.driver_id)}
                            disabled={processingPayouts.has(earning.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                          >
                            {processingPayouts.has(earning.id) ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard size={16} />
                                PAY
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Paid
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === page
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayoutManagement;