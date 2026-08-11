import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import {
  Search, Filter, LayoutGrid, List, ChevronLeft, ChevronRight,
  ArrowRight, Sprout, Flower2, Layers, Droplet, Wheat, Wrench, Droplets, ShieldAlert, Sun
} from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // View Mode: 'grid' or 'list'
  const [viewMode, setViewMode] = useState('grid');

  // Filters state
  const [selectedCatId, setSelectedCatId] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('price');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const activeCategoryParam = searchParams.get('category');

  // Custom high-quality imagery matching specification for 9 categories
  const categoryMediaMap = {
    'Plants': {
      img: 'https://i.pinimg.com/1200x/d1/98/3f/d1983fa2068757008462591bbdac9bf5.jpg',
      icon: <Sprout size={20} color="#047857" />
    },
    'Pots': {
      img: 'https://i.pinimg.com/736x/36/41/7d/36417d0b44eba4f3bc40a0f19d9bdc75.jpg',
      icon: <Flower2 size={20} color="#b45309" />
    },
    'Soils': {
      img: 'https://i.pinimg.com/736x/c9/ee/58/c9ee582eea5e0744c5705e7966f04e46.jpg',
      icon: <Layers size={20} color="#78350f" />
    },
    'Fertilisers': {
      img: 'https://i.pinimg.com/736x/f6/c9/42/f6c942c5212d2983f8e972023f6d35e5.jpg',
      icon: <Droplet size={20} color="#047857" />
    },
    'Seeds': {
      img: 'https://i.pinimg.com/736x/fd/05/39/fd05397b789e4e70745cd160a878b38c.jpg',
      icon: <Wheat size={20} color="#d97706" />
    },
    'Garden Tools': {
      img: 'https://wonderlandgarden.in/cdn/shop/files/IMG_7545_512x342.jpg?v=1742905890',
      icon: <Wrench size={20} color="#4b5563" />
    },
    'Watering Solutions': {
      img: 'https://i.pinimg.com/1200x/96/7f/06/967f06768d5422b6c16f5f56210c9a3b.jpg',
      icon: <Droplets size={20} color="#0284c7" />
    },
    'Pest Control': {
      img: 'https://i.pinimg.com/736x/7c/22/27/7c222713f692167ed55cb05677bfa338.jpg',
      icon: <ShieldAlert size={20} color="#65a30d" />
    },
    'Gardening Decor': {
      img: 'https://i.pinimg.com/1200x/df/1c/7b/df1c7bd95f5bad19080986f75e411f58.jpg',
      icon: <Sun size={20} color="#eab308" />
    }
  };

  useEffect(() => {
    Promise.all([
      productApi.getCategories(),
      productApi.getProducts({ size: 300 })
    ]).then(([catRes, allProdsRes]) => {
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (activeCategoryParam) {
          const match = catRes.data.find(c => c.categoryName.toLowerCase() === activeCategoryParam.toLowerCase());
          if (match) setSelectedCatId(match.categoryId.toString());
        }
      }

      if (allProdsRes.success && allProdsRes.data) {
        const allItems = allProdsRes.data.content || allProdsRes.data;
        setTotalProductsCount(allItems.length);

        const counts = {};
        allItems.forEach((p) => {
          if (p.categoryId) {
            counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
          }
        });
        setCategoryCounts(counts);
      }
    }).catch((err) => console.error('Failed to load catalog metadata:', err));
  }, [activeCategoryParam]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: 12,
        sortBy,
        sortDir,
      };
      if (selectedCatId) params.categoryId = selectedCatId;
      if (searchQuery) params.search = searchQuery;

      const res = await productApi.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data.content || res.data);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCatId, searchQuery, sortBy, sortDir, page]);

  const handleResetFilters = () => {
    setSelectedCatId('');
    setSearchQuery('');
    setSortBy('price');
    setSortDir('asc');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '1.2rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '1340px' }}>
      
      {/* 1. Hero Banner Matching Reference Image */}
      <section className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 60%, #e8f5e9 100%)',
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '2rem',
        alignItems: 'center',
        borderRadius: '16px',
        border: '1px solid #d1fae5',
        boxShadow: 'none'
      }}>
        {/* Hero Left Text */}
        <div style={{ maxWidth: '480px' }}>
          <h1 className="font-heading" style={{ fontSize: '2.5rem', color: '#111827', lineHeight: '1.15', marginBottom: '0.6rem' }}>
            Botanical <span style={{ color: '#047857' }}>Catalog</span>
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.5' }}>
            Everything you need for a thriving garden. Explore our wide selection of plants, tools, soils, and more.
          </p>
        </div>

        {/* Decorative Plants Illustration Center Right */}
        <div style={{ width: '220px', height: '120px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="https://i.pinimg.com/1200x/71/21/46/712146e476238075f0cdfb0656ce41e6.jpg"
            alt="Botanical arrangement"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>

        {/* Floating Promo Card Far Right */}
        <div style={{
          background: '#ffffff',
          padding: '1.1rem 1.2rem',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          width: '210px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#047857', fontWeight: 800, fontSize: '0.92rem' }}>
            <Sprout size={16} /> Green Up Your Space
          </div>
          <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: '1.3' }}>
            Handpicked essentials for every plant parent.
          </p>
          <button onClick={() => { setSelectedCatId('1'); setPage(0); }} className="btn btn-primary" style={{ padding: '0.35rem 0.8rem', fontSize: '0.75rem', borderRadius: '9999px', marginTop: '0.3rem', alignSelf: 'flex-start', background: '#047857' }}>
            Shop Now →
          </button>
        </div>
      </section>

      {/* 2. 9 Category Quick-Nav Row (Single Row of Compact Tiles Matching Reference) */}
      <section style={{ overflowX: 'auto', paddingBottom: '6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, minmax(138px, 1fr))', gap: '8px', minWidth: '1200px' }}>
          {categories.map((cat) => {
            const isSelected = selectedCatId === cat.categoryId.toString();
            const realCount = categoryCounts[cat.categoryId] || 20;
            const media = categoryMediaMap[cat.categoryName] || { icon: <Sprout size={20} color="#047857" />, img: '' };

            return (
              <button
                key={cat.categoryId}
                onClick={() => {
                  if (isSelected) {
                    setSelectedCatId('');
                  } else {
                    setSelectedCatId(cat.categoryId.toString());
                  }
                  setPage(0);
                }}
                style={{
                  padding: '0.45rem 0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isSelected ? '#d1fae5' : '#ffffff',
                  borderColor: isSelected ? '#047857' : '#e5e7eb',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderRadius: '12px',
                  transition: 'var(--transition)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  minHeight: '62px',
                  boxSizing: 'border-box'
                }}
              >
                {/* Thumbnail Image / Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: media.bg || '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {(cat.categoryImageUrl || media.img) ? (
                    <img
                      src={cat.categoryImageUrl || media.img}
                      alt={cat.categoryName}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.onerror = null;
                        if (media.img && media.img !== e.target.src) {
                          e.target.src = media.img;
                        }
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    media.icon
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontWeight: isSelected ? 800 : 700,
                    fontSize: '0.74rem',
                    color: isSelected ? '#047857' : '#111827',
                    lineHeight: '1.2',
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}>
                    {cat.categoryName}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#6b7280', marginTop: '2px' }}>
                    {realCount} items
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Content Grid (Left Sidebar Filters + Right Product Catalog Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.2rem', alignItems: 'start' }}>
        
        {/* Left Sidebar Filters Matching Reference Image */}
        <div className="glass-card" style={{ padding: '1.2rem', borderRadius: '16px', background: '#ffffff' }}>
          
          {/* Header & Reset Link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.92rem', color: '#111827' }}>
              <Filter size={16} style={{ color: '#047857' }} /> Filter Products
            </div>
            <button onClick={handleResetFilters} style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
              Reset All
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: '#374151' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.6rem 0.45rem 2rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: '#f9fafb',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            </div>
          </div>

          {/* Categories List */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem', color: '#374151' }}>Categories</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button
                onClick={() => { setSelectedCatId(''); setPage(0); }}
                style={{
                  textAlign: 'left',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: selectedCatId === '' ? 700 : 500,
                  background: selectedCatId === '' ? '#d1fae5' : 'transparent',
                  color: selectedCatId === '' ? '#047857' : '#374151'
                }}
              >
                All Categories
              </button>
              {categories.map((cat) => {
                const isCatSelected = selectedCatId === cat.categoryId.toString();
                return (
                  <button
                    key={cat.categoryId}
                    onClick={() => { setSelectedCatId(cat.categoryId.toString()); setPage(0); }}
                    style={{
                      textAlign: 'left',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: isCatSelected ? 700 : 500,
                      background: isCatSelected ? '#d1fae5' : 'transparent',
                      color: isCatSelected ? '#047857' : '#4b5563'
                    }}
                  >
                    {cat.categoryName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort By Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem', color: '#374151' }}>Sort By</label>
            <select
              value={`${sortBy}-${sortDir}`}
              onChange={(e) => {
                const [sb, sd] = e.target.value.split('-');
                setSortBy(sb);
                setSortDir(sd);
                setPage(0);
              }}
              style={{
                width: '100%',
                padding: '0.45rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                fontSize: '0.8rem',
                color: '#374151'
              }}
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="productId-desc">Newest</option>
            </select>
          </div>

        </div>

        {/* Right Product Grid Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Top Bar: Title + View Toggles & Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
              All Products ({totalProductsCount || 180})
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {/* Grid / List View Toggle */}
              <div style={{ display: 'flex', gap: '2px', background: '#ffffff', padding: '3px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: viewMode === 'grid' ? '#d1fae5' : 'transparent',
                    color: viewMode === 'grid' ? '#047857' : '#6b7280',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <LayoutGrid size={14} /> Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: viewMode === 'list' ? '#d1fae5' : 'transparent',
                    color: viewMode === 'list' ? '#047857' : '#6b7280',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <List size={14} /> List
                </button>
              </div>

              {/* Popular Dropdown */}
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [sb, sd] = e.target.value.split('-');
                  setSortBy(sb);
                  setSortDir(sd);
                  setPage(0);
                }}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  fontSize: '0.8rem',
                  color: '#374151'
                }}
              >
                <option value="price-asc">Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Items Display (4 Columns per Row on Desktop) */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem' }}>Loading products...</div>
          ) : products.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', background: '#ffffff', borderRadius: '16px' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#111827' }}>No products found</p>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.2rem' }}>Try clearing active filters.</p>
              <button onClick={handleResetFilters} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Reset All Filters</button>
            </div>
          ) : (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(210px, 1fr))' : '1fr',
                gap: '1rem'
              }}>
                {products.map((prod) => (
                  <ProductCard key={prod.productId} product={prod} onQuickView={setSelectedProduct} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', marginTop: '1.5rem' }}>
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                    Page {page + 1} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="btn btn-secondary"
                    style={{ padding: '0.35rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {selectedProduct && (
        <ProductDetailsModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
};
