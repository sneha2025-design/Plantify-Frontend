import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const WishlistPage = () => {
  const { wishlist, loading } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', minHeight: '75vh' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#ffe4e6', color: '#e11d48', padding: '0.7rem', borderRadius: '50%', display: 'flex' }}>
            <Heart size={26} fill="#e11d48" />
          </div>
          <div>
            <h1 className="font-heading" style={{ fontSize: '2.2rem', color: '#111827' }}>My Saved Wishlist</h1>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Plants and botanical supplies you have bookmarked for later</p>
          </div>
        </div>

        <Link to="/shop" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>

      {!isAuthenticated ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', background: '#ffffff', borderRadius: '16px' }}>
          <Heart size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 className="font-heading" style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '0.5rem' }}>Log in to view your wishlist</h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Sign in to access your saved botanical favorites across all devices.</p>
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: '#047857' }}>
            Log In Now
          </Link>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading your wishlist items...</div>
      ) : wishlist.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', background: '#ffffff', borderRadius: '16px' }}>
          <Heart size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
          <h3 className="font-heading" style={{ fontSize: '1.4rem', color: '#111827', marginBottom: '0.5rem' }}>Your wishlist is empty — start adding products you love</h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Tap the heart icon on any product card in our shop catalog to save your favorites!</p>
          <Link to="/shop" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: '#047857' }}>
            Explore Shop Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {wishlist.map((prod) => (
            <ProductCard key={prod.productId} product={prod} onQuickView={setSelectedProduct} />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};
