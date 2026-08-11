import axiosClient from './axiosClient';

export const cartApi = {
  getCartSummary: () => axiosClient.get('/cart/items'),
  getCartCount: () => axiosClient.get('/cart/items/count'),
  addToCart: (productId, quantity = 1) => axiosClient.post('/cart/add', { productId, quantity }),
  updateQuantity: (productId, quantity) => axiosClient.put('/cart/update', { productId, quantity }),
  removeFromCart: (productId) => axiosClient.delete(`/cart/delete/${productId}`),
};
