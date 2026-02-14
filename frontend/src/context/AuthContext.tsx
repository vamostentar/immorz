import { AgentProfile, flattenProfile } from '@/api/agent-queries';
import { api, clearTokens, complete2FA as clientComplete2FA, confirm2FARequest, disable2FARequest, enable2FARequest, getAccessToken, getRefreshToken, loginRequest, registerRequest, setTokens } from '@/api/client';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthUser extends Omit<AgentProfile, 'role'> {
  role?: string | { id: string; name: string; displayName: string };
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  requiresTwoFactor?: boolean;
  tempToken?: string;
  rememberMe?: boolean;
}

// Helper to determine dashboard path
const getDashboardPath = (user: AuthUser) => {
  const roleName = typeof user.role === 'string' ? user.role : user.role?.name;

  switch (roleName) {
    case 'super_admin':
    case 'admin':
      return '/admin/dashboard';
    case 'agent':
      return '/agent/dashboard';
    case 'client':
      return '/client/dashboard';
    default:
      return '/';
  }
};

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  complete2FA: (code: string) => Promise<void>;
  enable2FA: () => Promise<{ secret: string; qrCode: string; backupCodes: string[] }>;
  confirm2FA: (secret: string, token: string) => Promise<void>;
  disable2FA: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  phone: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Initialize authentication state on app load
    async function initializeAuth() {
      console.log('🔐 AuthContext: Initializing authentication...');

      const token = getAccessToken();

      // If no token, set as initialized with no user
      if (!token) {
        console.log('🔐 AuthContext: No token found, user not authenticated');
        setState({
          user: null,
          loading: false,
          initialized: true
        });
        return;
      }

      // If token exists, verify it with the server
      try {
        console.log('🔐 AuthContext: Token found, verifying with server...');
        setState(s => ({ ...s, loading: true }));

        const { data } = await api.get('/api/v1/users/me');
        const userDataRaw = data?.data ?? data ?? null;
        
        const userData = userDataRaw ? flattenProfile(userDataRaw) : null;

        console.log('🔐 AuthContext: User verified successfully:', userData?.email);
        
        setState({
          user: userData as unknown as AuthUser, // Cast seguro após verificação
          loading: false,
          initialized: true
        });

      } catch (error) {
        console.warn('🔐 AuthContext: Failed to verify user:', error);

        // Only clear tokens on 401 (authentication error)
        if ((error as any)?.response?.status === 401) {
          console.log('🔐 AuthContext: Token invalid, clearing and redirecting to login');
          clearTokens();
          setState({
            user: null,
            loading: false,
            initialized: true
          });
        } else {
          // For other errors (network, server), keep tokens but mark as unverified
          console.log('🔐 AuthContext: Network/server error, keeping tokens but setting user as null');
          setState({
            user: null,
            loading: false,
            initialized: true
          });
        }
      }
    }

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    console.log(`🔐 AuthContext: Login requested for ${email}, rememberMe=${rememberMe}`);
    setState(s => ({ ...s, loading: true, requiresTwoFactor: false, tempToken: undefined }));
    try {
      const response = await loginRequest({ email, password, rememberMe });
      console.log('🔐 AuthContext: Login response received:', response);

      // Extract data handling potential nesting
      const responseData: any = response.data || response;

      // Check for 2FA requirement
      if (responseData.requiresTwoFactor && responseData.tempToken) {
        console.log('🔐 AuthContext: 2FA required');
        setState({
          user: null,
          loading: false,
          initialized: true,
          requiresTwoFactor: true,
          tempToken: responseData.tempToken,
          rememberMe
        });
        return;
      }

      // Helper to handle successful login
      const handleSuccess = async (accessToken: string, refreshToken?: string) => {
        setTokens(accessToken, refreshToken || null, rememberMe);
        // Fetch complete user data from API
        const { data: userData } = await api.get('/api/v1/users/me');
        const userRaw = userData?.data ?? userData ?? null;
        const user = userRaw ? flattenProfile(userRaw) : null;
        console.log('🔐 AuthContext: Login successful, user data:', user);

        setState({ user: user as any, loading: false, initialized: true });

        // Redirect based on role
        if (user) {
          const dashboardPath = getDashboardPath(user);
          console.log(`🔀 Redirecting to ${dashboardPath}`);
          navigate(dashboardPath);
        } else {
          navigate('/');
        }
      };

      // Check for tokens in various possible locations
      const tokens = responseData.tokens || (responseData.data && responseData.data.tokens);
      
      if (tokens && tokens.accessToken) {
        await handleSuccess(tokens.accessToken, tokens.refreshToken);
        return;
      }
      
      // Fallback for direct accessToken property
      if (responseData.accessToken) {
        await handleSuccess(responseData.accessToken, responseData.refreshToken);
        return;
      }

      console.error('🔐 AuthContext: Invalid response format:', response);
      throw new Error('Formato de resposta inesperado da API');

    } catch (e: any) {
      console.error('Login error:', e);
      setState(s => ({ ...s, loading: false, initialized: true }));
      throw e.message ? e : new Error('Falha na autenticação. Verifique suas credenciais.');
    }
  }, [navigate]);

  const register = useCallback(async (userData: RegisterData) => {
    setState(s => ({ ...s, loading: true }));
    try {
      await registerRequest(userData);
      setState({ user: null, loading: false, initialized: true });
    } catch (e) {
      setState({ user: null, loading: false, initialized: true });
      throw e;
    }
  }, []);

  const doComplete2FA = useCallback(async (code: string) => {
    console.log(`🔐 AuthContext: Completing 2FA with code, rememberMe=${state.rememberMe}`);
    if (!state.tempToken) throw new Error('Missing temp token');
    setState(s => ({ ...s, loading: true }));
    try {
      const res = await clientComplete2FA({ tempToken: state.tempToken, code });
      const payload = res?.data ?? res;
      const tokens = payload?.tokens ?? payload;
      
      if (tokens?.accessToken) {
        setTokens(tokens.accessToken, tokens.refreshToken ?? null, state.rememberMe);
      }
      
      const user = payload?.user ?? null;
      setState({ user, loading: false, initialized: true });

      if (user) {
        const dashboardPath = getDashboardPath(user);
        navigate(dashboardPath);
      } else {
        navigate('/');
      }
    } catch (e) {
      console.error('2FA verification error:', e);
      setState(s => ({ ...s, loading: false, initialized: true }));
      throw e;
    }
  }, [state.tempToken, state.rememberMe, navigate]);

  const enable2FA = useCallback(async () => {
    setState(s => ({ ...s, loading: true }));
    try {
      const res = await enable2FARequest();
      setState(s => ({ 
        ...s, 
        user: s.user ? { ...s.user, twoFactorEnabled: true } : null,
        loading: false 
      }));
      return res.data;
    } catch (e) {
      setState(s => ({ ...s, loading: false }));
      throw e;
    }
  }, []);

  const confirm2FA = useCallback(async (secret: string, token: string) => {
    setState(s => ({ ...s, loading: true }));
    try {
      await confirm2FARequest({ secret, token });
      setState(s => ({ 
        ...s, 
        user: s.user ? { ...s.user, twoFactorEnabled: true } : null,
        loading: false 
      }));
    } catch (e) {
      setState(s => ({ ...s, loading: false }));
      throw e;
    }
  }, []);

  const disable2FA = useCallback(async (password: string) => {
    setState(s => ({ ...s, loading: true }));
    try {
      await disable2FARequest({ password });
      setState(s => ({ 
        ...s, 
        user: s.user ? { ...s.user, twoFactorEnabled: false } : null,
        loading: false 
      }));
    } catch (e) {
      setState(s => ({ ...s, loading: false }));
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = getRefreshToken();
      await api.post('/api/v1/auth/logout', { refreshToken });
    } catch (err) {
      console.warn('Logout request failed:', err);
    }
    clearTokens();
    queryClient.removeQueries();
    queryClient.clear();
    setState({ user: null, loading: false, initialized: true });
    navigate('/login');
  }, [navigate, queryClient]);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    login,
    register,
    complete2FA: doComplete2FA,
    enable2FA,
    confirm2FA,
    disable2FA,
    logout,
  }), [state, login, register, doComplete2FA, enable2FA, confirm2FA, disable2FA, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
