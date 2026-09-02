import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          background: 'var(--gray-100)',
          borderRadius: 'var(--radius-xl)',
          marginBottom: 'var(--space-4)',
          fontSize: '2rem'
        }}>
          <span style={{ color: 'var(--gray-600)' }}>🔍</span>
        </div>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', color: 'var(--gray-900)', marginBottom: 'var(--space-2)' }}>404</h1>
        <h2 style={{ marginBottom: 'var(--space-2)' }}>Page not found</h2>
        <p style={{ marginBottom: 'var(--space-8)' }}>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/login" className="btn btn-primary btn-lg">
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
