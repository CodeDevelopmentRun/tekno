import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SQL Server bağlantısı için backend API URL'iniz
const API_BASE_URL = "http://192.168.1.130:3000/api"; // Şimdilik kullanılmayacak

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Token ekleme
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("userToken");
      // Kullanıcıyı login ekranına yönlendir
    }
    return Promise.reject(error);
  },
);

export default api;
