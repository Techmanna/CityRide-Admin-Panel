import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Function to fetch payments directly from Supabase
const fetchPayments = async () => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw new Error('Failed to fetch payments data from Supabase');
  }
};

// Function to fetch payment statistics from Supabase
const fetchPaymentStats = async () => {
  try {
    // Get total revenue
    const { data: totalRevenueData, error: totalRevenueError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');
    
    if (totalRevenueError) throw totalRevenueError;
    
    // Get pending payments count
    const { count: pendingCount, error: pendingError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    
    if (pendingError) throw pendingError;
    
    // Get refund amount
    const { data: refundsData, error: refundsError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'refunded');
    
    if (refundsError) throw refundsError;
    
    // Calculate total revenue
    const totalRevenue = totalRevenueData.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate refunds amount
    const refundsAmount = refundsData.reduce((sum, refund) => sum + refund.amount, 0);
    
    // Get monthly growth (current month vs previous month)
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString();
    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0).toISOString();
    
    const { data: currentMonthData, error: currentMonthError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', currentMonthStart);
    
    if (currentMonthError) throw currentMonthError;
    
    const { data: previousMonthData, error: previousMonthError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', previousMonthStart)
      .lte('created_at', previousMonthEnd);
    
    if (previousMonthError) throw previousMonthError;
    
    const currentMonthRevenue = currentMonthData.reduce((sum, payment) => sum + payment.amount, 0);
    const previousMonthRevenue = previousMonthData.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calculate growth percentage
    let monthlyGrowth = 0;
    if (previousMonthRevenue > 0) {
      monthlyGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    }
    
    return {
      totalRevenue,
      pendingCount,
      refundsAmount,
      monthlyGrowth: parseFloat(monthlyGrowth.toFixed(2))
    };
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    throw new Error('Failed to fetch payment statistics from Supabase');
  }
};

function PaymentManagement() {
  // Fetch payment transactions with React Query
  const { 
    data: payments, 
    isLoading: isLoadingPayments, 
    error: paymentsError,
    refetch: refetchPayments
  } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
    refetchInterval: 30000, // Refresh data every 30 seconds
  });

  // Fetch payment statistics with React Query
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    error: statsError,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['paymentStats'],
    queryFn: fetchPaymentStats,
    refetchInterval: 60000, // Refresh stats every minute
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Handle retrying all data fetches
  const handleRetryFetch = () => {
    refetchPayments();
    refetchStats();
  };

  // Handle different UI states
  if (isLoadingPayments && isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading payment data</p>
        </div>
      </div>
    );
  }

  const hasError = paymentsError || statsError;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Management</h2>
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
              {paymentsError ? paymentsError.message : statsError.message}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : stats ? (
                  `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  '$0.00'
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
              <p className="text-gray-500">Pending Payments</p>
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
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Refunds</p>
              <h3 className="text-2xl font-bold">
                {isLoadingStats ? (
                  <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
                ) : stats ? (
                  `$${stats.refundsAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                ) : (
                  '$0.00'
                )}
              </h3>
            </div>
            <RefreshCw className="text-red-500 h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Payment Transactions</h3>
          <div className="text-sm text-gray-500">
            {!isLoadingPayments && payments && `${payments.length} transactions`}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {isLoadingPayments ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : paymentsError ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-gray-500">Failed to load payment data</p>
              </div>
            </div>
          ) : payments && payments.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ride ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {payment.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.ride_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.user_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${payment.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : payment.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : payment.status === 'refunded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm truncate max-w-xs">
                      {payment.transaction_reference || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(payment.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">No payment transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentManagement;