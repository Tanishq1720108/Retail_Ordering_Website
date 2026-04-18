import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', brand: '', packagingType: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    const res = await api.get('/api/categories');
    setCategories(res.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/categories', form);
      setMsg('Category created!');
      setForm({ name: '', brand: '', packagingType: '' });
      fetchCategories();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed');
      setTimeout(() => setMsg(''), 2000);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Back</button>
        <h2>Manage Categories</h2>
      </div>
      {msg && <div style={styles.toast}>{msg}</div>}

      <div style={styles.container}>
        <div style={styles.formBox}>
          <h3>Add New Category</h3>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="Category Name (e.g. Pizza)"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} placeholder="Brand (e.g. Dominos)"
              value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />
            <input style={styles.input} placeholder="Packaging Type (e.g. Box)"
              value={form.packagingType} onChange={e => setForm({ ...form, packagingType: e.target.value })} />
            <button style={styles.btn} type="submit">Add Category</button>
          </form>
        </div>

        <div style={styles.list}>
          <h3>All Categories</h3>
          {categories.map(cat => (
            <div key={cat.id} style={styles.item}>
              <div>
                <strong>{cat.name}</strong>
                <p style={styles.sub}>Brand: {cat.brand || '—'} | Packaging: {cat.packagingType || '—'}</p>
              </div>
              <button style={styles.delBtn} onClick={() => deleteCategory(cat.id)}>Delete</button>
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