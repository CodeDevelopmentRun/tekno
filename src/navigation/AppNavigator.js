import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import CartScreen from "../screens/CartScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Ana Sayfa") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Favorilerim") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Sepetim") {
            iconName = focused ? "cart" : "cart-outline";
          } else if (route.name === "Kategoriler") {
            iconName = focused ? "grid" : "grid-outline";
          } else if (route.name === "Hesabım") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FF6B35",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          height: 110,
          paddingBottom: 15,
          paddingTop: 15,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
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
