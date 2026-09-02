import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Failed to load dashboard data. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your platform's performance and activity.</p>
        </header>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="stat-grid">
              <div className="stat-card stagger-item">
                <span className="stat-label">Total Users</span>
                <span className="stat-value">{stats?.totalUsers ?? 0}</span>
                <Link
                  to="/admin/users"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--primary)',
                    fontWeight: 'var(--weight-medium)',
                    marginTop: 'auto',
                    paddingTop: 'var(--space-2)'
                  }}
                >
                  View all users →
                </Link>
              </div>

              <div className="stat-card stagger-item">
                <span className="stat-label">Total Stores</span>
                <span className="stat-value">{stats?.totalStores ?? 0}</span>
                <Link
                  to="/admin/stores"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--primary)',
                    fontWeight: 'var(--weight-medium)',
                    marginTop: 'auto',
                    paddingTop: 'var(--space-2)'
                  }}
                >
                  View all stores →
                </Link>
              </div>

              <div className="stat-card stagger-item">
                <span className="stat-label">Total Ratings</span>
                <span className="stat-value">{stats?.totalRatings ?? 0}</span>
                <span
                  className="text-muted"
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    marginTop: 'auto',
                    paddingTop: 'var(--space-2)'
                  }}
                >
                  Across all stores
                </span>
              </div>
            </div>

            <section>
              <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-6)' }}>
                Quick actions
              </h2>
              <div className="quick-action-grid">
                <Link to="/admin/users/new" className="quick-action-card stagger-item">
                  <div className="quick-action-icon blue">
                    <span>👤</span>
                  </div>
                  <div>
                    <div className="quick-action-title">Add new user</div>
                    <div className="quick-action-desc">Create a user or owner</div>
                  </div>
                </Link>

                <Link to="/admin/stores/new" className="quick-action-card stagger-item">
                  <div className="quick-action-icon green">
                    <span>🏪</span>
                  </div>
                  <div>
                    <div className="quick-action-title">Add new store</div>
                    <div className="quick-action-desc">Register a new location</div>
                  </div>
                </Link>

                <Link to="/admin/users" className="quick-action-card stagger-item">
                  <div className="quick-action-icon orange">
                    <span>⚙️</span>
                  </div>
                  <div>
                    <div className="quick-action-title">User roles</div>
                    <div className="quick-action-desc">Manage permissions</div>
                  </div>
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
