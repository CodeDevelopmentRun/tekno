import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { COLORS } from "../utils/colors";

export default function ProfileScreen() {
  const menuItems = [
    {
      id: 1,
      icon: "👤",
      title: "Profil Bilgilerim",
      subtitle: "Ad, soyad, e-posta",
    },
    { id: 2, icon: "📦", title: "Siparişlerim", subtitle: "Sipariş geçmişi" },
    { id: 3, icon: "📍", title: "Adreslerim", subtitle: "Kayıtlı adresler" },
    {
      id: 4,
      icon: "💳",
      title: "Ödeme Yöntemlerim",
      subtitle: "Kayıtlı kartlar",
    },
    { id: 5, icon: "🔔", title: "Bildirimler", subtitle: "Bildirim ayarları" },
    { id: 6, icon: "❓", title: "Yardım", subtitle: "SSS ve destek" },
    { id: 7, icon: "⚙️", title: "Ayarlar", subtitle: "Uygulama ayarları" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hesabım</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>Kullanıcı Adı</Text>
          <Text style={styles.userEmail}>kullanici@email.com</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versiyon 1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  menuContainer: {
    marginHorizontal: 15,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: COLORS.gray,
  },
  menuArrow: {
    fontSize: 24,
    color: COLORS.gray,
  },
  logoutButton: {
    margin: 15,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: "600",
  },
  version: {
    textAlign: "center",
    color: COLORS.gray,
    fontSize: 12,
    marginBottom: 30,
  },
});
