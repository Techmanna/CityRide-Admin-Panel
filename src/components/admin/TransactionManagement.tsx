import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Function to fetch transactions from Supabase - limit to only needed fields
const fetchTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, user_id, amount, currency, type, payment_purpose, status, description, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw new Error('Failed to fetch transaction data from Supabase');
  }
};

// Optimized function to fetch transaction statistics using PostgreSQL functions when possible
const fetchTransactionStats = async () => {
  try {
    // Create a single query to get all statistics at once
    const { data: statsData, error: statsError } = await supabase.rpc('get_transaction_stats');
    
    // If the RPC function exists, use its data
    if (!statsError && statsData) {
      return statsData;
    }
    
    // Fallback method if RPC function doesn't exist
    console.warn('RPC function unavailable, using fallback method');
    
    // Get total revenue (completed credits)
    const { data: revenueData, error: revenueError } = await supabase
  .from('transactions')
  .select('sum(amount)', { head: false })
  .eq('status', 'completed')
  .eq('type', 'credit')
  .single();

if (revenueError) throw revenueError;
const totalRevenue = revenueData?.sum || 0;

    
    // Get pending transactions count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    if (pendingError) throw pendingError;
    
    // Calculate monthly growth
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthStart = new Date(currentYear, currentMonth, 1).toISOString();
    const previousMonthStart = new Date(previousYear, previousMonth, 1).toISOString();
    const previousMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999).toISOString();
    
    // Get current month revenue
    const { data: currentMonthData, error: currentMonthError } = await supabase
      .from('transactions')
      .select('sum(amount)')
      .eq('status', 'completed')
      .eq('type', 'credit')
      .gte('created_at', currentMonthStart)
      .single();
    
    if (currentMonthError) throw currentMonthError;
    const currentMonthRevenue = currentMonthData?.sum || 0;
    
    // Get previous month revenue
    const { data: previousMonthData, error: previousMonthError } = await supabase
      .from('transactions')
      .select('sum(amount)')
      .eq('status', 'completed')
      .eq('type', 'credit')
      .gte('created_at', previousMonthStart)
      .lt('created_at', currentMonthStart)
      .single();
    
    if (previousMonthError) throw previousMonthError;
    const previousMonthRevenue = previousMonthData?.sum || 0;
    
    // Calculate growth percentage
    let monthlyGrowth = 0;
    if (previousMonthRevenue > 0) {
      monthlyGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    } else if (currentMonthRevenue > 0) {
      monthlyGrowth = 100; // If previous month was 0 and current month has revenue, that's 100% growth
    }
    
    return {
      totalRevenue,
      pendingCount,
      monthlyGrowth: parseFloat(monthlyGrowth.toFixed(2))
    };
  } catch (error) {
    console.error('Error fetching transaction statistics:', error);
    throw new Error('Failed to fetch transaction statistics from Supabase');
  }
};

function TransactionManagement() {
  // Fetch transactions with React Query
  const { 
    data: transactions, 
    isLoading: isLoadingTransactions, 
    error: transactionsError,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: 30000, // Data considered fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch when window gets focus
  });

  // Fetch transaction statistics with React Query
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['transactionStats'],
    queryFn: fetchTransactionStats,
    staleTime: 60000, // Stats considered fresh for 60 seconds
    refetchOnWindowFocus: true,
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(amount);
  };

  // Handle retrying all data fetches
  const handleRetryFetch = () => {
    refetchTransactions();
    refetchStats();
  };

  // Truncate UUID for display
  const truncateId = (id) => {
    if (!id) return "N/A";
    return `${id.substring(0, 8)}...`;
  };

  // Handle different UI states
  if (isLoadingTransactions && isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-500">Loading transaction data</p>
        </div>
      </div>
    );
  }

  const hasError = transactionsError || statsError;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Transaction Management</h2>
        {hasError && (
          <button 
            onClick={handleRetryFetch} 
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </button>
        )}
      </div>

      {hasError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">
              {transactionsError ? transactionsError.message : statsError.message}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : stats ? (
                  formatCurrency(stats.totalRevenue)
                ) : (
                  formatCurrency(0)
                )}
              </h3>
            </div>
            <DollarSign className="text-blue-500 h-8 w-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Monthly Growth</p>
              <h3 className="text-2xl font-bold">
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : stats ? (
                  `${stats.monthlyGrowth}%`
                ) : (
                  '0%'
                )}
              </h3>
            </div>
            <TrendingUp className={`h-8 w-8 ${stats && stats.monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Transactions</p>
              <h3 className="text-2xl font-bold">
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : stats ? (
                  stats.pendingCount
                ) : (
                  '0'
                )}
              </h3>
            </div>
            <CreditCard className="text-yellow-500 h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="text-sm text-gray-500">
            {!isLoadingTransactions && transactions && `${transactions.length} transactions`}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoadingTransactions ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : transactionsError ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-gray-500">Failed to load transaction data</p>
              </div>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {truncateId(transaction.id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {truncateId(transaction.user_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'credit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.payment_purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm truncate max-w-xs">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(transaction.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionManagement;