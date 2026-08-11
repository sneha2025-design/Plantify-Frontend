import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { paymentApi } from '../api/paymentApi';
import { jsPDF } from 'jspdf';
import {
  CreditCard, CheckCircle2, XCircle, MapPin, Info, Lock, ShieldCheck,
  Wallet, Banknote, Coins, ArrowRight, Download
} from 'lucide-react';
import { getUniqueProductImage, handleImageError } from '../utils/imageFallback';

export const CheckoutPage = () => {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '123 Botanical Avenue',
    city: 'Green Garden City',
    zip: '90210'
  });

  const [selectedMethod, setSelectedMethod] = useState('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const paymentOptions = [
    {
      id: 'RAZORPAY',
      title: 'Razorpay',
      description: 'Pay securely with UPI, cards, netbanking',
      icon: <CreditCard size={20} color="#047857" />,
      isRazorpay: true,
    },
    {
      id: 'UPI',
      title: 'UPI',
      description: 'Google Pay, PhonePe, Paytm & more',
      icon: <Wallet size={20} color="#b45309" />,
      isRazorpay: true,
    },
    {
      id: 'CARD',
      title: 'Credit Card',
      description: 'Visa, Mastercard, RuPay',
      icon: <CreditCard size={20} color="#2563eb" />,
      isRazorpay: true,
    },
    {
      id: 'COD',
      title: 'Cash On Delivery',
      description: 'Pay when your order arrives',
      icon: <Banknote size={20} color="#16a34a" />,
      isRazorpay: false,
    },
  ];

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) return;

    setLoading(true);
    try {
      const fullAddress = `${address.street}, ${address.city}, ${address.zip}`;

      // 1. CASH ON DELIVERY FLOW
      if (selectedMethod === 'COD') {
        const checkoutRes = await orderApi.checkout({
          shippingAddress: fullAddress,
          paymentMethod: 'COD'
        });

        if (!checkoutRes.success || !checkoutRes.data) {
          throw new Error(checkoutRes.message || 'Failed to place Cash on Delivery order');
        }

        await refreshCart();
        setOrderResult({
          ...checkoutRes.data,
          paymentMethod: 'COD',
          paymentStatus: 'UNPAID',
          status: 'PENDING'
        });
        setLoading(false);
        return;
      }

      // 2. RAZORPAY FLOW (Razorpay, UPI, Credit Card all open Razorpay Checkout popup)
      const checkoutRes = await orderApi.checkout({
        shippingAddress: fullAddress,
        paymentMethod: 'RAZORPAY'
      });

      if (!checkoutRes.success || !checkoutRes.data) {
        throw new Error(checkoutRes.message || 'Failed to create order');
      }
      const createdOrder = checkoutRes.data;

      const paymentOrderRes = await paymentApi.createPaymentOrder(createdOrder.orderId);
      if (!paymentOrderRes.success || !paymentOrderRes.data) {
        throw new Error(paymentOrderRes.message || 'Failed to create Razorpay payment session');
      }
      const payData = paymentOrderRes.data;

      const options = {
        key: payData.keyId,
        amount: payData.amount,
        currency: payData.currency,
        name: 'Plantify',
        description: `Order #${createdOrder.orderId}`,
        order_id: payData.razorpayOrderId,
        prefill: {
          name: user?.fullName || user?.username || '',
          email: user?.email || '',
          contact: user?.mobileNumber || '',
        },
        theme: { color: '#047857' },
        handler: async function (response) {
          try {
            const verifyRes = await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              internalOrderId: createdOrder.orderId,
            });
            await refreshCart();
            setOrderResult(verifyRes.data || { ...createdOrder, status: 'SUCCESS', paymentMethod: 'RAZORPAY', paymentStatus: 'PAID' });
          } catch (verifyErr) {
            setOrderResult({ ...createdOrder, status: 'FAILED' });
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              await paymentApi.cancelPayment(createdOrder.orderId);
            } catch (e) {}
            setOrderResult({ ...createdOrder, status: 'FAILED' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response) {
        try {
          await paymentApi.cancelPayment(createdOrder.orderId);
        } catch (e) {}
        setOrderResult({ ...createdOrder, status: 'FAILED' });
      });

      rzp.open();
      setLoading(false);
      return;
    } catch (err) {
      console.error('[Checkout Error]:', err);
      alert(err.message || 'Error processing checkout');
      setLoading(false);
    }
  };

  if (orderResult) {
    const isCod = orderResult.paymentMethod === 'COD';
    const isSuccess = orderResult.status === 'SUCCESS' || isCod;

    const productNamesList = orderResult.items && orderResult.items.length > 0
      ? orderResult.items.map(item => item.productName || item.product?.name || item.name).filter(Boolean).join(', ')
      : (cart.items && cart.items.length > 0
          ? cart.items.map(item => item.product?.name || item.productName || item.name).filter(Boolean).join(', ')
          : 'Plant Purchase');

    const handleDownloadReceipt = () => {
      try {
        const doc = new jsPDF();

        // Header Banner (Emerald #047857)
        doc.setFillColor(4, 120, 87);
        doc.rect(0, 0, 210, 26, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('PLANTIFY - OFFICIAL ORDER RECEIPT', 14, 17);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Status: ${isSuccess ? 'CONFIRMED' : 'FAILED'}`, 150, 17);

        // Order Summary
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ORDER SUMMARY', 14, 38);

        doc.setLineWidth(0.4);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, 41, 196, 41);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        let y = 49;

        doc.text(`Order Reference: #${orderResult.orderId}`, 14, y); y += 7;
        doc.text(`Date & Time: ${new Date().toLocaleString()}`, 14, y); y += 7;
        doc.text(`Customer Name: ${user?.fullName || user?.username || 'Valued Customer'} (${user?.email || 'N/A'})`, 14, y); y += 7;
        doc.text(`Shipping Address: ${orderResult.shippingAddress || 'N/A'}`, 14, y); y += 7;
        doc.text(`Payment Method: ${isCod ? 'Cash on Delivery (COD)' : 'Razorpay'}`, 14, y); y += 7;
        doc.text(`Payment Status: ${orderResult.paymentStatus === 'PAID' ? 'PAID' : (isCod ? 'UNPAID (Pending Delivery)' : 'PENDING')}`, 14, y); y += 10;

        // Products Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('PRODUCTS PURCHASED', 14, y); y += 3;
        doc.line(14, y, 196, y); y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        const itemsArr = orderResult.items && orderResult.items.length > 0
          ? orderResult.items
          : (cart.items && cart.items.length > 0 ? cart.items : []);

        if (itemsArr.length > 0) {
          itemsArr.forEach((item, index) => {
            const pName = item.productName || item.product?.name || item.name || `Product #${index + 1}`;
            const qty = item.quantity || 1;
            const priceStr = item.price ? ` - ₹${Number(item.price * qty).toFixed(2)}` : '';
            doc.text(`${index + 1}. ${pName} (Qty: ${qty})${priceStr}`, 18, y);
            y += 7;
          });
        } else {
          doc.text(`• ${productNamesList}`, 18, y);
          y += 7;
        }

        y += 4;
        doc.line(14, y, 196, y); y += 9;

        // Grand Total
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(4, 120, 87);
        doc.text(`Grand Total Amount: ₹${Number(orderResult.totalAmount).toFixed(2)}`, 14, y); y += 15;

        // Footer Note
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for shopping with Plantify! Grow Better. Live Better.', 14, y);

        // Download actual .pdf file
        doc.save(`Plantify_Receipt_${orderResult.orderId}.pdf`);
      } catch (err) {
        console.error('Error generating PDF receipt:', err);
        alert('Failed to generate PDF receipt. Please try again.');
      }
    };

    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
          {isSuccess ? (
            <CheckCircle2 size={64} style={{ color: 'var(--color-emerald-600)', marginBottom: '1rem' }} />
          ) : (
            <XCircle size={64} style={{ color: 'var(--color-rose-600)', marginBottom: '1rem' }} />
          )}

          <h2 className="font-heading" style={{ fontSize: '2rem', color: 'var(--color-emerald-950)', marginBottom: '0.6rem' }}>
            {isCod ? 'Order Placed Successfully!' : (isSuccess ? 'Payment Successful!' : 'Order Processing Failed')}
          </h2>

          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {isCod
              ? `Order #${orderResult.orderId} placed via Cash on Delivery. Pay ₹${Number(orderResult.totalAmount).toFixed(2)} in cash when your order arrives.`
              : isSuccess
              ? `Thank you for your purchase! Order #${orderResult.orderId} has been confirmed via Razorpay.`
              : `Order #${orderResult.orderId} could not be completed.`}
          </p>

          <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'left', marginBottom: '2rem', fontSize: '0.9rem' }}>
            <div style={{ marginBottom: '0.4rem' }}><strong>Order Reference:</strong> {orderResult.orderId}</div>
            <div style={{ marginBottom: '0.4rem' }}><strong>Shipping Address:</strong> {orderResult.shippingAddress}</div>
            <div style={{ marginBottom: '0.4rem' }}><strong>Payment Method:</strong> {isCod ? 'Cash on Delivery (COD)' : 'Razorpay'}</div>
            <div style={{ marginBottom: '0.4rem' }}>
              <strong>Payment Status:</strong>{' '}
              <span className={`badge ${orderResult.paymentStatus === 'PAID' ? 'badge-emerald' : 'badge-amber'}`}>
                {orderResult.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID (Pending Delivery)'}
              </span>
            </div>
            <div style={{ marginBottom: '0.4rem' }}><strong>Total Amount:</strong> ₹{Number(orderResult.totalAmount).toFixed(2)}</div>
            <div style={{ marginBottom: '0.4rem' }}><strong>Items Ordered:</strong> {orderResult.items?.length || cart.items?.length || 1} products</div>
            <div><strong>Product(s):</strong> <span style={{ fontWeight: 600, color: 'var(--color-emerald-950)' }}>{productNamesList}</span></div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/orders')} className="btn btn-primary">
              View Order History
            </button>
            <button onClick={() => navigate('/shop')} className="btn btn-secondary">
              Continue Shopping
            </button>
            <button onClick={handleDownloadReceipt} className="btn btn-secondary">
              <Download size={16} /> Download Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentRazorpay = selectedMethod !== 'COD';

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Secure Botanical Checkout</span>
        <h1 className="font-heading" style={{ fontSize: '2.5rem', color: 'var(--color-emerald-950)' }}>
          Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        
        {/* Left Column: Shipping Address & Payment Method Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Shipping Address Section */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', marginBottom: '1.2rem', color: 'var(--color-emerald-950)' }} className="font-heading">
              <MapPin size={20} style={{ color: 'var(--color-emerald-700)' }} /> Shipping Address
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>Zip / Postal Code</label>
                <input
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector Section (Matching Reference Style) */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', color: 'var(--color-emerald-950)' }} className="font-heading">
                <CreditCard size={20} style={{ color: 'var(--color-emerald-700)' }} /> Payment Method
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-emerald-700)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                <Lock size={12} /> 256-bit SSL Encrypted
              </span>
            </div>

            {/* Radio-Group Stacked Option Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {paymentOptions.map((option) => {
                const isSelected = selectedMethod === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setSelectedMethod(option.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1.1rem 1.2rem',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #047857' : '1px solid #e5e7eb',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      boxShadow: isSelected ? '0 4px 12px rgba(4, 120, 87, 0.08)' : '0 1px 3px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: isSelected ? '#d1fae5' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {option.icon}
                      </div>

                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: isSelected ? '#047857' : '#111827' }}>
                          {option.title}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>
                          {option.description}
                        </div>
                      </div>
                    </div>

                    {/* Right Checkmark Circle for Selected Option */}
                    {isSelected && (
                      <div style={{ color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={20} fill="#047857" color="#ffffff" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Test Mode Warning Box for Razorpay/UPI/Card */}
            {isCurrentRazorpay && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.8rem 1rem',
                background: '#fef3c7',
                color: '#92400e',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginTop: '1.2rem'
              }}>
                <Info size={18} style={{ flexShrink: 0 }} />
                <span>Test Mode — no real payment will be charged</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Review & Dynamic Submit Button */}
        <div>
          <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '96px' }}>
            <h3 className="font-heading" style={{ fontSize: '1.25rem', color: 'var(--color-emerald-950)', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)' }}>
              Order Summary ({cart.totalItems} items)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img
                      src={getUniqueProductImage(item)}
                      alt={item.productName}
                      onError={(e) => handleImageError(e, item)}
                      style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-emerald-950)' }}>{item.productName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>₹{Number(item.totalPrice).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Subtotal</span>
                <span>₹{Number(cart.grandTotal).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>Standard Delivery</span>
                <span style={{ color: 'var(--color-emerald-600)', fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-emerald-950)', paddingTop: '0.6rem' }}>
                <span>Total</span>
                <span>₹{Number(cart.grandTotal).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || cart.items.length === 0}
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 800, background: '#047857' }}
            >
              {loading
                ? (selectedMethod === 'COD' ? 'Placing Order...' : 'Initializing Razorpay...')
                : selectedMethod === 'COD'
                ? `Place Order — Cash on Delivery (₹${Number(cart.grandTotal).toFixed(2)})`
                : `Pay Now with Razorpay (₹${Number(cart.grandTotal).toFixed(2)})`
              }
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
              {selectedMethod === 'COD'
                ? '💵 Pay in cash upon delivery'
                : '🔒 Secured by Razorpay Test Gateway'}
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};
