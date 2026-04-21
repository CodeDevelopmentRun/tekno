import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getApiUrl = () => {
  if (Platform.OS === "android" && !Constants.isDevice) {
    return "http://10.0.2.2:5000/api"; // Android Emülatör
  }
  return "http://10.72.10.90:5000/api"; // Gerçek telefon (WiFi IP)
};

const API_URL = getApiUrl();

console.log("🌐 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    console.log("📤 API Request:", config.method.toUpperCase(), config.url);
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.data);
    return response;
  },
  async (error) => {
    console.error(
      "❌ API Error:",
      error.response?.status,
      error.response?.data || error.message,
    );
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
    }
    return Promise.reject(error);
  },
);

export const AuthAPI = {
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Kod gönderilemedi" };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user),
        );
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Kayıt başarısız" };
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user),
        );
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Giriş başarısız" };
    }
  },

  verifyResetCode: async (email, code) => {
    try {
      const response = await api.post("/auth/verify-reset-code", {
        email,
        code,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Kod doğrulanamadı" };
    }
  },

  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });
      if (response.data.token) {
        await AsyncStorage.setItem("userToken", response.data.token);
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.user),
        );
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Şifre sıfırlanamadı" };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get("/auth/profile");
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.user),
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Profil alınamadı" };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData);
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify(response.data.user),
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Profil güncellenemedi" };
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  },

  checkAuth: async () => {
    const token = await AsyncStorage.getItem("userToken");
    const userData = await AsyncStorage.getItem("userData");
    if (token && userData) {
      return { isAuthenticated: true, user: JSON.parse(userData), token };
    }
    return { isAuthenticated: false, user: null, token: null };
  },
};

export default api;
