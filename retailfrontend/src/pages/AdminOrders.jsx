import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const res = await api.get('/api/admin/orders');
    setOrders(res.data.data);
  };

  const updateStatus = async (orderId, status) => {
    await api.put(`/api/admin/orders/${orderId}/status?status=${status}`);
    fetchOrders();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>← Back</button>
        <h2>All Orders</h2>
      </div>
      <div style={styles.list}>
        {orders.map(order => (
          <div key={order.id} style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <strong>Order #{order.id}</strong>
                <p style={styles.sub}>{new Date(order.orderDate).toLocaleString()} | ₹{order.totalAmount}</p>
              </div>
              <select style={styles.select} value={order.status} onChange={e => updateStatus(order.id, e.target.value)}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={styles.items}>
              {order.items.map(i => (
                <span key={i.id} style={styles.itemTag}>{i.product.name} x{i.quantity}</span>
              ))}
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
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  sub: { color: '#888', fontSize: '0.85rem', margin: '4px 0 0' },
  select: { padding: '6px 10px', borderRadius: '4px', border: '1px solid #ddd' },
  items: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  itemTag: { background: '#f0f0f0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }
};