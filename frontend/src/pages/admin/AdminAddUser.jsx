import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../../utils/validators';
import toast from 'react-hot-toast';
import PasswordInput from '../../components/PasswordInput';

const AdminAddUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', address: '', role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => ({
    name: validateName(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    address: validateAddress(form.address),
    role: !['admin', 'user', 'owner'].includes(form.role) ? 'Invalid role' : '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    const hasErrors = Object.values(errs).some(Boolean);
    if (hasErrors) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.post('/admin/users', form);
      toast.success('User created successfully');
      navigate('/admin/users');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className: `form-control ${errors[key] ? 'error' : ''}`,
  });

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '500px' }}>
        <button className="back-btn" onClick={() => navigate('/admin/users')}>
          ← Back to users
        </button>

        <div className="page-header">
          <h1 className="page-title">Add user</h1>
          <p className="page-subtitle">Create a new user account with appropriate permissions.</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input type="text" {...field('name')} placeholder="Enter full name" />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input type="email" {...field('email')} placeholder="name@company.com" />
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea rows={2} {...field('address')} placeholder="Enter physical address" />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <PasswordInput {...field('password')} placeholder="Create a strong password" />
              {errors.password && <span className="error-msg">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select {...field('role')}>
                <option value="user">Normal User</option>
                <option value="owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && <span className="error-msg">{errors.role}</span>}
            </div>

            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--gray-100)' }}>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="spinner" />
                    <span>Creating user...</span>
                  </div>
                ) : (
                  'Create user'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminAddUser;
