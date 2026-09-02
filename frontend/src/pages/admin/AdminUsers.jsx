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
          <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--gray-900)' }}>{row.name}</div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--gray-500)' }}>{row.email}</div>
        </div>
      )
    },
    { key: 'address', label: 'Location' },
    { key: 'role', label: 'Role', render: (row) => roleBadge(row.role) },
    {
      key: 'actions',
      label: '',
      sortable: false,
      render: (row) => (
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate(`/admin/users/${row.id}`)}
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
            <h1 className="page-title">Users</h1>
            <p className="page-subtitle">Manage users, their roles, and access permissions.</p>
          </div>
          <Link to="/admin/users/new" className="btn btn-primary">
            <span>+</span> Add user
          </Link>
        </header>

        <div className="filters-row">
          <div className="form-group" style={{ marginBottom: 0, minWidth: '180px', flex: 1 }}>
            <label className="form-label">Name</label>
            <input
              className="form-control"
              placeholder="Search by name..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '180px', flex: 1 }}>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              placeholder="Search by email..."
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, minWidth: '150px' }}>
            <label className="form-label">Role</label>
            <select
              className="form-control"
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All roles'}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-2)' }}>
            <button
              className="btn btn-ghost"
              onClick={() => {
                const empty = { name: '', email: '', address: '', role: '' };
                setFilters(empty);
                fetchUsers(empty);
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : (
          <SortableTable columns={columns} data={users} emptyText="No users found matching your filters" />
        )}
      </div>
    </>
  );
};

export default AdminUsers;
