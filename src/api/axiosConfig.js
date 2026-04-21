import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getApiUrl = () => {
  if (Platform.OS === "android" && !Constants.isDevice) {
    return "http://10.0.2.2:5000/api";
  }
  return "http://10.72.10.90:5000/api";
};

const API_BASE_URL = getApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const adminToken = await AsyncStorage.getItem("adminToken");
      const userToken = await AsyncStorage.getItem("userToken");
      const token = adminToken || userToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("adminToken");
      await AsyncStorage.removeItem("userToken");
    }
    return Promise.reject(error);
  },
);

export default api;
