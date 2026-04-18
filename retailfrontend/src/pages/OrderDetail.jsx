import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => { fetchOrder(); }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/api/orders/my/${id}`);
      setOrder(res.data.data);
    } catch (err) { console.error(err); }
  };

  if (!order) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/orders')}>← Back to Orders</button>
        <h2>Order #{order.id}</h2>
      </div>

      <div style={styles.card}>
        <div style={styles.row}><span>Status</span><strong>{order.status}</strong></div>
        <div style={styles.row}><span>Date</span><span>{new Date(order.orderDate).toLocaleString()}</span></div>
        <div style={styles.row}><span>Delivery Address</span><span>{order.deliveryAddress}</span></div>
        <div style={styles.row}><span>Total</span><strong>₹{order.totalAmount}</strong></div>
      </div>

      <h3 style={{ marginTop: '2rem' }}>Items</h3>
      <div style={styles.itemsList}>
        {order.items.map(item => (
          <div key={item.id} style={styles.item}>
            <span style={styles.itemName}>{item.product.name}</span>
            <span>x{item.quantity}</span>
            <span>₹{item.priceAtTime} each</span>
            <strong>₹{item.subtotal}</strong>
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
  loading: { textAlign: 'center', padding: '3rem', fontFamily: 'sans-serif' },
  card: { background: '#fff', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', maxWidth: '600px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #f0f0f0' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '600px' },
  item: { background: '#fff', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  itemName: { flex: 1, fontWeight: 'bold' }
};