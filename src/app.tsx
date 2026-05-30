import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { VehiclesPage } from './pages/VehiclesPage';
import { RequestsPage } from './pages/RequestsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ToastContainer } from './components/ui/Toast';

// Component to protect dashboards from unauthenticated users
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const App = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverview />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Wildcard 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
