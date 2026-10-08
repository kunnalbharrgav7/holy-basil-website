import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Admin: Get all franchise applications
export const getAdminFranchiseRequests = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/franchise/admin/franchise-requests`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return response.data;
};

// Admin: Update application status (Approved / Rejected) with optional tier
export const updateFranchiseStatus = async (id, status, franchiseTier) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(
    `${API_URL}/franchise/admin/franchise-status/${id}`,
    { status, franchiseTier }, // 🌟 Added franchiseTier here
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};
