import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const adminLogin = async (username, password) => {
    try {
      // Demo admin credentials
      if (username === "admin" && password === "admin123") {
        const adminData = {
          id: 1,
          username: "admin",
          name: "Admin Kullanıcı",
          email: "admin@tekno.com",
          role: "admin",
        };

        await AsyncStorage.setItem("adminToken", "admin-token-123");
        await AsyncStorage.setItem("adminUser", JSON.stringify(adminData));

        setIsAdmin(true);
        setAdminUser(adminData);

        return { success: true };
      } else {
        return {
          success: false,
          message: "Kullanıcı adı veya şifre hatalı",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: "Giriş başarısız",
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
      value={{
        isAdmin,
        adminUser,
        isLoading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
