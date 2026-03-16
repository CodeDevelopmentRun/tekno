import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserAPI } from "../api/endpoints";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const response = await UserAPI.getProfile();
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Login check error:", error);
      await AsyncStorage.removeItem("userToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await UserAPI.login({ email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem("userToken", token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Giriş başarısız",
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await UserAPI.register(userData);
      const { token, user } = response.data;
      if (token) {
        await AsyncStorage.setItem("userToken", token);
        setUser(user);
      }
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Kayıt başarısız",
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
