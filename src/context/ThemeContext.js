import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (error) {
      console.log("Theme yüklenemedi:", error);
    }
  };

  const colors = isDarkMode
    ? {
        // Dark Theme
        background: "#0F0F1E",
        surface: "#1A1A2E",
        card: "rgba(255, 255, 255, 0.08)",
        cardBorder: "rgba(255, 255, 255, 0.15)",

        primary: "#6366F1",
        primaryLight: "#818CF8",
        accent: "#F59E0B",
        success: "#10B981",
        error: "#EF4444",

        // ✅ Koyu modda daha parlak yazılar
        textPrimary: "#FFFFFF",
        textSecondary: "rgba(255, 255, 255, 0.9)",
        textTertiary: "rgba(255, 255, 255, 0.75)",

        headerBg: "rgba(99, 102, 241, 0.2)",
        headerBorder: "rgba(99, 102, 241, 0.3)",
        searchBg: "rgba(255, 255, 255, 0.1)",
        searchBorder: "rgba(255, 255, 255, 0.15)",

        orb1: "#6366F1",
        orb2: "#EC4899",
        orbOpacity: 0.15,
      }
    : {
        // Light Theme
        background: "#F8F9FA",
        surface: "#FFFFFF",
        card: "#FFFFFF",
        cardBorder: "#E5E7EB",

        primary: "#6366F1",
        primaryLight: "#818CF8",
        accent: "#F59E0B",
        success: "#10B981",
        error: "#EF4444",

        // ✅ Açık modda daha koyu yazılar
        textPrimary: "#111827",
        textSecondary: "#374151",
        textTertiary: "#4B5563",

        headerBg: "#FFFFFF",
        headerBorder: "#E5E7EB",
        searchBg: "#F3F4F6",
        searchBorder: "#E5E7EB",

        orb1: "#6366F1",
        orb2: "#EC4899",
        orbOpacity: 0.05,
      };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, toggleTheme, colors, loadTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
