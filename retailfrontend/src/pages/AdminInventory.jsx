import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminInventory() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [editing, setEditing] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    const res = await api.get('/api/admin/inventory');
    setInventory(res.data.data);
  };

  const updateStock = async (productId) => {
    try {
      await api.put(`/api/admin/inventory/${productId}`, { availableStock: parseInt(editing[productId]) });
      setMsg('Stock updated!');
      setEditing({ ...editing, [productId]: undefined });
      fetchInventory();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) { setMsg('Failed to update'); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Back</button>
        <h2>Inventory Management</h2>
      </div>
      {msg && <div style={styles.toast}>{msg}</div>}
      <div style={styles.list}>
        {inventory.map(inv => (
          <div key={inv.id} style={styles.card}>
            <div style={styles.info}>
              <strong>{inv.product.name}</strong>
              <p style={styles.sub}>Current Stock: <strong>{inv.availableStock}</strong> units</p>
            </div>
            <div style={styles.editArea}>
              <input
                style={styles.input}
                type="number"
                placeholder="New stock"
                value={editing[inv.product.id] ?? ''}
                onChange={e => setEditing({ ...editing, [inv.product.id]: e.target.value })}
              />
              <button style={styles.btn} onClick={() => updateStock(inv.product.id)}>Update</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5', padding: '2rem', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { padding: '8px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px' },
  card: { background: '#fff', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  info: { flex: 1 },
  sub: { color: '#888', fontSize: '0.85rem', margin: '4px 0 0' },
  editArea: { display: 'flex', gap: '10px', alignItems: 'center' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ddd', width: '120px' },
  btn: { padding: '8px 16px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  toast: { position: 'fixed', top: '20px', right: '20px', background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '4px', zIndex: 999 }
};