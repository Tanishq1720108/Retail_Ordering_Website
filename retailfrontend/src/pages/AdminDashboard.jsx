import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>⚙️ Admin Panel</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate('/admin/categories')}>
          <div style={styles.icon}>🗂️</div>
          <h3>Categories</h3>
          <p>Manage categories</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/admin/products')}>
          <div style={styles.icon}>📦</div>
          <h3>Products</h3>
          <p>Manage products</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/admin/orders')}>
          <div style={styles.icon}>🧾</div>
          <h3>Orders</h3>
          <p>View & update orders</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/admin/inventory')}>
          <div style={styles.icon}>🏭</div>
          <h3>Inventory</h3>
          <p>Manage stock levels</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2c3e50', padding: '1rem 2rem', color: '#fff' },
  logo: { margin: 0 },
  logoutBtn: { padding: '8px 14px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', padding: '3rem 2rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '2rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' },
  icon: { fontSize: '3rem', marginBottom: '1rem' }
};