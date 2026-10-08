import api from "./api";

export const uploadProductImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post("/uploads/image", formData);

  return response.data;
};
