import { useState } from 'react';
import api from '../api/axios';
import { validatePassword } from '../utils/validators';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';

const ChangePasswordPage = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.currentPassword) errs.currentPassword = 'Current password is required';
    const pwErr = validatePassword(form.newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update password';
      toast.error(msg);
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
      <div className="page" style={{ maxWidth: '440px' }}>
        <div className="page-header">
          <h1 className="page-title">Change password</h1>
          <p className="page-subtitle">Update your password to keep your account secure.</p>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Current password</label>
              <PasswordInput id="currentPassword" {...field('currentPassword')} />
              {errors.currentPassword && <span className="error-msg">{errors.currentPassword}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New password</label>
              <PasswordInput
                id="newPassword"
                {...field('newPassword')}
                placeholder="Create a strong password"
                autoComplete="new-password"
              />
              {errors.newPassword && <span className="error-msg">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm new password</label>
              <PasswordInput id="confirmPassword" {...field('confirmPassword')} />
              {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
            </div>

            <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--gray-100)' }}>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="spinner" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
