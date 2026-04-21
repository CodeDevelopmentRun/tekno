import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

// Ekranları import ediyoruz (Yolların doğruluğundan emin ol)
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import CartScreen from "../screens/CartScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyCodeScreen from "../screens/VerifyCodeScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import AdminLoginScreen from "../screens/AdminLoginScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import AdminProductsScreen from "../screens/AdminProductsScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderSuccessScreen from "../screens/OrderSuccessScreen";
import OrdersScreen from "../screens/OrdersScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import KargocuLoginScreen from "../screens/KargocuLoginScreen";
import KargocuDashboardScreen from "../screens/KargocuDashboardScreen";
import ReviewScreen from "../screens/ReviewScreen";
import BrandsScreen from "../screens/BrandsScreen";
import ProductsByBrandScreen from "../screens/ProductsByBrandScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Ana Sayfa")
            iconName = focused ? "home" : "home-outline";
          else if (route.name === "Favorilerim")
            iconName = focused ? "heart" : "heart-outline";
          else if (route.name === "Sepetim")
            iconName = focused ? "cart" : "cart-outline";
          else if (route.name === "Kategoriler")
            iconName = focused ? "grid" : "grid-outline";
          else if (route.name === "Hesabım")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          height: 90, // Yüksekliği biraz optimize ettim
          paddingBottom: 15,
          paddingTop: 15,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Favorilerim" component={FavoritesScreen} />
      <Tab.Screen name="Sepetim" component={CartScreen} />
      <Tab.Screen name="Kategoriler" component={CategoriesScreen} />
      <Tab.Screen name="Hesabım" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// initialRoute prop'u dışarıdan gelmezse varsayılan olarak "Welcome" ekranı açılır
export default function AppNavigator({ initialRoute = "Welcome" }) {
  return (
    <Stack.Navigator
      // Eğer uygulama hala kargocuda açılıyorsa,
      // aşağıyı geçici olarak initialRouteName="Welcome" yapıp dene.
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // Geçiş efekti ekledik
      }}
    >
      {/* --- MÜŞTERİ / GENEL EKRANLAR --- */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="BrandsScreen" component={BrandsScreen} />
      <Stack.Screen name="ProductsByBrand" component={ProductsByBrandScreen} />

      {/* --- ADMIN EKRANLARI --- */}
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminPanel" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />

      {/* --- KARGOCU EKRANLARI --- */}
      <Stack.Screen name="KargocuLogin" component={KargocuLoginScreen} />
      <Stack.Screen
        name="CourierDashboard"
        component={KargocuDashboardScreen}
        options={{
          headerShown: false,
          // gestureEnabled: false, // Bunu kapattım ki yanlışlıkla geri çıkınca uygulama çökmesin
        }}
      />
    </Stack.Navigator>
  );
}
