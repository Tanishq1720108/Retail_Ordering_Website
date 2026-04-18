import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/orders/my');
      setOrders(res.data.data);
    } catch (err) { console.error(err); }
  };

  const statusColor = (s) => {
    const map = { PENDING: '#f39c12', CONFIRMED: '#3498db', PREPARING: '#9b59b6', OUT_FOR_DELIVERY: '#e67e22', DELIVERED: '#2ecc71' };
    return map[s] || '#888';
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/menu')}>← Back to Menu</button>
        <h2>My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p>No orders yet</p>
          <button style={styles.btn} onClick={() => navigate('/menu')}>Start Ordering</button>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map(order => (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.orderId}>Order #{order.id}</h3>
                  <p style={styles.date}>{new Date(order.orderDate).toLocaleString()}</p>
                </div>
                <span style={{ ...styles.status, background: statusColor(order.status) }}>
                  {order.status}
                </span>
              </div>
              <div style={styles.cardBottom}>
                <span>{order.items.length} item(s)</span>
                <strong>₹{order.totalAmount}</strong>
                <button style={styles.detailBtn} onClick={() => navigate(`/orders/${order.id}`)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5', padding: '2rem', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { padding: '8px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  empty: { textAlign: 'center', padding: '3rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '700px' },
  card: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  orderId: { margin: 0 },
  date: { color: '#888', fontSize: '0.85rem', margin: '4px 0 0' },
  status: { padding: '4px 12px', borderRadius: '20px', color: '#fff', fontSize: '0.85rem', fontWeight: 'bold' },
  cardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailBtn: { padding: '6px 14px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btn: { padding: '10px 20px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};