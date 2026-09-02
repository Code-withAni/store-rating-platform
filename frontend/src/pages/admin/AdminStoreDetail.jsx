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
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <StarRating value={row.rating} readOnly style={{ fontSize: '0.875rem' }} />
          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{row.rating}</span>
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
          <span className="text-muted" style={{ fontSize: '0.8125rem' }}>—</span>
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
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/stores')}>
          ← Back
        </button>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/stores')}>
            ← Back
          </button>
          <h1 className="page-title" style={{ marginBottom: 0, textAlign: 'center', flex: 1 }}>
            Store Detail
          </h1>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/admin/stores/${id}/edit`)}>
            Edit Store
          </button>
        </div>

        <div className="stat-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <span className="stat-label">Store</span>
            <div style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              {store.name}
            </div>
            <div className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.125rem' }}>
              {store.email}
            </div>
            <div className="text-muted" style={{ fontSize: '0.8125rem' }}>
              {store.address}
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Average Rating</span>
            {store.avg_rating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                <span className="stat-value" style={{ color: 'var(--warning)' }}>{store.avg_rating}</span>
                <StarRating value={Math.round(store.avg_rating)} readOnly />
              </div>
            ) : (
              <div className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>No ratings yet</div>
            )}
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Reviews</span>
            <span className="stat-value">{store.total_ratings}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Owner</span>
            <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--gray-900)', marginTop: '0.25rem' }}>
              {store.owner_name || '—'}
            </div>
            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.125rem' }}>
              {store.owner_name ? 'Assigned' : 'Unassigned'}
            </div>
          </div>
        </div>

        <SortableTable
          columns={columns}
          data={store.ratings}
          emptyText="No ratings yet for this store"
          header={`Customer Ratings (${store.total_ratings})`}
        />
      </div>
    </>
  );
};

export default AdminStoreDetail;