import api from "./axiosConfig";

export const ProductAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  getBestSellers: () => api.get("/products/bestsellers"),
  search: (query) => api.get(`/products/search?q=${query}`),
};

export const CategoryAPI = {
  getAll: () => api.get("/categories"),
  getPopular: () => api.get("/categories/popular"),
};

export const UserAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
};

export const CartAPI = {
  get: () => api.get("/cart"),
  add: (productId, quantity) => api.post("/cart", { productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete("/cart"),
};

export const OrderAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getHistory: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
};

export const FavoritesAPI = {
  get: () => api.get("/favorites"),
  add: (productId) => api.post("/favorites", { productId }),
  remove: (productId) => api.delete(`/favorites/${productId}`),
};
