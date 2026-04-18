import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', imageUrl: '', stockQuantity: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const fetchProducts = async () => {
    const res = await api.get('/api/products');
    setProducts(res.data.data);
  };

  const fetchCategories = async () => {
    const res = await api.get('/api/categories');
    setCategories(res.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', { ...form, price: parseFloat(form.price), categoryId: parseInt(form.categoryId), stockQuantity: parseInt(form.stockQuantity) });
      setMsg('Product created!');
      setForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '', stockQuantity: '' });
      fetchProducts();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) { setMsg(err.response?.data?.message || 'Failed'); }
  };

  const deactivate = async (id) => {
    await api.delete(`/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Back</button>
        <h2>Manage Products</h2>
      </div>
      {msg && <div style={styles.toast}>{msg}</div>}

      <div style={styles.container}>
        <div style={styles.formBox}>
          <h3>Add New Product</h3>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input style={styles.input} placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <select style={styles.input} value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input style={styles.input} placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
            <input style={styles.input} placeholder="Stock Quantity" type="number" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} required />
            <button style={styles.btn} type="submit">Add Product</button>
          </form>
        </div>

        <div style={styles.list}>
          <h3>All Products</h3>
          {products.map(p => (
            <div key={p.id} style={styles.item}>
              <div>
                <strong>{p.name}</strong>
                <p style={styles.sub}>₹{p.price} | Stock: {p.stockQuantity} | {p.active ? '✅ Active' : '❌ Inactive'}</p>
              </div>
              {p.active && <button style={styles.delBtn} onClick={() => deactivate(p.id)}>Deactivate</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5', padding: '2rem', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { padding: '8px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  container: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  formBox: { background: '#fff', padding: '1.5rem', borderRadius: '8px', minWidth: '300px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  input: { width: '100%', padding: '8px', marginBottom: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { flex: 1 },
  item: { background: '#fff', padding: '1rem', borderRadius: '8px', marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  sub: { color: '#888', fontSize: '0.85rem', margin: '4px 0 0' },
  delBtn: { padding: '6px 12px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  toast: { position: 'fixed', top: '20px', right: '20px', background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '4px', zIndex: 999 }
};