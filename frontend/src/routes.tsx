import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, useRouteError } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/lib/auth';

function RootErrorBoundary() {
  const error = useRouteError() as any;
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl mb-4">
        🏛️
      </div>
      <h1 className="text-xl font-bold text-foreground mb-2">SamadhanSetu Platform Notice</h1>
      <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        The application encountered an unexpected client state. You can reload or navigate back to the portal home.
      </p>
      {error?.message && (
        <pre className="text-xs font-mono bg-secondary/50 text-destructive border border-border p-3 rounded-lg max-w-lg mb-6 overflow-x-auto text-left">
          {error.message}
        </pre>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => { window.location.href = '/'; }}
          className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg shadow-sm hover:opacity-95 cursor-pointer"
        >
          Return to Portal
        </button>
        <button
          type="button"
          onClick={() => { window.location.reload(); }}
          className="px-4 py-2 text-xs font-bold text-foreground bg-secondary border border-border rounded-lg hover:bg-secondary/80 cursor-pointer"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

// Lazy-loaded pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const ReportPage = lazy(() => import('@/pages/ReportPage'));
const ComplaintTrackerPage = lazy(() => import('@/pages/ComplaintTrackerPage'));
const ProblemFeed = lazy(() => import('@/pages/ProblemFeed'));
const ProblemDetail = lazy(() => import('@/pages/ProblemDetail'));
const SubmitProblem = lazy(() => import('@/pages/SubmitProblem'));
const MySubmissions = lazy(() => import('@/pages/MySubmissions'));
const MyInterests = lazy(() => import('@/pages/MyInterests'));
const MyTeams = lazy(() => import('@/pages/MyTeams'));
const TeamWorkspacePage = lazy(() => import('@/pages/TeamWorkspacePage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const ImpactDashboard = lazy(() => import('@/pages/ImpactDashboard'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const PendingApproval = lazy(() => import('@/pages/admin/PendingApproval'));
const AllMatches = lazy(() => import('@/pages/admin/AllMatches'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const FaqPage = lazy(() => import('@/pages/FaqPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

function SuspenseFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground font-mono">Loading module...</span>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>;
}

function RequireAuth({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <SuspenseFallback />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function RoleAwareDashboard() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') {
    return <PendingApproval />;
  }
  return <MySubmissions />;
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RootErrorBoundary />,
    children: [
      { index: true, element: <SuspenseWrapper><Landing /></SuspenseWrapper> },
      { path: 'login', element: <SuspenseWrapper><Login /></SuspenseWrapper> },
      { path: 'signup', element: <SuspenseWrapper><Signup /></SuspenseWrapper> },
      { path: 'report', element: <SuspenseWrapper><ReportPage /></SuspenseWrapper> },
      { path: 'track', element: <SuspenseWrapper><ComplaintTrackerPage /></SuspenseWrapper> },
      { path: 'track/:complaintId', element: <SuspenseWrapper><ComplaintTrackerPage /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: 'faq', element: <SuspenseWrapper><FaqPage /></SuspenseWrapper> },
      { path: 'contact', element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },

      // Problem directory
      { path: 'problems', element: <SuspenseWrapper><ProblemFeed /></SuspenseWrapper> },
      { path: 'problems/:id', element: <SuspenseWrapper><ProblemDetail /></SuspenseWrapper> },
      { path: 'problems/submit', element: <SuspenseWrapper><ReportPage /></SuspenseWrapper> },

      // Dashboard (Role-aware)
      { path: 'dashboard', element: <SuspenseWrapper><RoleAwareDashboard /></SuspenseWrapper> },
      { path: 'dashboard/analytics', element: <SuspenseWrapper><ImpactDashboard /></SuspenseWrapper> },

      // Citizen workspaces
      {
        path: 'my/submissions',
        element: (
          <RequireAuth roles={['CITIZEN', 'ADMIN']}>
            <SuspenseWrapper><MySubmissions /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'my/interests',
        element: (
          <RequireAuth roles={['UNIVERSITY', 'INDUSTRY', 'ADMIN']}>
            <SuspenseWrapper><MyInterests /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'my/teams',
        element: (
          <RequireAuth>
            <SuspenseWrapper><MyTeams /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'teams/:teamId',
        element: (
          <RequireAuth>
            <SuspenseWrapper><TeamWorkspacePage /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'notifications',
        element: (
          <RequireAuth>
            <SuspenseWrapper><NotificationsPage /></SuspenseWrapper>
          </RequireAuth>
        ),
      },

      // Nodal Officer & Admin consoles
      {
        path: 'admin',
        element: (
          <RequireAuth roles={['ADMIN']}>
            <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'admin/pending',
        element: (
          <RequireAuth roles={['ADMIN']}>
            <SuspenseWrapper><PendingApproval /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'admin/matches',
        element: (
          <RequireAuth roles={['ADMIN']}>
            <SuspenseWrapper><AllMatches /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
