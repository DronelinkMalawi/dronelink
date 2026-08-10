import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Get initial session with a timeout to prevent hanging
    const initializeAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Auth initialization timeout')), 5000);
        });

        // Race between the actual auth check and the timeout
        const result = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]) as { data: { session: Session | null } };

        if (!isMounted) return;

        const currentSession = result.data?.session;

        if (currentSession) {
          // Try to validate with server, but don't block on it
          try {
            const { data: { user: currentUser }, error } = await supabase.auth.getUser();
            if (!error && currentUser && isMounted) {
              setSession(currentSession);
              setUser(currentUser);
            } else if (isMounted) {
              // Session exists but user validation failed - still allow access
              // This prevents the "Checking authentication..." hang
              setSession(currentSession);
              setUser(currentSession.user ?? null);
            }
          } catch (error) {
            // If server validation fails, still use the session from localStorage
            if (isMounted) {
              setSession(currentSession);
              setUser(currentSession.user ?? null);
            }
          }
        } else {
          if (isMounted) {
            setSession(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    // Clear any cached session data
    setSession(null);
    setUser(null);
    if (error) throw error;
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};