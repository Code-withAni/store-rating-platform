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
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <StarRating value={row.rating} readOnly style={{ fontSize: '0.875rem' }} />
            <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{row.rating}</span>
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
        <span style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
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
        <h1 className="page-title">Owner Dashboard</h1>
        <div className="card">
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
        <h1 className="page-title">Owner Dashboard</h1>

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Store</span>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              {data.store.name}
            </div>
            <div className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.125rem' }}>
              {data.store.address}
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average Rating</span>
            {data.avgRating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <span className="stat-value" style={{ color: 'var(--warning)' }}>{data.avgRating}</span>
                <StarRating value={Math.round(data.avgRating)} readOnly />
              </div>
            ) : (
              <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>No ratings yet</div>
            )}
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{totalRatings}</span>
          </div>
        </div>

        <SortableTable
          columns={columns}
          data={data.raters}
          emptyText="No one has rated your store yet"
          header={`Customer Reviews (${totalRatings})`}
        />
      </div>
    </>
  );
};

export default OwnerDashboard;
