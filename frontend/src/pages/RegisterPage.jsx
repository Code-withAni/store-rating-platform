import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
} from '../utils/validators';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    return {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    const hasErrors = Object.values(errs).some(Boolean);
    if (hasErrors) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fieldProps = (key) => ({
    id: key,
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
    className: `form-control ${errors[key] ? 'error' : ''}`,
  });

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '440px' }}>
        <div className="text-center mb-8">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'var(--success-light)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-4)',
            fontSize: '1.5rem'
          }}>
            <span style={{ color: 'var(--success)' }}>✦</span>
          </div>
          <h1>Create your account</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
            Join StoreRater to discover and rate local stores
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <input
              type="text"
              {...fieldProps('name')}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              type="email"
              {...fieldProps('email')}
              placeholder="name@company.com"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Physical address</label>
            <textarea
              rows={2}
              {...fieldProps('address')}
              placeholder="Enter your full address"
              style={{ resize: 'none' }}
            />
            {errors.address && <span className="error-msg">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <PasswordInput
              {...fieldProps('password')}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg mt-6"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="spinner" />
                <span>Creating account...</span>
              </div>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div style={{
          marginTop: 'var(--space-8)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid var(--gray-100)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--gray-500)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                fontWeight: 'var(--weight-semibold)'
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
