import api from "./api";

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });
  return response.data;
};

export const getBestSellers = async (limit = 4) => {
  // Queries /products?bestSeller=true or /products/best-sellers
  const response = await api.get("/products", {
    params: { bestSeller: true, limit },
  });
  return response.data;
};

export const getAdminProducts = async () => {
  const response = await api.get("/products/admin/all");
  return response.data;
};

export const getProductBySlug = async (slug) => {
  const response = await api.get(`/products/${slug}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

export const adjustProductStock = async (id, adjustmentData) => {
  const response = await api.patch(`/products/${id}/stock`, adjustmentData);
  return response.data;
};
