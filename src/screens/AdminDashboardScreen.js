import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AdminContext } from "../context/AdminContext";
import { COLORS } from "../utils/colors";

const { width } = Dimensions.get("window");

export default function AdminDashboardScreen({ navigation }) {
  const { adminUser, adminLogout } = useContext(AdminContext);

  const stats = [
    {
      id: 1,
      title: "Toplam Kullanıcı",
      value: "1,248",
      change: "+12%",
      icon: "people",
      color: COLORS.adminInfo,
      bgColor: "#EFF6FF",
    },
    {
      id: 2,
      title: "Toplam Ürün",
      value: "156",
      change: "+8%",
      icon: "cube",
      color: COLORS.adminSuccess,
      bgColor: "#F0FDF4",
    },
    {
      id: 3,
      title: "Toplam Sipariş",
      value: "892",
      change: "-5%",
      icon: "cart",
      color: COLORS.adminWarning,
      bgColor: "#FFFBEB",
    },
    {
      id: 4,
      title: "Toplam Gelir",
      value: "₺125,430",
      change: "+15%",
      icon: "cash",
      color: COLORS.adminPrimary,
      bgColor: "#F5F3FF",
    },
  ];

  const menuItems = [
    {
      id: 1,
      title: "Ürün Yönetimi",
      description: "Ürünleri görüntüle ve düzenle",
      icon: "cube-outline",
      screen: "AdminProducts",
      color: COLORS.adminInfo,
    },
    {
      id: 2,
      title: "Kategori Yönetimi",
      description: "Kategorileri yönet",
      icon: "folder-outline",
      screen: "AdminCategories",
      color: COLORS.adminSuccess,
    },
    {
      id: 3,
      title: "Sipariş Yönetimi",
      description: "Siparişleri takip et",
      icon: "receipt-outline",
      screen: "AdminOrders",
      color: COLORS.adminWarning,
    },
    {
      id: 4,
      title: "Kullanıcı Yönetimi",
      description: "Kullanıcıları görüntüle",
      icon: "people-outline",
      screen: "AdminUsers",
      color: COLORS.adminPrimary,
    },
    {
      id: 5,
      title: "Ayarlar",
      description: "Sistem ayarları",
      icon: "settings-outline",
      screen: "AdminSettings",
      color: COLORS.adminTextLight,
    },
  ];

  const handleLogout = () => {
    adminLogout();
    navigation.replace("ProfileScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hoş geldiniz,</Text>
            <Text style={styles.userName}>{adminUser?.name || "Admin"}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={COLORS.adminDanger}
            />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View
              key={stat.id}
              style={[
                styles.statCard,
                index % 2 === 0 ? styles.statCardLeft : styles.statCardRight,
              ]}
            >
              <View
                style={[styles.statIcon, { backgroundColor: stat.bgColor }]}
              >
                <Ionicons name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <View style={styles.statChange}>
                <Ionicons
                  name={
                    stat.change.startsWith("+")
                      ? "trending-up"
                      : "trending-down"
                  }
                  size={14}
                  color={
                    stat.change.startsWith("+")
                      ? COLORS.adminSuccess
                      : COLORS.adminDanger
                  }
                />
                <Text
                  style={[
                    styles.statChangeText,
                    {
                      color: stat.change.startsWith("+")
                        ? COLORS.adminSuccess
                        : COLORS.adminDanger,
                    },
                  ]}
                >
                  {stat.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Yönetim Menüsü</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={COLORS.adminTextLight}
              />
            </TouchableOpacity>
          ))}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.adminTextLight,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.adminText,
    marginTop: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardLeft: {
    width: (width - 40) / 2,
    marginRight: 8,
  },
  statCardRight: {
    width: (width - 40) / 2,
    marginLeft: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.adminText,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.adminTextLight,
    marginBottom: 8,
  },
  statChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  menuContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.adminText,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.adminText,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: COLORS.adminTextLight,
  },
});
