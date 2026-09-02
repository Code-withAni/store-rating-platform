import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import { validateName, validateEmail, validateAddress } from '../../utils/validators';
import toast from 'react-hot-toast';

const AdminAddStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEdit);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'owner' } })
      .then((res) => setOwners(res.data))
      .catch(() => toast.error('Failed to load store owners.'));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/admin/stores/${id}`)
      .then((res) => setForm({
        name: res.data.name,
        email: res.data.email,
        address: res.data.address,
        owner_id: res.data.owner_id ? String(res.data.owner_id) : '',
      }))
      .catch(() => toast.error('Failed to load store data'))
      .finally(() => setPageLoading(false));
  }, [id]);

  const validate = () => ({
    name: validateName(form.name),
    email: validateEmail(form.email),
    address: validateAddress(form.address),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    const hasErrors = Object.values(errs).some(Boolean);
    if (hasErrors) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.owner_id) delete payload.owner_id;
      if (isEdit) {
        await api.put(`/admin/stores/${id}`, payload);
        toast.success('Store updated successfully');
      } else {
        await api.post('/admin/stores', payload);
        toast.success('Store created successfully');
      }
      navigate('/admin/stores');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} store`);
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className: `form-control ${errors[key] ? 'error' : ''}`,
  });

  if (pageLoading) return (
    <>
      <Navbar />
      <div className="loading-center"><div className="spinner" /></div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: 500 }}>
        <button className="btn btn-secondary mb-2" onClick={() => navigate('/admin/stores')}>
          ← Back
        </button>
        <h1 className="page-title">{isEdit ? 'Edit Store' : 'Add New Store'}</h1>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Store Name</label>
              <input type="text" {...field('name')} placeholder="Min 20 characters" />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Store Email</label>
              <input type="email" {...field('email')} />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea rows={2} {...field('address')} />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Store Owner (optional)</label>
              <select
                className="form-control"
                value={form.owner_id}
                onChange={(e) => setForm({ ...form, owner_id: e.target.value })}
              >
                <option value="">— No Owner —</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-2" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="spinner" />
                  <span>{isEdit ? 'Updating Store...' : 'Creating Store...'}</span>
                </div>
              ) : (
                isEdit ? 'Update Store' : 'Create Store'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminAddStore;