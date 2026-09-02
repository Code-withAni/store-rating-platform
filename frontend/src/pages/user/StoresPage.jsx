import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

const RatingModal = ({ store, onClose, onSaved }) => {
  const [rating, setRating] = useState(store.user_rating || 0);
  const [comment, setComment] = useState(store.user_comment || '');
  const [loading, setLoading] = useState(false);
  const isEdit = !!store.user_rating_id;

  const ratingLabels = {
    1: 'Very disappointed',
    2: 'Needs improvement',
    3: 'It was okay',
    4: 'Good experience',
    5: 'Excellent!'
  };

  const handleSubmit = async () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/user/ratings/${store.user_rating_id}`, { rating, comment });
        toast.success('Rating updated!');
      } else {
        await api.post('/user/ratings', { store_id: store.id, rating, comment });
        toast.success('Rating submitted!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div>
            <h3 className="modal-title">{isEdit ? 'Update rating' : 'Rate this store'}</h3>
            <p className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>{store.name}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{
              padding: 'var(--space-1)',
              width: '28px',
              height: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '1.25rem',
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="rating-card">
          <StarRating
            value={rating}
            onChange={setRating}
            style={{ fontSize: '2rem', display: 'flex', justifyContent: 'center' }}
          />
          <div style={{ marginTop: 'var(--space-3)' }}>
            {rating > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--weight-semibold)', color: 'var(--gray-900)' }}>
                  {ratingLabels[rating]}
                </span>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
                  {rating} out of 5 stars
                </span>
              </div>
            ) : (
              <p style={{ color: 'var(--gray-400)', fontWeight: 'var(--weight-medium)', fontSize: 'var(--font-size-sm)' }}>
                Select a rating to share your feedback
              </p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment" className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Comment</span>
            <span className="text-muted" style={{ fontWeight: 'var(--weight-normal)' }}>{comment.length}/200</span>
          </label>
          <textarea
            id="comment"
            className="form-control"
            placeholder="Share more about your experience..."
            rows={3}
            maxLength={200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: 'none' }}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !rating}>
            {loading ? <span className="spinner" /> : isEdit ? 'Update rating' : 'Submit rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StoresPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [selectedStore, setSelectedStore] = useState(null);

  const fetchStores = (params = {}) => {
    setLoading(true);
    api.get('/user/stores', { params })
      .then((res) => setStores(res.data))
      .catch(() => toast.error('Failed to load stores. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStores(); }, []);

  const handleSearch = () => {
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.address) params.address = filters.address;
    fetchStores(params);
  };

  const handleReset = () => {
    setFilters({ name: '', address: '' });
    fetchStores();
  };

  return (
    <>
      <Navbar />
      <div className="page">
        <header className="page-header flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="page-title">Explore stores</h1>
            <p className="page-subtitle">Discover and rate local businesses in your area.</p>
          </div>

          <div className="filters-row" style={{ marginBottom: 0, padding: 'var(--space-3) var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius-xl)' }}>
            <div className="form-group" style={{ marginBottom: 0, minWidth: '160px' }}>
              <input
                className="form-control"
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0, minWidth: '160px' }}>
              <input
                className="form-control"
                placeholder="Location..."
                value={filters.address}
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSearch}>Search</button>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>Reset</button>
          </div>
        </header>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : stores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No stores found</h3>
            <p className="empty-state-text">Try adjusting your filters to find what you're looking for.</p>
            <button className="btn btn-secondary" onClick={handleReset}>Clear all filters</button>
          </div>
        ) : (
          <div className="store-grid">
            {stores.map((store, index) => (
              <div key={store.id} className="store-card stagger-item" style={{ animationDelay: `${index * 40}ms` }}>
                <div className="store-card-header">
                  <div className="store-card-name">{store.name}</div>
                  {store.avg_rating ? (
                    <div className="store-card-badge">★ {store.avg_rating}</div>
                  ) : (
                    <div className="store-card-badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-600)' }}>New</div>
                  )}
                </div>

                <div className="store-card-address">
                  <span style={{ flexShrink: 0 }}>📍</span>
                  <span>{store.address}</span>
                </div>

                <div className="store-card-footer">
                  <div className="store-card-rating">
                    {store.avg_rating ? (
                      <>
                        <StarRating value={Math.round(store.avg_rating)} readOnly style={{ fontSize: '1rem' }} />
                        <span className="store-card-rating-count">({store.total_ratings || 0})</span>
                      </>
                    ) : (
                      <span className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>No ratings yet</span>
                    )}
                  </div>

                  {store.user_rating ? (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedStore(store)}
                    >
                      Edit rating
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setSelectedStore(store)}
                    >
                      Rate now
                    </button>
                  )}
                </div>

                {store.user_rating && (
                  <div className="store-card-user-rating">
                    <span>✓</span> You rated this {store.user_rating} stars
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStore && (
        <RatingModal
          store={selectedStore}
          onClose={() => setSelectedStore(null)}
          onSaved={handleSearch}
        />
      )}
    </>
  );
};

export default StoresPage;
