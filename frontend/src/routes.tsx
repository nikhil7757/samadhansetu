import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import { AppShell } from '@/components/layout/AppShell';
import { useAuth } from '@/lib/auth';

// Lazy-loaded pages
const Landing = lazy(() => import('@/pages/Landing'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
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

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <SuspenseWrapper><Landing /></SuspenseWrapper> },
      { path: 'login', element: <SuspenseWrapper><Login /></SuspenseWrapper> },
      { path: 'signup', element: <SuspenseWrapper><Signup /></SuspenseWrapper> },
      { path: 'problems', element: <SuspenseWrapper><ProblemFeed /></SuspenseWrapper> },
      { path: 'problems/:id', element: <SuspenseWrapper><ProblemDetail /></SuspenseWrapper> },
      { path: 'dashboard', element: <SuspenseWrapper><ImpactDashboard /></SuspenseWrapper> },
      {
        path: 'problems/submit',
        element: (
          <RequireAuth roles={['CITIZEN']}>
            <SuspenseWrapper><SubmitProblem /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'my/submissions',
        element: (
          <RequireAuth roles={['CITIZEN']}>
            <SuspenseWrapper><MySubmissions /></SuspenseWrapper>
          </RequireAuth>
        ),
      },
      {
        path: 'my/interests',
        element: (
          <RequireAuth roles={['UNIVERSITY', 'INDUSTRY']}>
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
