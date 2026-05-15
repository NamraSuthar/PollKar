import { Navigate, Route, Routes } from "react-router-dom";

import { AuthLayout } from "../common/components/AuthLayout.jsx";
import { DashboardLayout } from "../common/components/DashboardLayout.jsx";
import { getAccessToken } from "../common/utils/auth-token.js";

import { LoginPage } from "../modules/auth/LoginPage.jsx";
import { RegisterPage } from "../modules/auth/RegisterPage.jsx";
import { AnalyticsPage } from "../modules/analytics/AnalyticsPage.jsx";
import { AnalyticsListPage } from "../modules/analytics/AnalyticsListPage.jsx";
import { PublicResultsPage } from "../modules/analytics/PublicResultsPage.jsx";
import { CreatePollPage } from "../modules/polls/CreatePollPage.jsx";
import { PollListPage } from "../modules/polls/PollListPage.jsx";
import { PublicPollPage } from "../modules/polls/PublicPollPage.jsx";
import { PollDetailPage } from "../modules/polls/PollDetailPage.jsx";

function ProtectedRoute({ children }) {
  if (!getAccessToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  if (getAccessToken()) {
    return <Navigate to="/dashboard/polls" replace />;
  }

  return children;
}

export function AppRoutes({ theme, onToggleTheme }) {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
      </Route>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout theme={theme} onToggleTheme={onToggleTheme} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard/polls" replace />} />
        <Route path="polls" element={<PollListPage />} />
        <Route path="polls/new" element={<CreatePollPage />} />
        <Route path="polls/:id" element={<PollDetailPage />} />
        <Route path="analytics" element={<AnalyticsListPage />} />
        <Route path="analytics/:pollId" element={<AnalyticsPage />} />
      </Route>

      <Route path="/poll/:slug" element={<PublicPollPage />} />
      <Route path="/poll/:slug/results" element={<PublicResultsPage />} />

      <Route
        path="*"
        element={
          <Navigate to={getAccessToken() ? "/dashboard/polls" : "/login"} replace />
        }
      />
    </Routes>
  );
}
