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
const TemplatesPage = lazy(() => import('@/pages/TemplatesPage'));
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
const PrototypePage = lazy(() => import('@/pages/PrototypePage'));
const MfaEnrollment = lazy(() => import('@/pages/MfaEnrollment'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function SuspenseFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
        <span className="text-xs text-muted-foreground font-mono">Verifying authorization...</span>
      </div>
    </div>
  );
}

function SuspenseWrapper({ children }: { children: ReactNode }) {
  return <Suspense fallback={<SuspenseFallback />}>{children}</Suspense>;
}

function RequireAuth({ children, roles }: { children: ReactNode; roles?: string[] }) {
  const { user, isLoading, isMfaRequired } = useAuth();
  if (isLoading) {
    return <SuspenseFallback />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Enforce MFA enrollment for Administrator accounts before granting access to admin consoles
  if (isMfaRequired && window.location.pathname !== '/mfa/enroll') {
    return <Navigate to="/mfa/enroll" replace />;
  }

  if (roles && roles.length > 0) {
    const adminRoles = ['ADMIN', 'INNOVATION_SOCIETY_ADMIN'];
    const evalRoles = ['ADMIN', 'INNOVATION_SOCIETY_ADMIN', 'EVALUATOR', 'VALIDATOR'];
    const deptRoles = ['DEPARTMENT_USER', 'CITIZEN', 'ADMIN', 'INNOVATION_SOCIETY_ADMIN'];
    const startupRoles = ['STARTUP', 'UNIVERSITY', 'INDUSTRY', 'CITIZEN', 'ADMIN', 'INNOVATION_SOCIETY_ADMIN'];

    const userRole = user.role;
    const hasAccess = roles.some((r) => {
      if (r === userRole) return true;
      if (adminRoles.includes(userRole) && adminRoles.includes(r)) return true;
      if (evalRoles.includes(userRole) && evalRoles.includes(r)) return true;
      if (roles.includes('ADMIN') && adminRoles.includes(userRole)) return true;
      if (roles.includes('CITIZEN') && deptRoles.includes(userRole)) return true;
      if ((roles.includes('UNIVERSITY') || roles.includes('INDUSTRY')) && startupRoles.includes(userRole)) return true;
      return false;
    });

    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }
  return <>{children}</>;
}

function RoleAwareDashboard() {
  const { user } = useAuth();
  if (user?.role === 'ADMIN' || user?.role === 'INNOVATION_SOCIETY_ADMIN' || user?.role === 'EVALUATOR' || user?.role === 'VALIDATOR') {
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
      { path: 'templates', element: <SuspenseWrapper><TemplatesPage /></SuspenseWrapper> },
      { path: 'track', element: <SuspenseWrapper><ComplaintTrackerPage /></SuspenseWrapper> },
      { path: 'track/:complaintId', element: <SuspenseWrapper><ComplaintTrackerPage /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
      { path: 'faq', element: <SuspenseWrapper><FaqPage /></SuspenseWrapper> },
      { path: 'contact', element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },
      { path: 'prototype', element: <SuspenseWrapper><PrototypePage /></SuspenseWrapper> },

      // MFA Enrollment
      {
        path: 'mfa/enroll',
        element: (
          <RequireAuth>
            <SuspenseWrapper><MfaEnrollment /></SuspenseWrapper>
          </RequireAuth>
        ),
      },

      // Challenge & Discovery directory
      { path: 'problems', element: <SuspenseWrapper><ProblemFeed /></SuspenseWrapper> },
      { path: 'problems/:id', element: <SuspenseWrapper><ProblemDetail /></SuspenseWrapper> },
      { path: 'problems/submit', element: <SuspenseWrapper><ReportPage /></SuspenseWrapper> },
      { path: 'challenges', element: <SuspenseWrapper><ProblemFeed /></SuspenseWrapper> },
      { path: 'challenges/:id', element: <SuspenseWrapper><ProblemDetail /></SuspenseWrapper> },
      { path: 'marketplace', element: <SuspenseWrapper><ProblemFeed /></SuspenseWrapper> },

      // Dashboard (Role-aware)
      { path: 'dashboard', element: <SuspenseWrapper><RoleAwareDashboard /></SuspenseWrapper> },
      { path: 'dashboard/analytics', element: <SuspenseWrapper><ImpactDashboard /></SuspenseWrapper> },

      // User workspaces
      {
        path: 'my/submissions',
        element: (
          <RequireAuth roles={['CITIZEN', 'DEPARTMENT_USER', 'STARTUP', 'ADMIN', 'INNOVATION_SOCIETY_ADMIN']}>
            <SuspenseWrapper><MySubmissions /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'my/interests',
        element: (
          <RequireAuth roles={['UNIVERSITY', 'INDUSTRY', 'STARTUP', 'ADMIN', 'INNOVATION_SOCIETY_ADMIN']}>
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
          <RequireAuth roles={['ADMIN', 'INNOVATION_SOCIETY_ADMIN', 'EVALUATOR', 'VALIDATOR']}>
            <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'admin/pending',
        element: (
          <RequireAuth roles={['ADMIN', 'INNOVATION_SOCIETY_ADMIN', 'EVALUATOR', 'VALIDATOR']}>
            <SuspenseWrapper><PendingApproval /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'admin/approvals',
        element: (
          <RequireAuth roles={['ADMIN', 'INNOVATION_SOCIETY_ADMIN', 'EVALUATOR', 'VALIDATOR']}>
            <SuspenseWrapper><PendingApproval /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'admin/matches',
        element: (
          <RequireAuth roles={['ADMIN', 'INNOVATION_SOCIETY_ADMIN', 'EVALUATOR', 'VALIDATOR']}>
            <SuspenseWrapper><AllMatches /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      { path: '*', element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
    ],
  },
]);
