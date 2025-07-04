import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - Auth State:', { isAuthenticated, loading });

  // Show loading spinner while checking authentication status
  if (loading) {
    console.log('⏳ ProtectedRoute - Showing loading spinner');
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute - Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  console.log('✅ ProtectedRoute - Authenticated, rendering children');
  return <>{children}</>;
}

export default ProtectedRoute;