import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AdminContext } from "../context/AdminContext";
import { COLORS } from "../utils/colors";

export default function ProfileScreen({ navigation }) {
  const { isAdmin } = useContext(AdminContext);

  const menuItems = [
    {
      id: 1,
      title: "Hesap Bilgilerim",
      icon: "person-outline",
      screen: "AccountInfo",
      color: COLORS.adminInfo,
    },
    {
      id: 2,
      title: "Siparişlerim",
      icon: "receipt-outline",
      screen: "MyOrders",
      color: COLORS.adminSuccess,
    },
    {
      id: 3,
      title: "Adreslerim",
      icon: "location-outline",
      screen: "MyAddresses",
      color: COLORS.adminWarning,
    },
    {
      id: 4,
      title: "Bildirimler",
      icon: "notifications-outline",
      screen: "Notifications",
      color: COLORS.adminPrimary,
    },
    {
      id: 5,
      title: "Yardım & Destek",
      icon: "help-circle-outline",
      screen: "Support",
      color: COLORS.adminTextLight,
    },
  ];

  const handleAdminAccess = () => {
    if (isAdmin) {
      navigation.navigate("AdminPanel");
    } else {
      navigation.navigate("AdminLogin");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hesabım</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={COLORS.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Kullanıcı Adı</Text>
            <Text style={styles.profileEmail}>kullanici@email.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons
              name="create-outline"
              size={20}
              color={COLORS.adminPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Admin Access Button */}
        <TouchableOpacity
          style={styles.adminButton}
          onPress={handleAdminAccess}
        >
          <View style={styles.adminButtonContent}>
            <View style={styles.adminIconContainer}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={COLORS.adminPrimary}
              />
            </View>
            <View style={styles.adminTextContainer}>
              <Text style={styles.adminButtonTitle}>
                {isAdmin ? "Admin Paneli" : "Admin Girişi"}
              </Text>
              <Text style={styles.adminButtonSubtitle}>
                {isAdmin ? "Yönetim paneline git" : "Yönetici olarak giriş yap"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={COLORS.adminPrimary}
            />
          </View>
        </TouchableOpacity>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                // Navigation will be added later
                console.log(`Navigate to ${item.screen}`);
              }}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.adminTextLight}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons
            name="log-out-outline"
            size={22}
            color={COLORS.adminDanger}
          />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Versiyon 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.adminBackground,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.adminText,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.adminPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.adminText,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.adminTextLight,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.adminBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  adminButton: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: COLORS.adminPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: COLORS.adminPrimary,
  },
  adminButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  adminIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  adminTextContainer: {
    flex: 1,
  },
  adminButtonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.adminPrimary,
    marginBottom: 4,
  },
  adminButtonSubtitle: {
    fontSize: 13,
    color: COLORS.adminTextLight,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.adminText,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.adminDanger,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.adminDanger,
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.adminTextLight,
  },
});
