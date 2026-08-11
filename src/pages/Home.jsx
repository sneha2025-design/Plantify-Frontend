import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import {
  ArrowRight, Leaf, Shield, Truck, Sparkles, Award, Headphones, CreditCard, RefreshCw, CheckCircle2,
  Sprout, Flower2, Layers, Droplet, Wheat, Wrench, Droplets, ShieldAlert, Sun, Tag,
  Instagram, Facebook, Youtube, Send, Heart, ChevronLeft, ChevronRight, Users
} from 'lucide-react';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Exact category theme & image map for 9 categories
  const categoryThemeMap = {
    'Plants': { bg: '#eefcf4', color: '#047857', icon: <Sprout size={32} color="#047857" />, img: 'https://i.pinimg.com/1200x/d1/98/3f/d1983fa2068757008462591bbdac9bf5.jpg' },
    'Pots': { bg: '#fff7ed', color: '#c2410c', icon: <Flower2 size={32} color="#c2410c" />, img: 'https://i.pinimg.com/736x/36/41/7d/36417d0b44eba4f3bc40a0f19d9bdc75.jpg' },
    'Soils': { bg: '#fefce8', color: '#92400e', icon: <Layers size={32} color="#92400e" />, img: 'https://i.pinimg.com/736x/c9/ee/58/c9ee582eea5e0744c5705e7966f04e46.jpg' },
    'Fertilisers': { bg: '#f0f9ff', color: '#0369a1', icon: <Droplet size={32} color="#0369a1" />, img: 'https://i.pinimg.com/736x/f6/c9/42/f6c942c5212d2983f8e972023f6d35e5.jpg' },
    'Seeds': { bg: '#fefce8', color: '#a16207', icon: <Wheat size={32} color="#a16207" />, img: 'https://i.pinimg.com/736x/fd/05/39/fd05397b789e4e70745cd160a878b38c.jpg' },
    'Garden Tools': { bg: '#f8fafc', color: '#475569', icon: <Wrench size={32} color="#475569" />, img: 'https://wonderlandgarden.in/cdn/shop/files/IMG_7545_512x342.jpg?v=1742905890' },
    'Watering Solutions': { bg: '#f0f9ff', color: '#0284c7', icon: <Droplets size={32} color="#0284c7" />, img: 'https://i.pinimg.com/1200x/96/7f/06/967f06768d5422b6c16f5f56210c9a3b.jpg' },
    'Pest Control': { bg: '#f7fee7', color: '#4d7c0f', icon: <ShieldAlert size={32} color="#4d7c0f" />, img: 'https://i.pinimg.com/736x/7c/22/27/7c222713f692167ed55cb05677bfa338.jpg' },
    'Gardening Decor': { bg: '#f1f5f9', color: '#334155', icon: <Sun size={32} color="#334155" />, img: 'https://i.pinimg.com/1200x/df/1c/7b/df1c7bd95f5bad19080986f75e411f58.jpg' }
  };

  const defaultCategories = [
    { categoryId: 1, categoryName: 'Plants', categoryImageUrl: 'https://i.pinimg.com/1200x/d1/98/3f/d1983fa2068757008462591bbdac9bf5.jpg' },
    { categoryId: 2, categoryName: 'Pots', categoryImageUrl: 'https://i.pinimg.com/736x/36/41/7d/36417d0b44eba4f3bc40a0f19d9bdc75.jpg' },
    { categoryId: 3, categoryName: 'Soils', categoryImageUrl: 'https://i.pinimg.com/736x/c9/ee/58/c9ee582eea5e0744c5705e7966f04e46.jpg' },
    { categoryId: 4, categoryName: 'Fertilisers', categoryImageUrl: 'https://i.pinimg.com/736x/f6/c9/42/f6c942c5212d2983f8e972023f6d35e5.jpg' },
    { categoryId: 5, categoryName: 'Seeds', categoryImageUrl: 'https://i.pinimg.com/736x/fd/05/39/fd05397b789e4e70745cd160a878b38c.jpg' },
    { categoryId: 6, categoryName: 'Garden Tools', categoryImageUrl: 'https://wonderlandgarden.in/cdn/shop/files/IMG_7545_512x342.jpg?v=1742905890' },
    { categoryId: 7, categoryName: 'Watering Solutions', categoryImageUrl: 'https://i.pinimg.com/1200x/96/7f/06/967f06768d5422b6c16f5f56210c9a3b.jpg' },
    { categoryId: 8, categoryName: 'Pest Control', categoryImageUrl: 'https://i.pinimg.com/736x/7c/22/27/7c222713f692167ed55cb05677bfa338.jpg' },
    { categoryId: 9, categoryName: 'Gardening Decor', categoryImageUrl: 'https://i.pinimg.com/1200x/df/1c/7b/df1c7bd95f5bad19080986f75e411f58.jpg' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, catRes] = await Promise.all([
          productApi.getFeaturedProducts(),
          productApi.getCategories()
        ]);

        if (featuredRes.success && featuredRes.data && featuredRes.data.length > 0) {
          setFeaturedProducts(featuredRes.data);
        } else {
          // Fallback to normal getProducts if no featured products marked
          const fallbackRes = await productApi.getProducts({ size: 10 });
          if (fallbackRes.success && fallbackRes.data) {
            setFeaturedProducts(fallbackRes.data.content || fallbackRes.data);
          }
        }

        if (catRes.success && catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        } else {
          setCategories(defaultCategories);
        }
      } catch (err) {
        console.error('Failed to fetch home page telemetry:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (emailSub) {
      setSubscribed(true);
      setEmailSub('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '0', background: '#fcfdfd' }}>
      
      {/* 2. Hero Banner Section (Exact Match to Image 1) */}
      <section className="container" style={{ paddingTop: '1.5rem' }}>
        <div style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #022c22 0%, #064e3b 65%, #047857 100%)',
          color: 'white',
          padding: '3.5rem 3.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
          boxShadow: '0 12px 36px rgba(4, 120, 87, 0.12)'
        }}>
          {/* Left Hero Content */}
          <div style={{ zIndex: 5 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1.2rem',
              color: '#ffffff'
            }}>
              <Leaf size={14} style={{ color: '#34d399' }} /> Fresh • Green • Beautiful
            </div>
            
            <h1 className="font-heading" style={{ fontSize: '3.2rem', lineHeight: '1.15', marginBottom: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
              Bring Nature Home & Let It Thrive 🌿
            </h1>
            
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', marginBottom: '2.2rem', lineHeight: '1.6', maxWidth: '500px' }}>
              Explore a wide range of healthy plants, premium pots, organic soils, and gardening essentials.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn" style={{ padding: '0.85rem 2rem', fontSize: '0.92rem', background: '#047857', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/shop" className="btn" style={{ padding: '0.85rem 2rem', fontSize: '0.92rem', background: 'transparent', color: 'white', border: '1.5px solid rgba(255, 255, 255, 0.5)', borderRadius: '8px', fontWeight: 700 }}>
                Explore Collection
              </Link>
            </div>
          </div>

          {/* Right Hero Image & Overlapping Special Offer Card */}
          <div style={{ position: 'relative', height: '330px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <img
                src="https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=900&q=80"
                alt="Plantify Potted Plants"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Floating Overlapping Special Offer Card */}
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              right: '-10px',
              background: '#ffffff',
              color: '#111827',
              padding: '0.9rem 1.1rem',
              borderRadius: '14px',
              boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
              border: '1px solid #f3f4f6',
              maxWidth: '240px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem'
            }}>
              <div style={{ background: '#ecfccb', color: '#4d7c0f', padding: '0.45rem', borderRadius: '8px', flexShrink: 0 }}>
                <Tag size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Special Offer
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, margin: '2px 0', color: '#111827' }}>
                  Get 20% Off on Your First Order
                </div>
                <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>
                  Use Code: <span style={{ fontWeight: 800, color: '#047857' }}>PLANT20</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Trust Bar (4 Columns matching Image 1) */}
      <section className="container">
        <div className="trust-bar-grid">
          <div style={{ padding: '1.2rem', display: 'flex', gap: '0.9rem', alignItems: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#d1fae5', color: '#047857', padding: '0.65rem', borderRadius: '50%', display: 'flex' }}>
              <Truck size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>Free Shipping</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>On orders above ₹499</p>
            </div>
          </div>

          <div style={{ padding: '1.2rem', display: 'flex', gap: '0.9rem', alignItems: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#d1fae5', color: '#047857', padding: '0.65rem', borderRadius: '50%', display: 'flex' }}>
              <Shield size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>100% Secure Payment</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>Safe & trusted checkout</p>
            </div>
          </div>

          <div style={{ padding: '1.2rem', display: 'flex', gap: '0.9rem', alignItems: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#d1fae5', color: '#047857', padding: '0.65rem', borderRadius: '50%', display: 'flex' }}>
              <Leaf size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>Organic & Healthy</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>Best quality for your plants</p>
            </div>
          </div>

          <div style={{ padding: '1.2rem', display: 'flex', gap: '0.9rem', alignItems: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <div style={{ background: '#d1fae5', color: '#047857', padding: '0.65rem', borderRadius: '50%', display: 'flex' }}>
              <Headphones size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 800, fontSize: '0.9rem', color: '#111827' }}>24/7 Support</h4>
              <p style={{ fontSize: '0.78rem', color: '#6b7280' }}>We're here to help</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "Explore Our Categories" Section (9 Cards in 1 Row) */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Leaf size={13} /> SHOP BY CATEGORY
          </div>
          <h2 className="font-heading" style={{ fontSize: '2.1rem', color: '#111827', fontWeight: 800 }}>
            Explore Our Categories
          </h2>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => {
            const theme = categoryThemeMap[cat.categoryName] || { bg: '#eefcf4', color: '#047857', icon: '🪴' };
            const imageUrl = cat.categoryImageUrl || theme.img;

            return (
              <Link
                key={cat.categoryId}
                to={`/shop?category=${encodeURIComponent(cat.categoryName)}`}
                style={{
                  padding: '0.65rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.65rem',
                  borderRadius: '16px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  textDecoration: 'none',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(4, 120, 87, 0.18), 0 4px 10px -2px rgba(0, 0, 0, 0.06)';
                  e.currentTarget.style.borderColor = '#10b981';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                {/* Prominent Large Image Container */}
                <div style={{
                  width: '100%',
                  height: '92px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: theme.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {(imageUrl || theme.img) ? (
                    <img
                      src={imageUrl || theme.img}
                      alt={cat.categoryName}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        if (theme.img && theme.img !== e.target.src) {
                          e.target.src = theme.img;
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    theme.icon
                  )}
                </div>

                <h4 style={{
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: '1.2',
                  margin: '0.1rem 0 0.2rem 0',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '100%'
                }}>
                  {cat.categoryName}
                </h4>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. "Popular Right Now" Section */}
      <section className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.6rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              HAND-PICKED FAVORITES
            </div>
            <h2 className="font-heading" style={{ fontSize: '2.1rem', color: '#111827', fontWeight: 800 }}>
              Popular Right Now
            </h2>
          </div>
          <Link to="/shop" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#047857', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        {(() => {
          const itemsPerPage = 5;
          const totalPages = Math.max(1, Math.ceil(featuredProducts.length / itemsPerPage));
          const visibleProducts = featuredProducts.slice(carouselIndex * itemsPerPage, (carouselIndex + 1) * itemsPerPage);

          return (
            <>
              <div className="popular-products-grid" style={{ marginBottom: '1.5rem' }}>
                {visibleProducts.map((prod) => (
                  <ProductCard key={prod.productId} product={prod} onQuickView={setSelectedProduct} />
                ))}
              </div>

              {/* Carousel Pagination Dots */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  {[...Array(totalPages)].map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCarouselIndex(dotIdx)}
                      style={{
                        width: carouselIndex === dotIdx ? '22px' : '8px',
                        height: '8px',
                        borderRadius: '9999px',
                        background: carouselIndex === dotIdx ? '#047857' : '#cbd5e1',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title={`Page ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          );
        })()}
      </section>

      {/* 6. Three Promo Banner Cards Side-by-Side */}
      <section className="container">
        <div className="promo-banners-grid">
          
          {/* Card 1: New Plant Arrivals */}
          <div style={{
            background: '#eefcf4',
            padding: '1.8rem 1.6rem',
            borderRadius: '18px',
            border: '1px solid #d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🪴 New Plant Arrivals
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.8rem' }}>
                Bring home nature's best picks
              </h3>
              <Link to="/shop?category=Plants" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Explore Plants <ArrowRight size={14} />
              </Link>
            </div>
            <img src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=250&q=80" alt="New Plants" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
          </div>

          {/* Card 2: Beautiful Pots */}
          <div style={{
            background: '#fff7ed',
            padding: '1.8rem 1.6rem',
            borderRadius: '18px',
            border: '1px solid #ffedd5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c2410c', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                💖 Beautiful Pots
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.8rem' }}>
                Style your space beautifully
              </h3>
              <Link to="/shop?category=Pots" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#c2410c', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Shop Pots <ArrowRight size={14} />
              </Link>
            </div>
            <img src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=250&q=80" alt="Beautiful Pots" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
          </div>

          {/* Card 3: Organic Soils */}
          <div style={{
            background: '#eefcf4',
            padding: '1.8rem 1.6rem',
            borderRadius: '18px',
            border: '1px solid #d1fae5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#047857', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                🌱 Organic Soils
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '0.8rem' }}>
                Nourish your plants the natural way
              </h3>
              <Link to="/shop?category=Soils" style={{ fontSize: '0.82rem', fontWeight: 800, color: '#047857', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                Shop Soils <ArrowRight size={14} />
              </Link>
            </div>
            <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=250&q=80" alt="Organic Soils" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
          </div>

        </div>
      </section>

      {/* 7. "Because You Deserve the Best" Section */}
      <section className="container">
        <div style={{ padding: '2.5rem 2rem', background: '#ffffff', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.3rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Leaf size={13} /> WHY CHOOSE PLANTIFY?
            </div>
            <h2 className="font-heading" style={{ fontSize: '2.1rem', color: '#111827', fontWeight: 800 }}>
              Because You Deserve the Best
            </h2>
          </div>

          <div className="why-choose-grid">
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#f8fafc', color: '#047857', padding: '0.8rem', borderRadius: '50%', display: 'flex' }}>
                <Award size={24} />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>Premium Quality</h4>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Carefully selected products</p>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#f8fafc', color: '#047857', padding: '0.8rem', borderRadius: '50%', display: 'flex' }}>
                <Users size={24} />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>Trusted by 10K+ Customers</h4>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Join our growing plant family</p>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#f8fafc', color: '#047857', padding: '0.8rem', borderRadius: '50%', display: 'flex' }}>
                <Leaf size={24} />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>Sustainable Packaging</h4>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Eco-friendly & recyclable</p>
            </div>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: '#f8fafc', color: '#047857', padding: '0.8rem', borderRadius: '50%', display: 'flex' }}>
                <RefreshCw size={24} />
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>Hassle-Free Returns</h4>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>Easy return within 7 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};
