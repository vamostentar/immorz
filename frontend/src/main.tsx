import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/i18n';
import { lazy, Suspense } from 'react';

// Eager load critical pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';

// Lazy load non-critical pages
const PropertyDetails = lazy(() => import('@/pages/PropertyDetails'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Legal = lazy(() => import('@/pages/Legal'));
const Team = lazy(() => import('@/pages/Team'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));
const About = lazy(() => import('@/pages/About'));
const FAQ = lazy(() => import('@/pages/FAQ'));

// Lazy load all admin pages
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const Approvals = lazy(() => import('@/pages/admin/Approvals'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const PropertiesList = lazy(() => import('@/pages/admin/PropertiesList'));
const PropertiesManagement = lazy(() => import('@/pages/admin/PropertiesManagement'));
const PropertyImages = lazy(() => import('@/pages/admin/PropertyImages'));
const Settings = lazy(() => import('@/pages/admin/Settings'));
const UsersManagement = lazy(() => import('@/pages/admin/users'));
const AgentsManagement = lazy(() => import('@/pages/admin/users/Agents'));
const AgentDashboard = lazy(() => import('@/pages/agent/Dashboard'));
const AgentProperties = lazy(() => import('@/pages/agent/Properties'));
const AgentInbox = lazy(() => import('@/pages/agent/Inbox'));
const AdminInbox = lazy(() => import('@/pages/admin/Inbox'));
const ClientDashboard = lazy(() => import('@/pages/client/Dashboard'));

// Lazy load public agent profile
const AgentProfile = lazy(() => import('@/pages/agent/AgentProfile'));
const EditProfile = lazy(() => import('@/pages/agent/EditProfile'));
const AgentLeadHunter = lazy(() => import('@/pages/agent/LeadHunter'));
const AdminLeadHunter = lazy(() => import('@/pages/admin/LeadHunter'));
const AdminProfile = lazy(() => import('@/pages/admin/UserProfile'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Disable automatic retries and background refetches to avoid flooding the API
      retry: 0,
      refetchOnWindowFocus: false,
      // short retryDelay in case something triggers a retry manually
      retryDelay: 1000,
    },
    mutations: {
      retry: false,
    },
  },
});

// Loading component for Suspense
import Loading from '@/components/Loading';

// Wrapper component to provide Auth and Theme context with Suspense
function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Suspense fallback={<Loading fullScreen />}>
          {children}
        </Suspense>
      </AuthProvider>
    </ThemeProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppWrapper>
        <Home />
      </AppWrapper>
    )
  },
  {
    path: '/login',
    element: (
      <AppWrapper>
        <Login />
      </AppWrapper>
    )
  },
  {
    path: '/forgot-password',
    element: (
      <AppWrapper>
        <ForgotPassword />
      </AppWrapper>
    )
  },
  {
    path: '/reset-password',
    element: (
      <AppWrapper>
        <ResetPassword />
      </AppWrapper>
    )
  },
  {
    path: '/property/:id',
    element: (
      <AppWrapper>
        <PropertyDetails />
      </AppWrapper>
    )
  },
  // Public agent profile route
  {
    path: '/agent/:id',
    element: (
      <AppWrapper>
        <AgentProfile />
      </AppWrapper>
    )
  },
  {
    path: '/equipa',
    element: (
      <AppWrapper>
        <Team />
      </AppWrapper>
    )
  },
  // Agent routes
  {
    path: '/agent',
    element: (
      <AppWrapper>
        <Navigate to="/agent/dashboard" replace />
      </AppWrapper>
    )
  },
  {
    path: '/agent/dashboard',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['agent']}>
          <AgentDashboard />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/agent/properties',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['agent']}>
          <AgentProperties />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/agent/profile',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['agent']}>
          <EditProfile />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/agent/leadhunter',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['agent']}>
          <AgentLeadHunter />
        </ProtectedRoute>
      </AppWrapper>
    )
  },

  // Client routes
  {
    path: '/client',
    element: (
      <AppWrapper>
        <Navigate to="/client/dashboard" replace />
      </AppWrapper>
    )
  },
  {
    path: '/client/dashboard',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['client']}>
          <ClientDashboard />
        </ProtectedRoute>
      </AppWrapper>
    )
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <AppWrapper>
        <Navigate to="/admin/dashboard" replace />
      </AppWrapper>
    )
  },
  {
    path: '/admin/dashboard',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <Dashboard />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/leadhunter',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <AdminLeadHunter />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/properties',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <PropertiesManagement />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/properties/:id/images',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <PropertyImages />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  // Agent Image Management Route
  {
    path: '/agent/properties/:id/images',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['agent']}>
          <PropertyImages />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/users',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <UsersManagement />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/agents',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <AgentsManagement />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/analytics',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <Analytics />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/settings',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <Settings />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/admin/profile',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <AdminProfile />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  // Agent Inbox
  {
    path: '/agent/messages',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['agent']}>
          <AgentInbox />
        </ProtectedRoute>
      </AppWrapper>
    )
  },

  // Admin Inbox
  {
    path: '/admin/messages',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <AdminInbox />
        </ProtectedRoute>
      </AppWrapper>
    )
  },

  {
    path: '/admin/approvals',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <Approvals />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '/privacidade',
    element: (
      <AppWrapper>
        <Privacy />
      </AppWrapper>
    )
  },
  {
    path: '/termos',
    element: (
      <AppWrapper>
        <Terms />
      </AppWrapper>
    )
  },
  {
    path: '/legal',
    element: (
      <AppWrapper>
        <Legal />
      </AppWrapper>
    )
  },
  {
    path: '/sobre',
    element: (
      <AppWrapper>
        <About />
      </AppWrapper>
    )
  },
  {
    path: '/faq',
    element: (
      <AppWrapper>
        <FAQ />
      </AppWrapper>
    )
  },
  // Legacy route for backward compatibility
  {
    path: '/admin/properties-old',
    element: (
      <AppWrapper>
        <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <PropertiesList />
        </ProtectedRoute>
      </AppWrapper>
    )
  },
  {
    path: '*',
    element: (
      <AppWrapper>
        <NotFound />
      </AppWrapper>
    )
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// Preloader: Entrada Triunfal — remoção suave após 2s
const removePreloader = () => {
  const el = document.getElementById('preloader');
  if (el) {
    el.classList.add('preloader-hide');
    el.addEventListener('transitionend', () => el.remove(), { once: true });
  }
};
setTimeout(removePreloader, 2000);