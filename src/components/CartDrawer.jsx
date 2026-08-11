import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { getUniqueProductImage, handleImageError } from '../utils/imageFallback';

export const CartDrawer = () => {
  const { cart, isDrawerOpen, setIsDrawerOpen, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 110,
      display: 'flex',
      justifyContent: 'flex-end'
    }} onClick={() => setIsDrawerOpen(false)}>
      
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          borderRadius: 0,
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} style={{ color: 'var(--color-emerald-700)' }} />
            <h3 className="font-heading" style={{ fontSize: '1.2rem', color: 'var(--color-emerald-950)' }}>Your Shopping Cart</h3>
            <span className="badge badge-emerald">{cart.totalItems}</span>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {cart.items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.88rem' }}>Explore our botanical collection and pick your favorite green companions!</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '1rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--border-light)' }}>
                <img
                  src={getUniqueProductImage(item)}
                  alt={item.productName}
                  onError={(e) => handleImageError(e, item)}
                  style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--color-emerald-50)' }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-emerald-950)' }}>{item.productName}</h4>
                    <button onClick={() => removeFromCart(item.productId)} style={{ color: 'var(--text-muted)' }} title="Remove">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ₹{Number(item.productPrice).toFixed(2)} each
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        style={{ padding: '2px 8px', color: 'var(--text-main)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: 700 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{ padding: '2px 8px', color: 'var(--text-main)' }}
                        disabled={item.quantity >= item.availableStock}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-emerald-900)' }}>
                      ₹{Number(item.totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.items.length > 0 && (
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span>Subtotal</span>
              <span>₹{Number(cart.grandTotal).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-emerald-950)' }}>
              <span>Grand Total</span>
              <span>₹{Number(cart.grandTotal).toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
