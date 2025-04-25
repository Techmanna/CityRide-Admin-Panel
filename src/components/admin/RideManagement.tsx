import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

function RideManagement() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch rides from Supabase with correct schema
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['rides', page, pageSize, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('rides')
        .select(`
          *,
          driver:driver_id(id, user_id(id, full_name), plate_number, model, rating),
          passenger:passenger_id(id, full_name, phone, photo_url)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    retry: 1
  });

  // Fetch ride statistics
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['ride-stats'],
    queryFn: async () => {
      // Total rides
      const { count: totalRides, error: totalError } = await supabase
        .from('rides')
        .select('*', { count: 'exact', head: true });
      
      // Active rides (in_progress)
      const { count: activeRides, error: activeError } = await supabase
        .from('rides')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress');
      
      // Today's revenue
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayRides, error: revenueError } = await supabase
        .from('rides')
        .select('total')
        .gte('created_at', today.toISOString())
        .eq('status', 'completed');
      
      const todayRevenue = todayRides?.reduce((sum, ride) => sum + (Number(ride.total) || 0), 0) || 0;
      
      if (totalError || activeError || revenueError) throw totalError || activeError || revenueError;
      
      return {
        totalRides: totalRides || 0,
        activeRides: activeRides || 0,
        todayRevenue
      };
    }
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading ride data...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium text-lg mb-2">Error loading ride data</p>
        <p className="text-red-500">{error?.message || "An unknown error occurred"}</p>
        <div className="mt-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Ride Management</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Rides</p>
              {statsLoading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-bold">{statsData?.totalRides.toLocaleString()}</h3>
              )}
            </div>
            <Clock className="text-primary h-8 w-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Rides</p>
              {statsLoading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-bold">{statsData?.activeRides.toLocaleString()}</h3>
              )}
            </div>
            <MapPin className="text-green-500 h-8 w-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Revenue</p>
              {statsLoading ? (
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-bold">${statsData?.todayRevenue.toFixed(2)}</h3>
              )}
            </div>
            <DollarSign className="text-yellow-500 h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center">
          <Filter className="mr-2 text-gray-500 h-5 w-5" />
          <span className="text-gray-700 mr-2">Status:</span>
          <select 
            className="border rounded-md py-1 px-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          <select 
            className="border rounded-md py-1 px-2"
            value={pageSize} 
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Rides Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Ride Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dropoff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Scheduled</th>
              </tr>
            </thead>
            <tbody>
              {data?.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    No rides found matching your criteria
                  </td>
                </tr>
              ) : (
                data?.map((ride) => (
                  <tr key={ride.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {ride.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ride.passenger?.full_name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ride.driver_id ? (
                        <>
                          {ride.driver?.user_id?.full_name || 'Unknown'}
                          <div className="text-xs text-gray-500">
                            {ride.driver?.plate_number} ({ride.driver?.model})
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {ride.pickup_address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate">
                      {ride.dropoff_address || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="capitalize">{ride.ride_type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ride.status)}`}>
                        {ride.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ride.distance_km ? `${Number(ride.distance_km).toFixed(1)} km` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${ride.total ? Number(ride.total).toFixed(2) : ride.fare ? Number(ride.fare).toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(ride.scheduled_time)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="px-6 py-4 flex items-center justify-between border-t">
          <div className="text-sm text-gray-700">
            Showing page {page}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-3 py-1 rounded border ${
                page === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={data?.length < pageSize}
              className={`px-3 py-1 rounded border ${
                data?.length < pageSize 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RideManagement;