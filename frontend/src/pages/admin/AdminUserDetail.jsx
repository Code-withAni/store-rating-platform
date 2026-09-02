import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import StarRating from '../../components/StarRating';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const roleBadge = (role) => (
    <span className={`badge badge-${role}`}>{role}</span>
  );

  if (loading) return (
    <>
      <Navbar />
      <div className="loading-center"><div className="spinner" /></div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="page">
        <button className="back-btn" onClick={() => navigate('/admin/users')}>
          ← Back to users
        </button>
        <div className="alert alert-error">{error}</div>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page" style={{ maxWidth: '640px' }}>
        <button className="back-btn" onClick={() => navigate('/admin/users')}>
          ← Back to users
        </button>

        <div className="page-header">
          <h1 className="page-title">User details</h1>
          <p className="page-subtitle">Viewing profile information for {user.name}</p>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="detail-table">
            <tbody>
              {[
                ['Name', user.name],
                ['Email', user.email],
                ['Address', user.address],
                ['Role', roleBadge(user.role)],
                ['Joined', new Date(user.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td className="detail-label">{label}</td>
                  <td className="detail-value">{val}</td>
                </tr>
              ))}
              {user.role === 'owner' && (
                <tr>
                  <td className="detail-label">Store rating</td>
                  <td className="detail-value">
                    {user.avg_rating ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <StarRating value={Math.round(user.avg_rating)} readOnly />
                        <span className="text-muted">({user.avg_rating})</span>
                      </div>
                    ) : (
                      <span className="text-muted">No ratings yet</span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminUserDetail;
