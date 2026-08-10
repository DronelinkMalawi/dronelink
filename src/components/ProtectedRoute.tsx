import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Force re-validate the session on every protected route access
    // Use getSession() with a timeout to prevent hanging
    const validateSession = async () => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Session validation timeout')), 3000);
        });

        const result = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]) as { data: { session: { user: { id: string } } | null } };

        setSessionValid(!!result.data?.session);
      } catch (error) {
        // If session validation fails or times out, treat as not authenticated
        console.error('Session validation error:', error);
        setSessionValid(false);
      }
    };
    validateSession();
  }, [location.pathname]);

  if (loading || sessionValid === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <div className="text-white">Checking authentication...</div>
        </div>
      </div>
    );
  }

  // Check both the context state and the validated session
  if (!isAuthenticated || !sessionValid) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;