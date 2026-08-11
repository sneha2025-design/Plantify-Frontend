import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, grandTotal: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, grandTotal: 0 });
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.getCartSummary();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please log in to add items to your cart' };
    }
    try {
      const res = await cartApi.addToCart(productId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
        setIsDrawerOpen(true);
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message || 'Could not add to cart' };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartApi.updateQuantity(productId, quantity);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      alert(err.message || 'Could not update cart quantity');
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await cartApi.removeFromCart(productId);
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      isDrawerOpen,
      setIsDrawerOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
