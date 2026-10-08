import api from "./api";

export const createRazorpayOrder = async (amount) => {
  const response = await api.post("/payment/create-order", { amount });
  return response.data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await api.post("/payment/verify", paymentData);
  return response.data;
};
