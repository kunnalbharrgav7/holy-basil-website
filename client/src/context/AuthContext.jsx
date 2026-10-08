import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("hba_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("hba_token", token);
      localStorage.setItem("hba_user", JSON.stringify(user));

      setUser(user);

      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    // Accept object directly
    setLoading(true);
    try {
      const response = await api.post("/auth/register", userData);
      const { token, user } = response.data;

      localStorage.setItem("hba_token", token);
      localStorage.setItem("hba_user", JSON.stringify(user));
      setUser(user);

      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("hba_token");
    localStorage.removeItem("hba_user");
    setUser(null);
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email, newPassword) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        newPassword,
      });
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/google-login", userData);

      // 🌟 FIX: Safe extraction taaki undefined error na aaye
      const resData = response.data;
      const token = resData.token;
      const userObj = resData.user || resData.data; // Backend ke format ke hisaab se safe fallback

      if (token && userObj) {
        localStorage.setItem("hba_token", token);
        localStorage.setItem("hba_user", JSON.stringify(userObj));
        setUser(userObj);
      }

      return userObj;
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("hba_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    googleLogin,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
