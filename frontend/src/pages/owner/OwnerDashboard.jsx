import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import SortableTable from '../../components/SortableTable';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch(() => toast.error('Failed to load dashboard data. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--weight-semibold)' }}>{row.name}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <StarRating value={row.rating} readOnly style={{ fontSize: '0.875rem' }} />
            <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--font-size-sm)' }}>{row.rating}</span>
          </div>
          {row.comment && (
            <div className="comment-bubble">
              &ldquo;{row.comment}&rdquo;
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => (
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
          {new Date(row.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
  ];

  if (loading) return (
    <>
      <Navbar />
      <div className="loading-center"><div className="spinner" /></div>
    </>
  );

  if (!data?.store) return (
    <>
      <Navbar />
      <div className="page">
        <h1 className="page-title">Dashboard</h1>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <p className="text-muted">No store has been assigned to your account yet. Please contact an administrator.</p>
        </div>
      </div>
    </>
  );

  const totalRatings = data.raters.length;

  return (
    <>
      <Navbar />
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your store's ratings and customer feedback.</p>
        </header>

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Store</span>
            <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--font-size-lg)', color: 'var(--gray-900)', marginTop: 'var(--space-1)' }}>
              {data.store.name}
            </div>
            <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
              {data.store.address}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Average rating</span>
            {data.avgRating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                <span className="stat-value" style={{ color: 'var(--warning)', fontSize: 'var(--font-size-3xl)' }}>{data.avgRating}</span>
                <StarRating value={Math.round(data.avgRating)} readOnly />
              </div>
            ) : (
              <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>No ratings yet</div>
            )}
          </div>

          <div className="stat-card">
            <span className="stat-label">Total reviews</span>
            <span className="stat-value">{totalRatings}</span>
          </div>
        </div>

        <SortableTable
          columns={columns}
          data={data.raters}
          emptyText="No one has rated your store yet"
          header={`Customer reviews (${totalRatings})`}
        />
      </div>
    </>
  );
};

export default OwnerDashboard;
