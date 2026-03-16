import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert("Çıkış Yap", "Çıkış yapmak istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Çıkış Yap",
        style: "destructive",
        onPress: async () => {
          await logout();
          navigation.replace("Welcome");
        },
      },
    ]);
  };

  const stats = [
    { icon: "bag-outline", value: "24", label: "Sipariş", color: "#6366F1" },
    { icon: "heart", value: "89", label: "Favori", color: "#EC4899" },
    { icon: "star", value: "4.8", label: "Puan", color: "#F59E0B" },
  ];

  const menuSections = [
    {
      title: "HESAP",
      items: [
        {
          icon: "bag-outline",
          title: "Siparişlerim",
          subtitle: "Sipariş geçmişinizi görüntüleyin",
          color: "#6366F1",
          bgColor: "rgba(99,102,241,0.15)",
          onPress: () => navigation.navigate("Orders"), // ✅ EKLENDI
        },
        {
          icon: "location-outline",
          title: "Adreslerim",
          subtitle: "Teslimat adreslerini yönetin",
          color: "#10B981",
          bgColor: "rgba(16,185,129,0.15)",
          onPress: () => {},
        },
        {
          icon: "card-outline",
          title: "Ödeme Yöntemleri",
          subtitle: "Kartlarınızı yönetin",
          color: "#8B5CF6",
          bgColor: "rgba(139,92,246,0.15)",
          onPress: () => {},
        },
      ],
    },
    {
      title: "TERCİHLER",
      items: [
        {
          icon: "notifications-outline",
          title: "Bildirimler",
          subtitle: "Bildirim ayarları",
          color: "#F59E0B",
          bgColor: "rgba(245,158,11,0.15)",
          onPress: () => {},
        },
        {
          icon: "settings-outline",
          title: "Ayarlar",
          subtitle: "Uygulama ayarları",
          color: "#6B7280",
          bgColor: "rgba(107,114,128,0.15)",
          onPress: () => {},
        },
      ],
    },
    {
      title: "DESTEK",
      items: [
        {
          icon: "help-circle-outline",
          title: "Yardım & Destek",
          subtitle: "SSS ve iletişim",
          color: "#3B82F6",
          bgColor: "rgba(59,130,246,0.15)",
          onPress: () => {},
        },
        {
          icon: "information-circle-outline",
          title: "Hakkında",
          subtitle: "Uygulama bilgileri",
          color: "#14B8A6",
          bgColor: "rgba(20,184,166,0.15)",
          onPress: () => {},
        },
      ],
    },
  ];

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const ts = isDarkMode ? "#DDDDDD" : "#374151";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";
  const divider = isDarkMode ? "rgba(255,255,255,0.1)" : "#F0F0F0";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.backgroundOrbs, { zIndex: 0 }]}>
        <View
          style={[
            styles.orb,
            styles.orb1,
            { backgroundColor: "#6366F1", opacity: isDarkMode ? 0.15 : 0.06 },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.orb2,
            { backgroundColor: "#EC4899", opacity: isDarkMode ? 0.15 : 0.06 },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.orb3,
            { backgroundColor: "#8B5CF6", opacity: isDarkMode ? 0.15 : 0.06 },
          ]}
        />
      </View>

      <SafeAreaView style={[styles.safeArea, { zIndex: 1 }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View
            style={[
              styles.profileHeader,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <View style={styles.avatarSection}>
              <View style={styles.avatarGradient}>
                <View style={styles.avatarInner}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={56} color="#FFF" />
                  </View>
                </View>
              </View>
              <Text style={[styles.userName, { color: tp }]}>
                {user?.name || "Misafir Kullanıcı"}
              </Text>
              <Text style={[styles.userEmail, { color: ts }]}>
                {user?.email || "Giriş yapın"}
              </Text>
              {user?.role && (
                <View style={styles.roleBadge}>
                  <Ionicons
                    name={user.role === "admin" ? "shield-checkmark" : "person"}
                    size={14}
                    color="#FFF"
                  />
                  <Text style={styles.roleText}>
                    {user.role === "admin" ? "Admin" : "Kullanıcı"}
                  </Text>
                </View>
              )}
            </View>

            {user && (
              <View
                style={[styles.statsContainer, { borderTopColor: divider }]}
              >
                {stats.map((stat, i) => (
                  <View key={i} style={styles.statCard}>
                    <View
                      style={[
                        styles.statIconContainer,
                        { backgroundColor: stat.color + "25" },
                      ]}
                    >
                      <Ionicons name={stat.icon} size={24} color={stat.color} />
                    </View>
                    <Text style={[styles.statValue, { color: tp }]}>
                      {stat.value}
                    </Text>
                    <Text style={[styles.statLabel, { color: tm }]}>
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Admin Panel */}
          {user?.role === "admin" && (
            <TouchableOpacity
              style={[
                styles.adminCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(139,92,246,0.2)"
                    : "#EDE9FE",
                  borderColor: isDarkMode ? "rgba(139,92,246,0.4)" : "#C4B5FD",
                },
              ]}
              onPress={() => navigation.navigate("AdminPanel")}
              activeOpacity={0.8}
            >
              <View style={styles.adminIconCircle}>
                <Ionicons name="shield-checkmark" size={28} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.adminTitle, { color: tp }]}>
                  Admin Paneli
                </Text>
                <Text style={[styles.adminSubtitle, { color: ts }]}>
                  Yönetim ve kontrol merkezi
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}

          {/* Menu Sections */}
          {menuSections.map((section, si) => (
            <View key={si} style={styles.menuSection}>
              <Text style={[styles.sectionTitle, { color: tm }]}>
                {section.title}
              </Text>
              <View
                style={[
                  styles.menuCard,
                  { backgroundColor: cardBg, borderColor: cardBorder },
                ]}
              >
                {section.items.map((item, ii) => (
                  <TouchableOpacity
                    key={ii}
                    style={[
                      styles.menuItem,
                      ii !== section.items.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: divider,
                      },
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.menuIconCircle,
                        { backgroundColor: item.bgColor },
                      ]}
                    >
                      <Ionicons name={item.icon} size={22} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.menuTitle, { color: tp }]}>
                        {item.title}
                      </Text>
                      <Text style={[styles.menuSubtitle, { color: ts }]}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={tm} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout / Login */}
          {user ? (
            <TouchableOpacity
              style={[
                styles.logoutButton,
                {
                  borderColor: isDarkMode ? "rgba(239,68,68,0.4)" : "#FECACA",
                  backgroundColor: isDarkMode
                    ? "rgba(239,68,68,0.12)"
                    : "#FEF2F2",
                },
              ]}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
              <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
              activeOpacity={0.8}
            >
              <Ionicons name="log-in-outline" size={24} color="#FFF" />
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.versionText, { color: tm }]}>
            Tekno App v1.0.0
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundOrbs: { position: "absolute", width: "100%", height: "100%" },
  orb: { position: "absolute", borderRadius: 1000 },
  orb1: { width: 300, height: 300, top: -150, right: -100 },
  orb2: { width: 250, height: 250, bottom: 200, left: -80 },
  orb3: { width: 200, height: 200, top: 400, right: -50 },
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  profileHeader: {
    borderRadius: 28,
    padding: 28,
    marginBottom: 20,
    borderWidth: 1,
  },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatarGradient: {
    padding: 6,
    borderRadius: 100,
    backgroundColor: "#6366F1",
    marginBottom: 16,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  avatarInner: {
    padding: 3,
    borderRadius: 100,
    backgroundColor: "rgba(15,15,30,0.8)",
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(99,102,241,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  userName: { fontSize: 26, fontWeight: "bold", marginBottom: 6 },
  userEmail: { fontSize: 15, marginBottom: 14 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(236,72,153,0.25)",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(236,72,153,0.4)",
  },
  roleText: { fontSize: 14, fontWeight: "600", color: "#F472B6" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 24,
    borderTopWidth: 1,
  },
  statCard: { alignItems: "center" },
  statIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: { fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  statLabel: { fontSize: 13 },
  adminCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  adminIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(139,92,246,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  adminTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  adminSubtitle: { fontSize: 14 },
  menuSection: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 14,
    paddingLeft: 6,
  },
  menuCard: { borderRadius: 18, borderWidth: 1, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
  },
  menuIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTitle: { fontSize: 16, fontWeight: "600", marginBottom: 3 },
  menuSubtitle: { fontSize: 13 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 28,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 18,
  },
  logoutText: { color: "#EF4444", fontSize: 16, fontWeight: "600" },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
    marginBottom: 28,
    borderRadius: 18,
    backgroundColor: "#6366F1",
    paddingVertical: 18,
  },
  loginButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  versionText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
});
