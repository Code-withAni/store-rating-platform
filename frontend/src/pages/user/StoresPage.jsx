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
    1:  '😞 Very disappointed with the experience.',
    2: '😕 Needs improvement in several areas.',
    3:  '😐 It was okay, nothing special.',
    4:  '😊 Good experience overall.',
    5:  '😍 Excellent! Highly recommended.'
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
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 className="modal-title" style={{ marginBottom: '0.25rem' }}>{isEdit ? 'Update Your Rating' : 'Rate this Store'}</h3>
            <p className="text-muted" style={{ fontSize: '0.9375rem' }}>{store.name}</p>
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--gray-400)' }}
          >
            ×
          </button>
        </div>

        <div style={{ background: 'var(--gray-50)', padding: '2.5rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '1.5rem' }}>
          <StarRating
            value={rating}
            onChange={setRating}
            style={{ fontSize: '3rem', justifyContent: 'center' }}
          />
          <div style={{ marginTop: '1.5rem' }}>
            {rating > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                  {ratingLabels[rating]}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 500 }}>
                  {rating} out of 5 stars
                </span>
              </div>
            ) : (
              <p style={{ fontWeight: 600, color: 'var(--gray-400)' }}>Select a rating to share your feedback</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comment" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Optional Comment</span>
            <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.75rem' }}>{comment.length}/200</span>
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
            {loading ? <span className="spinner" /> : isEdit ? 'Update Rating' : 'Submit Rating'}
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
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Explore Stores</h1>
            <p className="text-muted">Discover and rate the best local businesses in your area.</p>
          </div>
          
          <div className="filters-row" style={{ padding: '0.75rem 1rem', background: 'var(--white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-200)' }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}>🔍</span>
              <input
                className="form-control"
                style={{ paddingLeft: '2.25rem', border: 'none', background: 'transparent' }}
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div style={{ width: '1px', height: '24px', background: 'var(--gray-200)', margin: '0 0.5rem' }}></div>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}>📍</span>
              <input
                className="form-control"
                style={{ paddingLeft: '2.25rem', border: 'none', background: 'transparent' }}
                placeholder="Location..."
                value={filters.address}
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="btn btn-primary btn-sm" onClick={handleSearch} style={{ marginLeft: '0.5rem' }}>Search</button>
            <button className="btn btn-secondary btn-sm" onClick={handleReset}>Reset</button>
          </div>
        </header>

        {loading ? (
          <div className="loading-center"><div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} /></div>
        ) : stores.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔎</div>
            <h3>No stores found</h3>
            <p className="text-muted mt-2">Try adjusting your filters to find what you're looking for.</p>
            <button className="btn btn-secondary mt-3" onClick={handleReset}>Clear All Filters</button>
          </div>
        ) : (
          <div className="store-grid">
            {stores.map((store) => (
              <div key={store.id} className="store-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="store-card-name">{store.name}</div>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {store.avg_rating ? `⭐ ${store.avg_rating}` : 'New'}
                  </div>
                </div>
                
                <div className="store-card-address" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📍</span> {store.address}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="store-card-rating">
                      {store.avg_rating ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <StarRating value={Math.round(store.avg_rating)} readOnly style={{ fontSize: '1.125rem' }} />
                          <span className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>({store.total_ratings || 0})</span>
                        </div>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>No ratings yet</span>
                      )}
                    </div>
                    
                    {store.user_rating ? (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedStore(store)}
                        style={{ borderRadius: '9999px' }}
                      >
                        Edit Rating
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setSelectedStore(store)}
                        style={{ borderRadius: '9999px' }}
                      >
                        Rate Now
                      </button>
                    )}
                  </div>
                  
                  {store.user_rating && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      ✓ You rated this {store.user_rating} stars
                    </div>
                  )}
                </div>
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
