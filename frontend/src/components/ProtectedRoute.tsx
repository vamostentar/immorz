import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) {
  const { user, loading, initialized } = useAuth();

  // Show loading while authentication is being initialized
  if (!initialized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Only redirect to login after initialization is complete and no user
  if (!user) {
    console.log('🔐 ProtectedRoute: No authenticated user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check for role access
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = typeof user.role === 'string' ? user.role : user.role?.name;

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.warn(`⛔ ProtectedRoute: Access denied for role '${userRole}'. Allowed: ${allowedRoles.join(', ')}`);
      // Redirect to appropriate dashboard based on actual role or home
      return <Navigate to="/" replace />;
    }
  }

  console.log('🔐 ProtectedRoute: User authenticated, allowing access');
  return children;
}
