import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hba_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong! Please try again.";

    // Handle specific status codes
    if (error.response?.status === 401) {
      toast.error("Session expired or unauthorized. Please log in again.");
      
      // Optional: Clear storage and redirect to login if you want strict enforcement
      // localStorage.removeItem("hba_token");
      // localStorage.removeItem("hba_user");
      // window.location.href = "/login";
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      // For 400, 403, 404, etc.
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
