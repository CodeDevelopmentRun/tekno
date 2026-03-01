/*import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URL - Değiştirin!
const API_URL = "http://localhost:5000/api";
// Android emulator için: http://10.0.2.2:5000/api
// iOS simulator için: http://localhost:5000/api
// Gerçek cihaz için: http://YOUR_IP_ADDRESS:5000/api

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Token ekleme
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - Logout
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
    }
    return Promise.reject(error);
  },
);

// Auth API
export const AuthAPI = {
  // Kayıt
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

  // Giriş
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

  // Şifremi Unuttum - Kod Gönder
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Kod gönderilemedi" };
    }
  },

  // Kodu Doğrula
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

  // Şifreyi Sıfırla
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

  // Profil Getir
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

  // Profil Güncelle
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

  // Çıkış
  logout: async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userData");
  },

  // Token Kontrolü
  checkAuth: async () => {
    const token = await AsyncStorage.getItem("userToken");
    const userData = await AsyncStorage.getItem("userData");

    if (token && userData) {
      return {
        isAuthenticated: true,
        user: JSON.parse(userData),
        token,
      };
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  },
};

export default api;*/

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API URL - SİZİN İÇİN AYARLADIM
const API_URL = "http://192.168.1.103:5000/api";

// DEBUG için - silmeyin!
console.log("🌐 API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 saniye
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // DEBUG
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // DEBUG
    console.log("✅ API Response:", response.status, response.data);
    return response;
  },
  async (error) => {
    // DEBUG
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

// Auth API
export const AuthAPI = {
  forgotPassword: async (email) => {
    try {
      console.log("🔐 Forgot Password için istek gönderiliyor:", email);
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      console.error("❌ Forgot Password Hatası:", error);
      throw error.response?.data || { message: "Kod gönderilemedi" };
    }
  },

  // Diğer metodlar...
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
      return {
        isAuthenticated: true,
        user: JSON.parse(userData),
        token,
      };
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null,
    };
  },
};

export default api;
