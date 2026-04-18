import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/cart');
      setCart(res.data.data);
    } catch (err) { console.error(err); }
  };

  const updateQty = async (itemId, qty) => {
  if (qty < 1) return;
  const item = cart.items.find(i => i.id === itemId);
  if (qty > item.product.stockQuantity) {
    setMsg(`❌ Only ${item.product.stockQuantity} units available!`);
    setTimeout(() => setMsg(''), 3000);
    return;
  }
  try {
    await api.put(`/api/cart/update/${itemId}`, { productId: item.product.id, quantity: qty });
    fetchCart();
  } catch (err) { console.error(err); }
};

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/remove/${itemId}`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const placeOrder = async () => {
    try {
      await api.post('/api/orders/place');
      setMsg('Order placed successfully!');
      setTimeout(() => { setMsg(''); navigate('/orders'); }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to place order');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (!cart) return <div style={styles.loading}>Loading cart...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/menu')}>← Back to Menu</button>
        <h2>Your Cart</h2>
      </div>

      {msg && (
  <div style={{
    ...styles.toast,
    background: msg.startsWith('❌') ? '#e74c3c' : '#2ecc71'
  }}>
    {msg}
  </div>
)}


      {cart.items.length === 0 ? (
        <div style={styles.empty}>
          <p>Your cart is empty</p>
          <button style={styles.btn} onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      ) : (
        <div style={styles.container}>
          <div style={styles.itemsList}>
            {cart.items.map(item => (
              <div key={item.id} style={styles.item}>
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.product.name}</h3>
                  <p style={styles.itemPrice}>₹{item.product.price} each</p>
                </div>
                <div style={styles.qtyControls}>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity - 1)}>-</button>
                  <span style={styles.qty}>{item.quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                </div>
                <p style={styles.subtotal}>₹{item.subtotal}</p>
                <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>🗑</button>
              </div>
            ))}
          </div>
          <div style={styles.summary}>
            <h3>Order Summary</h3>
            <div style={styles.summaryRow}>
              <span>Total Items</span>
              <span>{cart.items.length}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>Total Amount</span>
              <strong>₹{cart.totalAmount}</strong>
            </div>
            <button style={styles.orderBtn} onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#f5f5f5', padding: '2rem', fontFamily: 'sans-serif' },
  header: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  backBtn: { padding: '8px 14px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '3rem', fontFamily: 'sans-serif' },
  empty: { textAlign: 'center', padding: '3rem' },
  container: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  itemsList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: { background: '#fff', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  itemInfo: { flex: 1 },
  itemName: { margin: 0, fontSize: '1rem' },
  itemPrice: { color: '#888', fontSize: '0.85rem', margin: '4px 0 0' },
  qtyControls: { display: 'flex', alignItems: 'center', gap: '10px' },
  qtyBtn: { width: '30px', height: '30px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
  qty: { fontWeight: 'bold', minWidth: '20px', textAlign: 'center' },
  subtotal: { fontWeight: 'bold', minWidth: '80px', textAlign: 'right' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
  summary: { background: '#fff', padding: '1.5rem', borderRadius: '8px', minWidth: '250px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
  orderBtn: { width: '100%', padding: '12px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  btn: { padding: '10px 20px', background: '#e44d26', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  toast: { position: 'fixed', top: '20px', right: '20px', background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '4px', zIndex: 999 }
};