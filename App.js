import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { FavoriteProvider } from "./src/context/FavoriteContext";
import { AdminProvider } from "./src/context/AdminContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const adminToken = await AsyncStorage.getItem("adminToken");
      const courierToken = await AsyncStorage.getItem("courierToken"); // YENİ

      if (adminToken) setInitialRoute("AdminPanel");
      else if (courierToken)
        setInitialRoute("CourierDashboard"); // YENİ
      else if (token) setInitialRoute("MainTabs");
      else setInitialRoute("Welcome");
    } catch (e) {
      setInitialRoute("Welcome");
    }
  };

  if (!initialRoute) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <FavoriteProvider>
            <AdminProvider>
              <NavigationContainer>
                <StatusBar style="light" />
                <AppNavigator initialRoute={initialRoute} />
              </NavigationContainer>
            </AdminProvider>
          </FavoriteProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
