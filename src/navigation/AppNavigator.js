import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

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
import AdminUsersScreen from "../screens/AdminUsersScreen";
import AdminSettingsScreen from "../screens/AdminSettingsScreen";
import AdminCategoriesScreen from "../screens/AdminCategoriesScreen";
import AdminOrdersScreen from "../screens/AdminOrdersScreen";
import AddressScreen from "../screens/AddressScreen";
import SavedCardsScreen from "../screens/SavedCardsScreen";
import SupportScreen from "../screens/SupportScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ✅ Home Stack
const HomeStackNavigator = createNativeStackNavigator();
function HomeStack() {
  return (
    <HomeStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <HomeStackNavigator.Screen name="HomeMain" component={HomeScreen} />
      <HomeStackNavigator.Screen name="BrandsScreen" component={BrandsScreen} />
      <HomeStackNavigator.Screen
        name="ProductsByBrand"
        component={ProductsByBrandScreen}
      />
      <HomeStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
      <HomeStackNavigator.Screen name="Review" component={ReviewScreen} />
    </HomeStackNavigator.Navigator>
  );
}

// ✅ Categories Stack
const CategoriesStackNavigator = createNativeStackNavigator();
function CategoriesStack() {
  return (
    <CategoriesStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <CategoriesStackNavigator.Screen
        name="CategoriesMain"
        component={CategoriesScreen}
      />
      <CategoriesStackNavigator.Screen
        name="BrandsScreen"
        component={BrandsScreen}
      />
      <CategoriesStackNavigator.Screen
        name="ProductsByBrand"
        component={ProductsByBrandScreen}
      />
      <CategoriesStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </CategoriesStackNavigator.Navigator>
  );
}

// ✅ Favorites Stack
const FavoritesStackNavigator = createNativeStackNavigator();
function FavoritesStack() {
  return (
    <FavoritesStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <FavoritesStackNavigator.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
      />
      <FavoritesStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </FavoritesStackNavigator.Navigator>
  );
}

// ✅ Cart Stack
const CartStackNavigator = createNativeStackNavigator();
function CartStack() {
  return (
    <CartStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <CartStackNavigator.Screen name="CartMain" component={CartScreen} />
      <CartStackNavigator.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
      <CartStackNavigator.Screen name="Checkout" component={CheckoutScreen} />
      <CartStackNavigator.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
      />
      <CartStackNavigator.Screen name="Orders" component={OrdersScreen} />
      <CartStackNavigator.Screen name="Home" component={HomeScreen} />
    </CartStackNavigator.Navigator>
  );
}

// ✅ Profile Stack
const ProfileStackNavigator = createNativeStackNavigator();
function ProfileStack() {
  return (
    <ProfileStackNavigator.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStackNavigator.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />
      <ProfileStackNavigator.Screen name="Orders" component={OrdersScreen} />
      <ProfileStackNavigator.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
      />
      <ProfileStackNavigator.Screen name="Review" component={ReviewScreen} />
      <ProfileStackNavigator.Screen
        name="Adreslerim"
        component={AddressScreen}
      />

      {/* 🛠️ DÜZELTİLDİ: Tırnak işaretleri kaldırıldı */}
      <ProfileStackNavigator.Screen name="Support" component={SupportScreen} />

      <ProfileStackNavigator.Screen
        name="SavedCards"
        component={SavedCardsScreen}
      />
    </ProfileStackNavigator.Navigator>
  );
}

// ✅ Main Tabs
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
          height: 90,
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
      <Tab.Screen name="Ana Sayfa" component={HomeStack} />
      <Tab.Screen name="Favorilerim" component={FavoritesStack} />
      <Tab.Screen name="Sepetim" component={CartStack} />
      <Tab.Screen name="Kategoriler" component={CategoriesStack} />
      <Tab.Screen name="Hesabım" component={ProfileStack} />
    </Tab.Navigator>
  );
}

// ✅ Root App Navigator
export default function AppNavigator({ initialRoute = "Welcome" }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      {/* AUTH EKRANLARI */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      {/* ✅ MainTabs */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* --- ADMIN EKRANLARI --- */}
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminPanel" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminProducts" component={AdminProductsScreen} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
      <Stack.Screen name="AdminCategories" component={AdminCategoriesScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />

      {/* --- KARGOCU EKRANLARI --- */}
      <Stack.Screen name="KargocuLogin" component={KargocuLoginScreen} />
      <Stack.Screen
        name="CourierDashboard"
        component={KargocuDashboardScreen}
      />
    </Stack.Navigator>
  );
}
