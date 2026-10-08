import api from "./api";

export const createEnquiry = async (enquiryData) => {
  const response = await api.post("/enquiries", enquiryData);
  return response.data;
};

export const getAdminEnquiries = async () => {
  const response = await api.get("/enquiries");
  return response.data;
};

export const getAdminEnquiryById = async (id) => {
  const response = await api.get(`/enquiries/${id}`);
  return response.data;
};

export const updateEnquiry = async (id, data) => {
  const response = await api.patch(`/enquiries/${id}`, data);

  return response.data;
};
