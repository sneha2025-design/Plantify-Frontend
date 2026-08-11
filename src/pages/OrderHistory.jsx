import React, { useEffect, useState } from 'react';
import { orderApi } from '../api/orderApi';
import { Package, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, MapPin, Ban } from 'lucide-react';
import { getUniqueProductImage, handleImageError } from '../utils/imageFallback';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const fetchOrders = () => {
    orderApi.getUserOrders()
      .then((res) => {
        if (res.success && res.data) {
          setOrders(res.data);
        }
      })
      .catch((err) => console.error('Failed to fetch orders:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (e, orderId) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to cancel order #${orderId}?`)) {
      return;
    }

    try {
      const res = await orderApi.cancelOrder(orderId);
      if (res.success) {
        setToastMessage(`Order #${orderId} was cancelled successfully and stock was restored.`);
        setTimeout(() => setToastMessage(''), 4000);
        fetchOrders();
      } else {
        alert(res.message || 'Failed to cancel order');
      }
    } catch (err) {
      alert(err.message || 'Error cancelling order');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return <span className="badge badge-emerald"><CheckCircle2 size={12} style={{ marginRight: '4px' }} /> SUCCESS</span>;
      case 'FAILED':
        return <span className="badge badge-rose"><XCircle size={12} style={{ marginRight: '4px' }} /> FAILED</span>;
      case 'CANCELLED':
        return <span className="badge badge-rose" style={{ background: '#ffe4e6', color: '#be123c' }}><Ban size={12} style={{ marginRight: '4px' }} /> CANCELLED</span>;
      default:
        return <span className="badge badge-amber"><Clock size={12} style={{ marginRight: '4px' }} /> PENDING</span>;
    }
  };

  const getPaymentBadge = (order) => {
    const isCod = order.paymentMethod === 'COD';
    const isPaid = order.paymentStatus === 'PAID';

    if (isCod) {
      if (isPaid) {
        return <span className="badge badge-emerald" style={{ background: '#ecfccb', color: '#3f6212', border: '1px solid #bef264' }}>Cash on Delivery — Paid</span>;
      }
      return <span className="badge badge-amber" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>Cash on Delivery — Payment Pending</span>;
    }

    if (isPaid || order.status === 'SUCCESS') {
      return <span className="badge badge-emerald" style={{ background: '#d1fae5', color: '#047857', border: '1px solid #a7f3d0' }}>Paid via Razorpay</span>;
    }

    return <span className="badge badge-amber">Payment Pending</span>;
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      
      {toastMessage && (
        <div style={{ padding: '1rem 1.5rem', background: 'var(--color-emerald-100)', color: 'var(--color-emerald-950)', borderRadius: 'var(--radius-md)', fontWeight: 700, marginBottom: '1.5rem', border: '1px solid var(--color-emerald-500)' }}>
          {toastMessage}
        </div>
      )}

      <h1 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--color-emerald-950)', marginBottom: '0.5rem' }}>
        My Order History
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Track, review, and manage all your past plant purchases.</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading your order history...</div>
      ) : orders.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '550px', margin: '0 auto' }}>
          <Package size={56} style={{ color: 'var(--color-emerald-700)', opacity: 0.3, marginBottom: '1rem' }} />
          <h3 className="font-heading" style={{ fontSize: '1.5rem', color: 'var(--color-emerald-950)', marginBottom: '0.5rem' }}>
            No Orders Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            You haven't placed any orders yet. Once you place an order, it will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.orderId;
            const canCancel = order.status === 'PENDING' || order.status === 'SUCCESS';

            return (
              <div key={order.orderId} className="glass-card" style={{ padding: '1.8rem' }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }}
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.orderId)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-emerald-950)' }}>
                        Order #{order.orderId}
                      </h3>
                      {getStatusBadge(order.status)}
                      {getPaymentBadge(order)}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Placed on: {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {canCancel && (
                      <button
                        onClick={(e) => handleCancelOrder(e, order.orderId)}
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                      >
                        <Ban size={14} /> Cancel Order
                      </button>
                    )}

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grand Total</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-emerald-900)' }}>
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </div>
                    </div>
                    <button style={{ color: 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div style={{ marginTop: '1rem', padding: '0.8rem 1rem', background: 'var(--color-emerald-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-emerald-100)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.88rem' }}>
                  <MapPin size={18} style={{ color: 'var(--color-emerald-800)', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: 'var(--color-emerald-950)' }}>Shipping Address: </strong>
                    <span style={{ color: 'var(--text-main)' }}>{order.shippingAddress || '123 Botanical Avenue, Green Garden City, CA 90210'}</span>
                  </div>
                </div>

                {/* Expanded Item Breakdown */}
                {isExpanded && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border-light)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-emerald-950)' }}>
                      Itemized Breakdown ({order.items?.length} items)
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {order.items?.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                              src={getUniqueProductImage(item)}
                              alt={item.productName}
                              onError={(e) => handleImageError(e, item)}
                              style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-emerald-950)' }}>{item.productName}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                ₹{Number(item.pricePerUnit).toFixed(2)} × {item.quantity}
                              </div>
                            </div>
                          </div>

                          <div style={{ fontWeight: 800, color: 'var(--color-emerald-900)' }}>
                            ₹{Number(item.totalPrice).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
