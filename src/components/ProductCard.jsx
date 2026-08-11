import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingBag, Eye, Check, Star, Heart } from 'lucide-react';
import { handleImageError, getUniqueProductImage } from '../utils/imageFallback';

export const ProductCard = ({ product, onQuickView, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const productId = product.productId || product.id;
  const isWishlisted = isInWishlist(productId);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    await toggleWishlist(productId);
  };

  const mainImage = getUniqueProductImage(product);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setLoading(true);
    const res = await addToCart(product.productId || product.id, 1);
    setLoading(false);
    if (res.success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } else if (res.message) {
      alert(res.message);
    }
  };

  const isOutOfStock = product.stock === 0;

  // Use persistent rating & review count from backend Product entity / DTO
  const rating = product.rating ? Number(product.rating).toFixed(1) : '4.5';
  const reviewCount = product.reviewCount ? product.reviewCount : 42;

  const getSubtitle = () => {
    const cat = (product.categoryName || '').toUpperCase();
    if (cat.includes('PLANT')) return 'Live plant • Indoor';
    if (cat.includes('POT')) return 'Premium ceramic pot';
    if (cat.includes('SOIL')) return 'Nutrient rich soil';
    if (cat.includes('FERTILISER')) return 'Balanced plant elixir';
    if (cat.includes('SEED')) return 'Premium quality seeds';
    if (cat.includes('TOOL')) return 'Ergonomic garden tool';
    if (cat.includes('WATER')) return 'Root hydration solution';
    if (cat.includes('PEST')) return 'Natural plant protection';
    return 'Botanical care essential';
  };

  if (viewMode === 'list') {
    return (
      <div
        className="glass-card animate-fade-in"
        style={{
          display: 'flex',
          gap: '1.2rem',
          padding: '1rem',
          alignItems: 'center',
          cursor: 'pointer',
          borderRadius: '12px'
        }}
        onClick={() => onQuickView && onQuickView(product)}
      >
        <div style={{ position: 'relative', width: '120px', height: '100px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6' }}>
          <img
            src={mainImage}
            alt={product.name}
            onError={(e) => handleImageError(e, product)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <span style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '0.6rem', fontWeight: 700, background: 'rgba(255, 255, 255, 0.9)', padding: '2px 6px', borderRadius: '4px', color: '#047857' }}>
            {(product.categoryName || 'GENERAL').toUpperCase()}
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <h3 className="font-heading" style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{product.name}</h3>
          <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>{product.description || getSubtitle()}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.78rem', marginTop: '0.2rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(rating) ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.78rem', marginLeft: '4px' }}>{rating}</span>
            <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>({reviewCount})</span>
          </div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#047857' }}>
            ₹{Number(product.price).toFixed(2)}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || loading}
            className="btn btn-primary"
            style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem', borderRadius: '6px', background: '#047857', whiteSpace: 'nowrap' }}
          >
            {added ? <Check size={13} /> : <ShoppingBag size={13} />}
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        height: '100%',
        cursor: 'pointer',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        background: '#ffffff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
      }}
      onClick={() => onQuickView && onQuickView(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div style={{ position: 'relative', paddingTop: '85%', overflow: 'hidden', background: '#f1f5f9' }}>
        <img
          src={mainImage || 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          onError={(e) => handleImageError(e, product)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />

        {/* Top-left category badge */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', zIndex: 10 }}>
          <span style={{
            fontSize: '0.6rem',
            fontWeight: 800,
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            color: '#047857',
            padding: '2px 7px',
            borderRadius: '4px',
            letterSpacing: '0.04em'
          }}>
            {(product.categoryName || 'PLANTS').toUpperCase()}
          </span>
        </div>

        {/* Top-right Wishlist Heart Icon */}
        <button
          onClick={handleToggleWishlist}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isWishlisted ? '#e11d48' : '#6b7280',
            border: 'none',
            cursor: 'pointer'
          }}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={14} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : '#6b7280'} />
        </button>

        {/* Compact Quick View Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onQuickView && onQuickView(product); }}
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '0.25rem 0.7rem',
            fontSize: '0.72rem',
            fontWeight: 600,
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            color: '#111827',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: 'none',
            zIndex: 10,
            opacity: isHovered ? 1 : 0.88,
            transition: 'all 0.2s ease'
          }}
        >
          <Eye size={12} /> Quick View
        </button>
      </div>

      {/* Product Body */}
      <div style={{ padding: '0.9rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between', background: '#ffffff' }}>
        <div>
          <h3 className="font-heading" style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827', marginBottom: '0.2rem', lineHeight: '1.25' }}>
            {product.name}
          </h3>
          <p style={{
            fontSize: '0.75rem',
            color: '#6b7280',
            marginBottom: '0.4rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.3'
          }} title={product.description}>
            {product.description || getSubtitle()}
          </p>

          {/* Star rating & review count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < Math.floor(rating) ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.75rem', marginLeft: '3px', color: '#111827' }}>{rating}</span>
            <span style={{ color: '#6b7280', fontSize: '0.72rem' }}>({reviewCount})</span>
          </div>
        </div>

        {/* Price & Add to Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid #f3f4f6', gap: '0.4rem' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#047857', whiteSpace: 'nowrap' }}>
            ₹{Number(product.price).toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || loading}
            style={{
              padding: '0.38rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              borderRadius: '6px',
              background: '#047857',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {added ? <Check size={13} /> : <ShoppingBag size={13} />}
            {added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
