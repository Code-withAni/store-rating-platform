import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const links = () => {
    if (!user) return null;
    if (user.role === 'admin') return (
      <>
        <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>Users</NavLink>
        <NavLink to="/admin/stores" className={({ isActive }) => isActive ? 'active' : ''}>Stores</NavLink>
      </>
    );
    if (user.role === 'user') return (
      <>
        <NavLink to="/stores" className={({ isActive }) => isActive ? 'active' : ''}>Explore Stores</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>Settings</NavLink>
      </>
    );
    if (user.role === 'owner') return (
      <>
        <NavLink to="/owner/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>My Store</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>Settings</NavLink>
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span>⭐</span> StoreRater
        </NavLink>
        <div className="navbar-links">
          {links()}
          {user && (
            <div className="flex items-center gap-4" style={{ marginLeft: '1rem', borderLeft: '1px solid var(--gray-200)', paddingLeft: '1.5rem' }}>
              <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
