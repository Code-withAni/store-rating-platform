import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Shared
import ChangePasswordPage from './pages/ChangePasswordPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminStores from './pages/admin/AdminStores';
import AdminStoreDetail from './pages/admin/AdminStoreDetail';
import AdminAddStore from './pages/admin/AdminAddStore';

// User pages
import StoresPage from './pages/user/StoresPage';

// Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>}
        />
        <Route
          path="/admin/users/new"
          element={<ProtectedRoute roles={['admin']}><AdminAddUser /></ProtectedRoute>}
        />
        <Route
          path="/admin/users/:id"
          element={<ProtectedRoute roles={['admin']}><AdminUserDetail /></ProtectedRoute>}
        />
        <Route
          path="/admin/stores"
          element={<ProtectedRoute roles={['admin']}><AdminStores /></ProtectedRoute>}
        />
        <Route
          path="/admin/stores/new"
          element={<ProtectedRoute roles={['admin']}><AdminAddStore /></ProtectedRoute>}
        />
        <Route
          path="/admin/stores/:id/edit"
          element={<ProtectedRoute roles={['admin']}><AdminAddStore /></ProtectedRoute>}
        />
        <Route
          path="/admin/stores/:id"
          element={<ProtectedRoute roles={['admin']}><AdminStoreDetail /></ProtectedRoute>}
        />

        {/* Normal user routes */}
        <Route
          path="/stores"
          element={<ProtectedRoute roles={['user']}><StoresPage /></ProtectedRoute>}
        />

        {/* Owner routes */}
        <Route
          path="/owner/dashboard"
          element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>}
        />

        {/* Shared: change password */}
        <Route
          path="/settings"
          element={<ProtectedRoute roles={['user', 'owner']}><ChangePasswordPage /></ProtectedRoute>}
        />

        {/* Catch all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
