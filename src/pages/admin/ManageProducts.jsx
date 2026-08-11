import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import { productApi } from '../../api/productApi';
import { Plus, Edit, Trash2, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [notification, setNotification] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: ''
  });

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 5000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productApi.getProducts({ size: 300 }),
        productApi.getCategories()
      ]);
      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data.content || prodRes.data);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }
    } catch (err) {
      console.error(err);
      showToast('error', err.message || 'Failed to load catalog data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (product = null) => {
    setNotification({ type: '', message: '' });
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? product.price.toString() : '',
        stock: product.stock !== undefined ? product.stock.toString() : '',
        categoryId: product.categoryId ? product.categoryId.toString() : (categories[0]?.categoryId.toString() || ''),
        imageUrl: product.imageUrls?.[0] || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: categories[0]?.categoryId ? categories[0].categoryId.toString() : '',
        imageUrl: ''
      });
    }
    setModalOpen(true);
  };

  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${product.name}"?\n\nThis will remove it from the catalog immediately.`
    );
    if (!confirmDelete) return;

    try {
      const res = await adminApi.deleteProduct(product.productId);
      if (res.success) {
        showToast('success', `Product "${product.name}" deleted successfully.`);
        loadData();
      } else {
        showToast('error', res.message || 'Failed to delete product');
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });

    // Validate fields
    if (!formData.name.trim()) {
      showToast('error', 'Product name is required');
      return;
    }
    if (!formData.categoryId) {
      showToast('error', 'Please select a valid category');
      return;
    }
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showToast('error', 'Price must be a valid number greater than zero');
      return;
    }
    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      showToast('error', 'Stock quantity must be a non-negative integer');
      return;
    }

    // Verify category exists
    const categoryExists = categories.some(c => c.categoryId.toString() === formData.categoryId.toString());
    if (!categoryExists) {
      showToast('error', 'Selected category does not exist in the database');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: priceNum,
      stock: stockNum,
      categoryId: parseInt(formData.categoryId, 10),
      imageUrls: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : []
    };

    setSubmitting(true);
    try {
      let res;
      if (editingProduct) {
        res = await adminApi.updateProduct(editingProduct.productId, payload);
      } else {
        res = await adminApi.createProduct(payload);
      }

      if (res.success) {
        showToast('success', editingProduct ? `Updated "${payload.name}" successfully!` : `Added "${payload.name}" to inventory!`);
        setModalOpen(false);
        loadData();
      } else {
        showToast('error', res.message || 'Failed to save product');
      }
    } catch (err) {
      showToast('error', err.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1200px' }}>
      
      {/* Toast Notification Banner */}
      {notification.message && (
        <div style={{
          padding: '0.9rem 1.2rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600,
          background: notification.type === 'success' ? '#d1fae5' : '#ffe4e6',
          color: notification.type === 'success' ? '#065f46' : '#9f1239',
          border: `1px solid ${notification.type === 'success' ? '#6ee7b7' : '#fca5a5'}`
        }}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: '2.2rem', color: '#047857' }}>Product Inventory Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Add new products, modify pricing, update stock, or remove catalog items.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#047857' }}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading store products...</div>
      ) : (
        <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.8rem' }}>Image</th>
                <th style={{ padding: '0.8rem' }}>Product Name</th>
                <th style={{ padding: '0.8rem' }}>Category</th>
                <th style={{ padding: '0.8rem' }}>Price</th>
                <th style={{ padding: '0.8rem' }}>Stock</th>
                <th style={{ padding: '0.8rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No products found in inventory.
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.productId} style={{ borderBottom: '1px solid var(--border-light)', fontSize: '0.9rem' }}>
                    <td style={{ padding: '0.8rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6' }}>
                        {p.imageUrls?.[0] ? (
                          <img src={p.imageUrls[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} referrerPolicy="no-referrer" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#9ca3af' }}>No img</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>{p.categoryName || 'General'}</span>
                    </td>
                    <td style={{ padding: '0.8rem', fontWeight: 600 }}>₹{Number(p.price).toFixed(2)}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{ fontWeight: 700, color: p.stock <= 5 ? '#e11d48' : '#047857' }}>
                        {p.stock} units
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                      <button onClick={() => handleOpenModal(p)} title="Edit Product" style={{ color: '#047857', marginRight: '1rem', padding: '0.4rem' }}>
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(p)} title="Delete Product" style={{ color: '#e11d48', padding: '0.4rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '520px', padding: '2rem', background: 'var(--bg-surface)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#047857' }}>
                {editingProduct ? 'Edit Product Details' : 'Add New Product'}
              </h2>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monstera Deliciosa"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Category *</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="29.99"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="25"
                    value={formData.stock}
                    onChange={e => setFormData({...formData, stock: e.target.value})}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.3rem' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the plant or product care..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary" style={{ background: '#047857' }}>
                  {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
