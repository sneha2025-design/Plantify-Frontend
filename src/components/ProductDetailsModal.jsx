import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { X, Plus, Minus, ShoppingBag, Check, ShieldCheck, Truck, Heart } from 'lucide-react';
import { handleImageError, getUniqueProductImage } from '../utils/imageFallback';

export const ProductDetailsModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!product) return null;

  const productId = product.productId || product.id;
  const isWishlisted = isInWishlist(productId);

  const uniqueImage = getUniqueProductImage(product);
  const images = [uniqueImage];

  const handleAddToCart = async () => {
    const res = await addToCart(productId, quantity);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else if (res.message) {
      alert(res.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem'
    }} onClick={onClose}>
      
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          background: 'var(--bg-surface)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-primary)',
            borderRadius: '50%',
            padding: '0.5rem',
            color: 'var(--text-main)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Gallery */}
          <div>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '340px', background: 'var(--color-emerald-50)', marginBottom: '1rem' }}>
              <img
                src={images[activeImgIndex]}
                alt={product.name}
                onError={(e) => handleImageError(e, product.categoryName)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImgIndex === idx ? '2px solid var(--color-emerald-600)' : '1px solid var(--border-light)'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.8rem' }}>{product.categoryName}</span>
              <h2 className="font-heading" style={{ fontSize: '1.8rem', color: 'var(--color-emerald-950)', marginBottom: '0.6rem' }}>
                {product.name}
              </h2>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-emerald-900)', marginBottom: '1rem' }}>
                ₹{Number(product.price).toFixed(2)}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {product.description}
              </p>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div><strong>Stock Availability:</strong> {product.stock > 0 ? `${product.stock} available in stock` : 'Out of stock'}</div>
                <div><strong>Category:</strong> {product.categoryName}</div>
              </div>
            </div>

            <div>
              {/* Quantity Picker & Add Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '0.6rem 0.8rem', color: 'var(--text-main)' }}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0 0.8rem', fontWeight: 700, fontSize: '1rem' }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{ padding: '0.6rem 0.8rem', color: 'var(--text-main)' }}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`btn ${added ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1, padding: '0.8rem 1.5rem' }}
                >
                  {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                  {added ? 'Added to Cart!' : `Add ${quantity} to Cart`}
                </button>

                <button
                  onClick={() => toggleWishlist(productId)}
                  style={{
                    padding: '0.8rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: isWishlisted ? '#ffe4e6' : 'var(--bg-primary)',
                    color: isWishlisted ? '#e11d48' : 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={20} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
                </button>
              </div>

              {/* Guarantees */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={16} style={{ color: 'var(--color-emerald-600)' }} /> Healthy Plant Guarantee
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--color-emerald-600)' }} /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
