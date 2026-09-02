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
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          background: 'var(--danger-light)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-4)',
          fontSize: '2rem'
        }}>
          <span style={{ color: 'var(--danger)' }}>⛔</span>
        </div>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', color: 'var(--gray-900)', marginBottom: 'var(--space-2)' }}>403</h1>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Access denied</h2>
        <p style={{ marginBottom: 'var(--space-8)' }}>You don't have permission to view this page.</p>
        <Link to={home} className="btn btn-primary btn-lg">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
