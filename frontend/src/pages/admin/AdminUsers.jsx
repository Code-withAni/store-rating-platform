import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import SortableTable from '../../components/SortableTable';
import toast from 'react-hot-toast';

const ROLES = ['', 'admin', 'user', 'owner'];

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });

  const fetchUsers = useCallback(async (filterValues) => {
    setLoading(true);
    const params = {};
    if (filterValues.name) params.name = filterValues.name;
    if (filterValues.email) params.email = filterValues.email;
    if (filterValues.address) params.address = filterValues.address;
    if (filterValues.role) params.role = filterValues.role;

    try {
      const res = await api.get('/admin/users', { params });
      setUsers(res.data);
    } catch {
      toast.error('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(filters); }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  const roleBadge = (role) => (
    <span className={`badge badge-${role}`}>{role}</span>
  );

  const columns = [
    { 
      key: 'name', 
      label: 'User',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      )
    },
    { key: 'address', label: 'Location' },
    { key: 'role', label: 'Permission', render: (row) => roleBadge(row.role) },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/admin/users/${row.id}`)}
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
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>User Directory</h1>
            <p className="text-muted">Manage system users, their roles, and access permissions.</p>
          </div>
          <Link to="/admin/users/new" className="btn btn-primary">
            <span>+</span> Add New User
          </Link>
        </header>

        <div className="filters-row" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', width: '100%' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem' }}>Name</label>
              <input
                className="form-control"
                placeholder="Search name..."
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem' }}>Email</label>
              <input
                className="form-control"
                placeholder="Search email..."
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem' }}>Role</label>
              <select
                className="form-control"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All Roles'}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                className="btn btn-secondary btn-block"
                onClick={() => {
                  const empty = { name: '', email: '', address: '', role: '' };
                  setFilters(empty);
                  fetchUsers(empty);
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }} /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <SortableTable columns={columns} data={users} emptyText="No users found matching your filters" />
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
