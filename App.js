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
import { UserAPI } from "./src/api/endpoints";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);
  // App.js içindeki checkLoginStatus fonksiyonunu bu şekilde güncelle
  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const adminToken = await AsyncStorage.getItem("adminToken");
      const courierToken = await AsyncStorage.getItem("courierToken");

      // Sıralama ve kontrol mantığı
      if (adminToken) {
        setInitialRoute("AdminPanel");
      } else if (courierToken) {
        setInitialRoute("CourierDashboard");
      } else if (token) {
        try {
          // Kullanıcı tokenı varsa profil kontrolü yap
          await UserAPI.getProfile();
          setInitialRoute("MainTabs");
        } catch (e) {
          // Token geçersizse sil ve hoşgeldin ekranına at
          await AsyncStorage.removeItem("userToken");
          setInitialRoute("Welcome");
        }
      } else {
        // Hiçbir token yoksa Welcome açılır
        setInitialRoute("Welcome");
      }
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
