import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  const home = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'owner'
    ? '/owner/dashboard'
    : '/stores';

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--danger)' }}>403</h1>
        <h2 style={{ marginBottom: '0.5rem' }}>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
        <Link to={home} className="btn btn-primary mt-3">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
