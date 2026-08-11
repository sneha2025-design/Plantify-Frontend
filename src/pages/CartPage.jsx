import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { getUniqueProductImage, handleImageError } from '../utils/imageFallback';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem' }}>
          <ShoppingBag size={56} style={{ color: 'var(--color-emerald-700)', marginBottom: '1.2rem', opacity: 0.4 }} />
          <h2 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--color-emerald-950)', marginBottom: '0.6rem' }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            You have no green companions in your cart yet. Explore our catalog to start building your indoor garden!
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>
            Explore Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 className="font-heading" style={{ fontSize: '2.4rem', color: 'var(--color-emerald-950)', marginBottom: '2rem' }}>
        Shopping Cart Summary
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Cart Items Table */}
        <div style={{ flex: 1 }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <th style={{ paddingBottom: '1rem' }}>Product</th>
                  <th style={{ paddingBottom: '1rem' }}>Price</th>
                  <th style={{ paddingBottom: '1rem' }}>Quantity</th>
                  <th style={{ paddingBottom: '1rem' }}>Total</th>
                  <th style={{ paddingBottom: '1rem' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={getUniqueProductImage(item)}
                        alt={item.productName}
                        onError={(e) => handleImageError(e, item)}
                        style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', background: 'var(--color-emerald-50)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--color-emerald-950)' }}>{item.productName}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>In Stock ({item.availableStock})</div>
                      </div>
                    </td>

                    <td style={{ fontWeight: 600 }}>${Number(item.productPrice).toFixed(2)}</td>

                    <td>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)' }}>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-main)' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.9rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-main)' }}
                          disabled={item.quantity >= item.availableStock}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>

                    <td style={{ fontWeight: 800, color: 'var(--color-emerald-900)' }}>
                      ${Number(item.totalPrice).toFixed(2)}
                    </td>

                    <td>
                      <button onClick={() => removeFromCart(item.productId)} style={{ color: 'var(--text-muted)' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grand Total Card */}
        <div style={{ maxWidth: '380px' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 className="font-heading" style={{ fontSize: '1.3rem', color: 'var(--color-emerald-950)', marginBottom: '1.2rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)' }}>
              Order Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Total Items</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{cart.totalItems}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Standard Delivery</span>
                <span style={{ fontWeight: 700, color: 'var(--color-emerald-600)' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid var(--border-light)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-emerald-950)' }}>
                <span>Grand Total</span>
                <span>${Number(cart.grandTotal).toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
