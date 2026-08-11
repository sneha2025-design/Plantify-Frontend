import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { ShoppingBag, CheckCircle2, XCircle, Clock, DollarSign } from 'lucide-react';

export const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    adminApi.getAllOrders()
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
      })
      .catch((err) => console.error('Failed to load admin orders:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkAsPaid = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      const res = await adminApi.markOrderAsPaid(orderId);
      if (res.success && res.data) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.orderId === orderId ? { ...o, paymentStatus: 'PAID' } : o
          )
        );
      } else {
        alert(res.message || 'Failed to mark order as paid');
      }
    } catch (err) {
      alert(err.message || 'Error marking order as paid');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} style={{ marginRight: '4px' }} /> SUCCESS</span>;
      case 'FAILED':
        return <span className="badge badge-rose"><XCircle size={12} style={{ marginRight: '4px' }} /> FAILED</span>;
      case 'CANCELLED':
        return <span className="badge badge-rose" style={{ background: '#ffe4e6', color: '#be123c' }}>CANCELLED</span>;
      default:
        return <span className="badge badge-amber"><Clock size={12} style={{ marginRight: '4px' }} /> PENDING</span>;
    }
  };

  const getPaymentBadge = (order) => {
    const isCod = order.paymentMethod === 'COD';
    const isPaid = order.paymentStatus === 'PAID';

    if (isCod) {
      if (isPaid) {
        return <span className="badge badge-emerald" style={{ background: '#ecfccb', color: '#3f6212' }}>COD — Paid</span>;
      }
      return <span className="badge badge-amber" style={{ background: '#fef3c7', color: '#92400e' }}>COD — Payment Pending</span>;
    }

    return <span className="badge badge-emerald" style={{ background: '#d1fae5', color: '#047857' }}>Paid via Razorpay</span>;
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.4rem' }}>Sales Oversight</span>
        <h1 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--color-emerald-950)' }}>Customer Order Directory</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading all customer orders...</div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>No customer orders found in system history.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ paddingBottom: '1rem' }}>Order Ref</th>
                <th style={{ paddingBottom: '1rem' }}>Customer</th>
                <th style={{ paddingBottom: '1rem' }}>Total Amount</th>
                <th style={{ paddingBottom: '1rem' }}>Order Status</th>
                <th style={{ paddingBottom: '1rem' }}>Payment Info</th>
                <th style={{ paddingBottom: '1rem' }}>Date Placed</th>
                <th style={{ paddingBottom: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const canMarkPaid = o.paymentMethod === 'COD' && o.paymentStatus === 'UNPAID' && o.status !== 'CANCELLED';

                return (
                  <tr key={o.orderId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 800, color: 'var(--color-emerald-950)' }}>{o.orderId}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{o.userFullName || 'Customer'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.userEmail}</div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--color-emerald-900)' }}>₹{Number(o.totalAmount).toFixed(2)}</td>
                    <td>{getStatusBadge(o.status)}</td>
                    <td>{getPaymentBadge(o)}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(o.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {canMarkPaid ? (
                        <button
                          onClick={() => handleMarkAsPaid(o.orderId)}
                          disabled={actionLoadingId === o.orderId}
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem', background: '#047857' }}
                        >
                          <DollarSign size={13} style={{ marginRight: '4px' }} />
                          {actionLoadingId === o.orderId ? 'Updating...' : 'Mark as Paid'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
