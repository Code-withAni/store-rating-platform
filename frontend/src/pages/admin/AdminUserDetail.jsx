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
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
          ← Back
        </button>
      </div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="flex items-center gap-4" style={{ marginBottom: '1.5rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/users')}>
            ← Back
          </button>
          <h1 className="page-title" style={{ marginBottom: 0, textAlign: 'center', flex: 1 }}>User Detail</h1>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', maxWidth: 640, margin: '0 auto' }}>
          <table className="detail-table">
            <tbody>
              {[
                ['Name', user.name],
                ['Email', user.email],
                ['Address', user.address],
                ['Role', roleBadge(user.role)],
                ['Joined', new Date(user.created_at).toLocaleDateString()],
              ].map(([label, val]) => (
                <tr key={label}>
                  <td className="detail-label">{label}</td>
                  <td className="detail-value">{val}</td>
                </tr>
              ))}
              {user.role === 'owner' && (
                <tr>
                  <td className="detail-label">Store Rating</td>
                  <td className="detail-value">
                    {user.avg_rating ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StarRating value={Math.round(user.avg_rating)} readOnly />
                        <span className="text-muted">({user.avg_rating})</span>
                      </span>
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
