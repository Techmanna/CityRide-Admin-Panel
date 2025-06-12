import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
  redirectTo?: string;
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

function PublicRoute({ children, redirectTo = "/admin" }: PublicRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  console.log('🌐 PublicRoute - Auth State:', { isAuthenticated, loading });

  // Show loading spinner while checking authentication status
  if (loading) {
    console.log('⏳ PublicRoute - Showing loading spinner');
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    console.log('✅ PublicRoute - Already authenticated, redirecting to dashboard');
    return <Navigate to={redirectTo} replace />;
  }

  // Render the public component if not authenticated
  console.log('🔓 PublicRoute - Not authenticated, rendering children');
  return <>{children}</>;
}

export default PublicRoute;