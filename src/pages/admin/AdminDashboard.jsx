import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/adminApi';
import { Package, Users, ShoppingBag, ArrowRight, IndianRupee, Calendar, Filter, FileText } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Business Analytics State
  const [analyticsMode, setAnalyticsMode] = useState('DAILY'); // DAILY, MONTHLY, YEARLY, OVERALL
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    transactions: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    adminApi.getDashboardAnalytics()
      .then(res => {
        if (res.success) setStats(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      let res;
      if (analyticsMode === 'DAILY') {
        res = await adminApi.getDailyRevenue(selectedDate);
      } else if (analyticsMode === 'MONTHLY') {
        res = await adminApi.getMonthlyRevenue(parseInt(selectedYear, 10), parseInt(selectedMonth, 10));
      } else if (analyticsMode === 'YEARLY') {
        res = await adminApi.getYearlyRevenue(parseInt(selectedYear, 10));
      } else {
        res = await adminApi.getOverallRevenue();
      }

      if (res.success && res.data) {
        setAnalyticsData({
          totalRevenue: res.data.totalRevenue ?? 0,
          totalOrders: res.data.totalOrders ?? 0,
          transactions: res.data.transactions || []
        });
      }
    } catch (err) {
      console.error('Failed to load business analytics:', err);
      setAnalyticsData({ totalRevenue: 0, totalOrders: 0, transactions: [] });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [analyticsMode, selectedDate, selectedYear, selectedMonth]);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="font-heading" style={{ fontSize: '2.2rem', color: '#047857' }}>Admin Control Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage products, oversee users, and track platform revenue analytics.</p>
      </div>

      {/* Top Level Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#d1fae5', color: '#047857', padding: '0.8rem', borderRadius: '12px' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Products</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalProducts ?? 0}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.8rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Users</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalUsers ?? 0}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.8rem', borderRadius: '12px' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalOrders ?? 0}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#dcfce7', color: '#15803d', padding: '0.8rem', borderRadius: '12px' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Platform Revenue</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{Number(stats?.overallRevenue ?? 0).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Action Cards */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
        <Link to="/admin/products" className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.2rem', color: '#047857' }}>Product Management</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Add, edit, or delete store products</p>
          </div>
          <ArrowRight size={20} style={{ color: '#047857' }} />
        </Link>

        <Link to="/admin/users" className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.2rem', color: '#047857' }}>User Management</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>View users, update details & roles</p>
          </div>
          <ArrowRight size={20} style={{ color: '#047857' }} />
        </Link>

        <Link to="/admin/orders" className="glass-card" style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.2rem', color: '#047857' }}>Order Management</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>View and manage customer orders</p>
          </div>
          <ArrowRight size={20} style={{ color: '#047857' }} />
        </Link>
      </div>

      {/* Business Analytics Section */}
      <div className="glass-card" style={{ padding: '2rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="font-heading" style={{ fontSize: '1.5rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={22} /> Business Analytics & Revenue
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Select a timeframe to inspect daily, monthly, yearly, or overall revenue and transaction breakdowns.
            </p>
          </div>

          {/* Timeframe Mode Selector */}
          <div style={{ display: 'flex', background: 'var(--bg-primary)', padding: '0.3rem', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
            {['DAILY', 'MONTHLY', 'YEARLY', 'OVERALL'].map(mode => (
              <button
                key={mode}
                onClick={() => setAnalyticsMode(mode)}
                style={{
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '7px',
                  border: 'none',
                  background: analyticsMode === mode ? '#047857' : 'transparent',
                  color: analyticsMode === mode ? 'white' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Inputs Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '1rem', background: '#f8fafc', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
            <Filter size={16} /> Filter Parameters:
          </div>

          {analyticsMode === 'DAILY' && (
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ padding: '0.45rem 0.7rem', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.88rem' }}
            />
          )}

          {(analyticsMode === 'MONTHLY' || analyticsMode === 'YEARLY') && (
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              style={{ padding: '0.45rem 0.7rem', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.88rem', fontWeight: 600 }}
            >
              {[2024, 2025, 2026, 2027].map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          )}

          {analyticsMode === 'MONTHLY' && (
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              style={{ padding: '0.45rem 0.7rem', borderRadius: '6px', border: '1px solid var(--border-light)', fontSize: '0.88rem', fontWeight: 600 }}
            >
              {[
                { m: 1, name: 'January' }, { m: 2, name: 'February' }, { m: 3, name: 'March' },
                { m: 4, name: 'April' }, { m: 5, name: 'May' }, { m: 6, name: 'June' },
                { m: 7, name: 'July' }, { m: 8, name: 'August' }, { m: 9, name: 'September' },
                { m: 10, name: 'October' }, { m: 11, name: 'November' }, { m: 12, name: 'December' }
              ].map(item => (
                <option key={item.m} value={item.m}>{item.name}</option>
              ))}
            </select>
          )}

          {analyticsMode === 'OVERALL' && (
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
              Showing cumulative lifetime metrics since platform launch.
            </span>
          )}
        </div>

        {/* Analytics Revenue Display Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
          color: 'white',
          borderRadius: '12px',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
              Selected Period Revenue ({analyticsMode})
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem' }}>
              ₹{Number(analyticsData.totalRevenue).toFixed(2)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.85 }}>
              Completed Orders
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.2rem' }}>
              {analyticsData.totalOrders}
            </div>
          </div>
        </div>

        {/* Transaction Summary Table */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FileText size={18} /> Transaction Breakdown ({analyticsData.transactions.length} orders)
        </h3>

        {analyticsLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics data...</div>
        ) : analyticsData.transactions.length === 0 ? (
          <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#64748b' }}>No Transactions Found</div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.3rem' }}>
              No completed orders or revenue records exist for this selected period ({analyticsMode.toLowerCase()}).
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Order ID</th>
                  <th style={{ padding: '0.75rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem' }}>Date & Time</th>
                  <th style={{ padding: '0.75rem' }}>Payment Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.transactions.map(order => (
                  <tr key={order.orderId} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem', fontFamily: 'monospace', fontWeight: 700 }}>#{order.orderId}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{order.customerName || 'Customer'}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${order.paymentStatus === 'PAID' ? 'badge-emerald' : 'badge-amber'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 700, color: '#047857' }}>
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
