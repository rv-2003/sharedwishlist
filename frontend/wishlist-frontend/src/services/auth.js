// src/services/authService.js
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

export const login = async (email, password) => {
  try {
    const response = await axios.post("/api/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (fullname, email, password, phone) => {
  try {
    const response = await axios.post("/api/auth/signup", {
      fullname,
      email,
      password,
      phone,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error.response?.data || error.message);
    throw error;
  }
};
