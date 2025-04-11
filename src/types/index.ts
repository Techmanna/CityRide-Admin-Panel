export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer' | 'rider';
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Ride {
  id: string;
  customerId: string;
  riderId: string;
  pickup: string;
  destination: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  createdAt: string;
  completedAt?: string;
}

export interface Transaction {
  id: string;
  rideId: string;
  amount: number;
  status: 'pending' | 'completed' | 'refunded';
  type: 'payment' | 'refund';
  createdAt: string;
}