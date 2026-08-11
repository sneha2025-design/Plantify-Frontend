import axiosClient from './axiosClient';

export const wishlistApi = {
  getWishlist: () => axiosClient.get('/wishlist'),
  addToWishlist: (productId) => axiosClient.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => axiosClient.delete(`/wishlist/remove/${productId}`),
  checkWishlistStatus: (productId) => axiosClient.get(`/wishlist/check/${productId}`),
};
