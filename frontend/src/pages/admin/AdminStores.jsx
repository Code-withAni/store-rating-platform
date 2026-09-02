import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import StarRating from '../../components/StarRating';
import toast from 'react-hot-toast';

const AdminStores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });

  const fetchStores = () => {
    setLoading(true);
    const params = {};
    if (filters.name) params.name = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.address) params.address = filters.address;

    api.get('/admin/stores', { params })
      .then((res) => setStores(res.data))
      .catch(() => toast.error('Failed to load stores. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStores(); }, []);

  const columns = [
    { 
      key: 'name', 
      label: 'Store',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      )
    },
    { key: 'address', label: 'Location' },
    {
      key: 'avg_rating',
      label: 'Performance',
      render: (row) =>
        row.avg_rating ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <StarRating value={Math.round(row.avg_rating)} readOnly style={{ fontSize: '1.125rem' }} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--gray-700)' }}>{row.avg_rating}</span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Average based on feedback</span>
          </div>
        ) : (
          <span className="text-muted" style={{ fontSize: '0.875rem' }}>No ratings yet</span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/admin/stores/${row.id}`)}
          style={{ borderRadius: '9999px' }}
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="page">
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Store Management</h1>
            <p className="text-muted">Register and monitor business locations participating in the platform.</p>
          </div>
          <Link to="/admin/stores/new" className="btn btn-primary">
            <span>+</span> Register Store
          </Link>
        </header>

        <div className="filters-row" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', width: '100%' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem' }}>Store Name</label>
              <input
                className="form-control"
                placeholder="Search name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem' }}>Location</label>
              <input
                className="form-control"
                placeholder="Search address..."
                value={filters.address}
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-primary btn-block" onClick={fetchStores}>Filter Results</button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setFilters({ name: '', email: '', address: '' });
                  setTimeout(fetchStores, 0);
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <SortableTable columns={columns} data={stores} emptyText="No stores found matching your criteria" />
          </div>
        )}
      </div>
    </>
  );
};

export default AdminStores;
