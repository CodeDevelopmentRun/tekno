import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axiosConfig";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const adminToken = await AsyncStorage.getItem("adminToken");
      const adminData = await AsyncStorage.getItem("adminUser");
      if (adminToken && adminData) {
        setIsAdmin(true);
        setAdminUser(JSON.parse(adminData));
      }
    } catch (error) {
      console.error("Admin check error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user } = response.data;

      if (user.role !== "admin") {
        return { success: false, message: "Bu hesabın admin yetkisi yok" };
      }

      await AsyncStorage.setItem("adminToken", token);
      await AsyncStorage.setItem("adminUser", JSON.stringify(user));
      setIsAdmin(true);
      setAdminUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Giriş başarısız",
      };
    }
  };

  const adminLogout = async () => {
    try {
      await AsyncStorage.removeItem("adminToken");
      await AsyncStorage.removeItem("adminUser");
      setIsAdmin(false);
      setAdminUser(null);
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, adminUser, isLoading, adminLogin, adminLogout }}
    >
      {children}
    </AdminContext.Provider>
  );
};
