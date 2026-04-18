import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Menu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (categoryId = null) => {
    try {
      const url = categoryId ? `/api/products/category/${categoryId}` : '/api/products';
      const res = await api.get(url);
      setProducts(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    fetchProducts(catId);
  };

  const handleAddToCart = async (productId) => {
    const product = products.find(p => p.id === productId);
    try {
      const cartRes = await api.get('/api/cart');
      const cartItems = cartRes.data.data.items;
      const existingItem = cartItems.find(i => i.product.id === productId);
      const currentQty = existingItem ? existingItem.quantity : 0;

      if (currentQty >= product.stockQuantity) {
        setMsg(`❌ Only ${product.stockQuantity} units available in stock!`);
        setTimeout(() => setMsg(''), 3000);
        return;
      }

      await api.post('/api/cart/add', { productId, quantity: 1 });
      setMsg(`✅ Added to cart! (${currentQty + 1}/${product.stockQuantity} units)`);
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to add');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🍕 Retail Ordering</h2>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hi, {user?.name}</span>
          <button style={styles.navBtn} onClick={() => navigate('/cart')}>🛒 Cart</button>
          <button style={styles.navBtn} onClick={() => navigate('/orders')}>📦 Orders</button>
          <button style={{ ...styles.navBtn, background: '#ccc', color: '#333' }} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {msg && (
        <div style={{
          ...styles.toast,
          background: msg.startsWith('❌') ? '#e74c3c' : '#2ecc71'
        }}>
          {msg}
        </div>
      )}

      <div style={styles.categories}>
        <button
          style={selectedCategory === null ? styles.catBtnActive : styles.catBtn}
          onClick={() => { setSelectedCategory(null); fetchProducts(); }}>
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            style={selectedCategory === cat.id ? styles.catBtnActive : styles.catBtn}
            onClick={() => handleCategoryClick(cat.id)}>
            {cat.name}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {products.map(p => (
          <div key={p.id} style={styles.card}>
            <div style={styles.imgPlaceholder}>🍕</div>
            <h3 style={styles.productName}>{p.name}</h3>
            <p style={styles.desc}>{p.description}</p>
            <p style={styles.price}>₹{p.price}</p>
            <p style={styles.stock}>Stock: {p.stockQuantity} units</p>
            <button
              style={{ ...styles.addBtn, background: p.stockQuantity === 0 ? '#ccc' : '#e44d26', cursor: p.stockQuantity === 0 ? 'not-allowed' : 'pointer' }}
              onClick={() => p.stockQuantity > 0 && handleAddToCart(p.id)}
              disabled={p.stockQuantity === 0}>
              {p.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5', fontFamily: 'sans-serif' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e44d26', padding: '1rem 2rem', color: '#fff' },
  logo: { margin: 0 },
  navRight: { display: 'flex', gap: '10px', alignItems: 'center' },
  welcome: { marginRight: '10px' },
  navBtn: { padding: '8px 14px', background: '#fff', color: '#e44d26', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  categories: { display: 'flex', gap: '10px', padding: '1.5rem 2rem' },
  catBtn: { padding: '8px 18px', background: '#fff', border: '1px solid #ddd', borderRadius: '20px', cursor: 'pointer' },
  catBtnActive: { padding: '8px 18px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', padding: '0 2rem 2rem' },
  card: { background: '#fff', borderRadius: '8px', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center' },
  imgPlaceholder: { fontSize: '3rem', marginBottom: '0.5rem' },
  productName: { margin: '0.5rem 0', fontSize: '1rem' },
  desc: { color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' },
  price: { fontWeight: 'bold', color: '#e44d26', fontSize: '1.1rem', marginBottom: '0.4rem' },
  stock: { color: '#888', fontSize: '0.8rem', marginBottom: '0.8rem' },
  addBtn: { width: '100%', padding: '8px', color: '#fff', border: 'none', borderRadius: '4px' },
  toast: { position: 'fixed', top: '20px', right: '20px', color: '#fff', padding: '10px 20px', borderRadius: '4px', zIndex: 999, fontWeight: 'bold' }
};