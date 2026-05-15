import { Navigate, Route, Routes } from "react-router-dom";

import { AuthLayout } from "../common/components/AuthLayout.jsx";
import { DashboardLayout } from "../common/components/DashboardLayout.jsx";
import { getAccessToken } from "../common/utils/auth-token.js";

import { LoginPage } from "../modules/auth/LoginPage.jsx";
import { RegisterPage } from "../modules/auth/RegisterPage.jsx";
import { AnalyticsPage } from "../modules/analytics/AnalyticsPage.jsx";
import { PublicResultsPage } from "../modules/analytics/PublicResultsPage.jsx";
import { CreatePollPage } from "../modules/polls/CreatePollPage.jsx";
import { PollListPage } from "../modules/polls/PollListPage.jsx";
import { PublicPollPage } from "../modules/polls/PublicPollPage.jsx";

function ProtectedRoute({ children }) {
    if (!getAccessToken()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export function AppRoutes({ theme, onToggleTheme }) {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
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
                <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            <Route path="/poll/:slug" element={<PublicPollPage />} />
            <Route path="/poll/:slug/results" element={<PublicResultsPage />} />

            <Route path="*" element={<Navigate to="/dashboard/polls" replace />} />
        </Routes>
    );
}
