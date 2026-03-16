import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Polygon } from "react-native-svg";
import { COLORS } from "../utils/colors";

const { height } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  const [tapCount, setTapCount] = useState(0);
  const [kargocuTap, setKargocuTap] = useState(0);

  const handleLogoPress = () => {
    const n = tapCount + 1;
    setTapCount(n);
    if (n >= 5) {
      setTapCount(0);
      navigation.navigate("AdminLogin");
    }
  };

  const handleKargocuPress = () => {
    const n = kargocuTap + 1;
    setKargocuTap(n);
    if (n >= 3) {
      setKargocuTap(0);
      navigation.navigate("KargocuLogin");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <TouchableOpacity
            onPress={handleLogoPress}
            style={styles.logoContainer}
            activeOpacity={0.85}
          >
            <Svg width={110} height={110} viewBox="0 0 100 100">
              <Polygon points="50,2 56,50 50,98 44,50" fill={COLORS.primary} />
              <Polygon points="2,50 50,44 98,50 50,56" fill={COLORS.primary} />
              <Polygon
                points="50,2 51.5,50 50,98 48.5,50"
                fill="white"
                opacity="0.5"
              />
              <Polygon
                points="2,50 50,48.5 98,50 50,51.5"
                fill="white"
                opacity="0.5"
              />
              <Polygon points="12,12 54,50 88,88 46,50" fill={COLORS.primary} />
              <Polygon points="88,12 50,54 12,88 50,46" fill={COLORS.primary} />
              <Polygon
                points="12,12 51,50 88,88 49,50"
                fill="white"
                opacity="0.5"
              />
              <Polygon
                points="88,12 50,51 12,88 50,49"
                fill="white"
                opacity="0.5"
              />
              <Circle cx="50" cy="50" r="5" fill={COLORS.primary} />
            </Svg>
          </TouchableOpacity>
          <Text style={styles.title}>Tekno Mağazası</Text>
          <Text style={styles.subtitle}>
            En iyi teknoloji ürünlerini keşfedin
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <TouchableOpacity
            style={styles.featureItem}
            onPress={handleKargocuPress}
            activeOpacity={1}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="rocket" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.featureText}>Hızlı Teslimat</Text>
          </TouchableOpacity>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons
                name="shield-checkmark"
                size={32}
                color={COLORS.success}
              />
            </View>
            <Text style={styles.featureText}>Güvenli Alışveriş</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="star" size={32} color={COLORS.warning} />
            </View>
            <Text style={styles.featureText}>Kaliteli Ürünler</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerButtonText}>Kaydol</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.guestButton}
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text style={styles.guestButtonText}>Misafir olarak devam et</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, justifyContent: "space-between", padding: 20 },
  logoSection: { alignItems: "center", marginTop: height * 0.08 },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: COLORS.gray, textAlign: "center" },
  featuresSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 40,
  },
  featureItem: { alignItems: "center", flex: 1 },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonSection: { marginBottom: 20 },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  registerButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  registerButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  guestButton: { paddingVertical: 12 },
  guestButtonText: {
    color: COLORS.gray,
    fontSize: 15,
    textAlign: "center",
    fontWeight: "500",
  },
});
