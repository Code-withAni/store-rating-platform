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
          <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--gray-900)' }}>{row.name}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      )
    },
    { key: 'address', label: 'Location' },
    {
      key: 'avg_rating',
      label: 'Rating',
      render: (row) =>
        row.avg_rating ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <StarRating value={Math.round(row.avg_rating)} readOnly style={{ fontSize: '1rem' }} />
            <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--gray-700)' }}>
              {row.avg_rating}
            </span>
          </div>
        ) : (
          <span className="text-muted" style={{ fontSize: 'var(--font-size-sm)' }}>No ratings yet</span>
        ),
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/admin/stores/${row.id}`)}
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
        <header className="page-header flex items-center justify-between">
          <div>
            <h1 className="page-title">Stores</h1>
            <p className="page-subtitle">Manage and monitor business locations on the platform.</p>
          </div>
          <Link to="/admin/stores/new" className="btn btn-primary">
            <span>+</span> Add store
          </Link>
        </header>

        <div className="filters-row">
          <div className="form-group" style={{ marginBottom: 0, minWidth: '200px', flex: 1 }}>
            <label className="form-label">Store name</label>
            <input
              className="form-control"
              placeholder="Search by name..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '200px', flex: 1 }}>
            <label className="form-label">Location</label>
            <input
              className="form-control"
              placeholder="Search by address..."
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
            <button className="btn btn-primary" onClick={fetchStores}>Search</button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setFilters({ name: '', email: '', address: '' });
                setTimeout(fetchStores, 0);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <SortableTable columns={columns} data={stores} emptyText="No stores found matching your criteria" />
        )}
      </div>
    </>
  );
};

export default AdminStores;
