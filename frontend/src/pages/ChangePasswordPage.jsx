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
      <div className="page" style={{ maxWidth: 480 }}>
        <h1 className="page-title">Change Password</h1>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <PasswordInput id="currentPassword" {...field('currentPassword')} />
              {errors.currentPassword && <span className="error-msg">{errors.currentPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <PasswordInput
                id="newPassword"
                {...field('newPassword')}
                placeholder="8–16 chars, 1 uppercase, 1 special"
                autoComplete="new-password"
              />
              {errors.newPassword && <span className="error-msg">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <PasswordInput id="confirmPassword" {...field('confirmPassword')} />
              {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-block mt-2" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="spinner" />
                  <span>Updating Password...</span>
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordPage;
