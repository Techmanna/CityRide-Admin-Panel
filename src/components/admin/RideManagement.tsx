import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign } from 'lucide-react';

// Mock data
const mockRides = [
  {
    id: '1',
    customerId: 'C1',
    riderId: 'R1',
    pickup: '123 Main St',
    destination: '456 Oak Ave',
    status: 'completed',
    fare: 25.00,
    distance: 5.2,
    createdAt: '2024-03-01T10:00:00Z',
    completedAt: '2024-03-01T10:30:00Z',
  },
  // Add more mock rides...
];

function RideManagement() {
  const { data: rides, isLoading } = useQuery({
    queryKey: ['rides'],
    queryFn: () => Promise.resolve(mockRides),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ride Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Rides</p>
              <h3 className="text-2xl font-bold">1,234</h3>
            </div>
            <Clock className="text-primary h-8 w-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Rides</p>
              <h3 className="text-2xl font-bold">42</h3>
            </div>
            <MapPin className="text-green-500 h-8 w-8" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Today's Revenue</p>
              <h3 className="text-2xl font-bold">$2,845</h3>
            </div>
            <DollarSign className="text-yellow-500 h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Rides</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pickup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => (
                <motion.tr
                  key={ride.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{ride.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{ride.pickup}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{ride.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        ride.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">${ride.fare.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{ride.distance} km</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RideManagement;