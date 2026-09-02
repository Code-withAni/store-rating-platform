import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import SortableTable from '../../components/SortableTable';

const AdminStoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/stores/${id}`)
      .then((res) => setStore(res.data))
      .catch(() => setError('Store not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 'var(--weight-semibold)' }}>{row.name}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <StarRating value={row.rating} readOnly style={{ fontSize: '0.875rem' }} />
          <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--font-size-sm)' }}>{row.rating}</span>
        </div>
      ),
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) =>
        row.comment ? (
          <div className="comment-bubble">&ldquo;{row.comment}&rdquo;</div>
        ) : (
          <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>—</span>
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
            day: 'numeric',
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

  if (error) return (
    <>
      <Navbar />
      <div className="page">
        <button className="back-btn" onClick={() => navigate('/admin/stores')}>
          ← Back to stores
        </button>
        <div className="alert alert-error">{error}</div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page">
        <button className="back-btn" onClick={() => navigate('/admin/stores')}>
          ← Back to stores
        </button>

        <header className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title">Store details</h1>
            <p className="page-subtitle">{store.name}</p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate(`/admin/stores/${id}/edit`)}>
            Edit store
          </button>
        </header>

        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Store</span>
            <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--font-size-lg)', color: 'var(--gray-900)', marginTop: 'var(--space-1)' }}>
              {store.name}
            </div>
            <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>
              {store.email}
            </div>
            <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>
              {store.address}
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-label">Average rating</span>
            {store.avg_rating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                <span className="stat-value" style={{ color: 'var(--warning)', fontSize: 'var(--font-size-3xl)' }}>{store.avg_rating}</span>
                <StarRating value={Math.round(store.avg_rating)} readOnly />
              </div>
            ) : (
              <div className="text-muted" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-1)' }}>No ratings yet</div>
            )}
          </div>

          <div className="stat-card">
            <span className="stat-label">Total reviews</span>
            <span className="stat-value">{store.total_ratings}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Owner</span>
            <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--font-size-md)', color: 'var(--gray-900)', marginTop: 'var(--space-1)' }}>
              {store.owner_name || '—'}
            </div>
            <div className="text-muted" style={{ fontSize: 'var(--font-size-xs)', marginTop: 'var(--space-1)' }}>
              {store.owner_name ? 'Assigned' : 'Unassigned'}
            </div>
          </div>
        </div>

        <SortableTable
          columns={columns}
          data={store.ratings}
          emptyText="No ratings yet for this store"
          header={`Customer ratings (${store.total_ratings})`}
        />
      </div>
    </>
  );
};

export default AdminStoreDetail;
