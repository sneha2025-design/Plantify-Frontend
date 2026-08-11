import axiosClient from './axiosClient';

export const productApi = {
  getProducts: (params) => axiosClient.get('/products', { params }),
  getFeaturedProducts: () => axiosClient.get('/products/featured'),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  getCategories: () => axiosClient.get('/categories'),
  getCategoryById: (id) => axiosClient.get(`/categories/${id}`),
};
