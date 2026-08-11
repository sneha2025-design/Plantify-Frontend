import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }

    setLoading(true);
    try {
      const res = await wishlistApi.getWishlist();
      if (res.success && res.data) {
        setWishlist(res.data);
        const ids = new Set(res.data.map((p) => p.productId));
        setWishlistIds(ids);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback((productId) => {
    if (!productId) return false;
    return wishlistIds.has(Number(productId));
  }, [wishlistIds]);

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      alert('Please log in to save items to your wishlist!');
      return false;
    }

    const numId = Number(productId);
    const currentlyIn = wishlistIds.has(numId);

    // Optimistic UI update
    if (currentlyIn) {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        next.delete(numId);
        return next;
      });
      setWishlist((prev) => prev.filter((p) => p.productId !== numId));
    } else {
      setWishlistIds((prev) => new Set(prev).add(numId));
    }

    try {
      if (currentlyIn) {
        await wishlistApi.removeFromWishlist(numId);
      } else {
        await wishlistApi.addToWishlist(numId);
      }
      // Sync authoritative state from server
      await fetchWishlist();
      return true;
    } catch (err) {
      console.error('Wishlist update failed:', err);
      // Revert optimistic update on error
      await fetchWishlist();
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    return await toggleWishlist(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
