import api from "./api";

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data;
};

export const getAdminOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getAdminOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, data) => {
  const response = await api.patch(`/orders/${id}/status`, data);

  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/mine");
  return response.data;
};

// orderService.js ke andar ye add kar dein:
export const getRoyaltySummary = async () => {
  const response = await api.get("/orders/royalties/summary"); // 🌟 API -> api
  return response.data;
};

export const updateRoyaltyStatus = async (orderId, royaltyStatus) => {
  const response = await api.patch(`/orders/${orderId}/status`, {
    // 🌟 API -> api
    royaltyStatus,
  });
  return response.data;
};
