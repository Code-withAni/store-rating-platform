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
        <header style={{ marginBottom: '2.5rem' }}>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Admin Overview</h1>
          <p className="text-muted">Monitor and manage users, stores, and ratings across the platform.</p>
        </header>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <>
            <div className="stat-grid">
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="stat-label">Total Users</span>
                  <span style={{ fontSize: '1.5rem' }}>👥</span>
                </div>
                <span className="stat-value">{stats?.totalUsers ?? 0}</span>
                <Link to="/admin/users" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.5rem' }}>
                  View all users →
                </Link>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="stat-label">Total Stores</span>
                  <span style={{ fontSize: '1.5rem' }}>🏬</span>
                </div>
                <span className="stat-value">{stats?.totalStores ?? 0}</span>
                <Link to="/admin/stores" style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.5rem' }}>
                  View all stores →
                </Link>
              </div>
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="stat-label">Total Ratings</span>
                  <span style={{ fontSize: '1.5rem' }}>⭐</span>
                </div>
                <span className="stat-value">{stats?.totalRatings ?? 0}</span>
                <span className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                  Across all stores
                </span>
              </div>
            </div>

            <section>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Link to="/admin/users/new" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                  <span style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '1.25rem' }}>👤</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Add New User</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Create a user or owner</div>
                  </div>
                </Link>
                <Link to="/admin/stores/new" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                  <span style={{ background: '#ecfdf5', padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '1.25rem' }}>🏪</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Add New Store</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Register a new location</div>
                  </div>
                </Link>
                <Link to="/admin/users" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                  <span style={{ background: '#fff7ed', padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '1.25rem' }}>⚙️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>User Roles</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>Manage permissions</div>
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
