import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';
import toast from 'react-hot-toast';
import PasswordInput from '../components/PasswordInput';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'owner') navigate('/owner/dashboard');
      else navigate('/stores');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="text-center mb-8">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'var(--primary-light)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-4)',
            fontSize: '1.5rem'
          }}>
            <span style={{ color: 'var(--primary)' }}>★</span>
          </div>
          <h1>Welcome back</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 'var(--space-2)' }}>
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="name@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="flex items-center justify-between">
              <label className="form-label" htmlFor="password">Password</label>
              <Link
                to="#"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--primary)',
                  fontWeight: 'var(--weight-medium)'
                }}
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
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
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
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
            Don't have an account?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 'var(--weight-semibold)'
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
