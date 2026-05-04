import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axiosConfig";

const ROLE_LABELS = {
  user: "Kullanıcı",
  admin: "Admin",
  courier: "Kurye",
};

const ROLE_COLORS = {
  user: "#6B7280",
  admin: "#2563EB",
  courier: "#D97706",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateStr) {
  if (!dateStr) return "Hiç giriş yapmadı";
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

export default function AdminUsersScreen() {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const { data } = await api.get("/admin/users");
      setUsers(data);
      setFiltered(data);
    } catch (err) {
      console.log(
        "HATA DETAYI:",
        err.response?.status,
        err.response?.data,
        err.message,
      );
      Alert.alert(
        "Hata",
        err.response?.data?.message ||
          err.message ||
          "Kullanıcılar yüklenemedi.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const q = search.toLowerCase().trim();
    if (!q) {
      setFiltered(users);
    } else {
      setFiltered(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        ),
      );
    }
  }, [search, users]);

  const handleToggleStatus = async (user) => {
    const action = user.isActive ? "pasif" : "aktif";
    Alert.alert(
      "Durum Değiştir",
      `${user.name} adlı kullanıcıyı ${action} yapmak istiyor musunuz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: async () => {
            try {
              setTogglingId(user._id);
              const { data } = await api.put(
                `/admin/users/${user._id}/toggle-status`,
                {},
              );
              setUsers((prev) =>
                prev.map((u) =>
                  u._id === user._id ? { ...u, isActive: data.isActive } : u,
                ),
              );
            } catch {
              Alert.alert("Hata", "Durum değiştirilemedi.");
            } finally {
              setTogglingId(null);
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => {
    const isToggling = togglingId === item._id;
    return (
      <View style={styles.card}>
        {/* Üst satır: Avatar + İsim/Email + Rol */}
        <View style={styles.cardTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {item.email}
            </Text>
          </View>

          <View
            style={[
              styles.roleBadge,
              { backgroundColor: ROLE_COLORS[item.role] + "18" },
            ]}
          >
            <Text style={[styles.roleText, { color: ROLE_COLORS[item.role] }]}>
              {ROLE_LABELS[item.role] || item.role}
            </Text>
          </View>
        </View>

        {/* Alt satır: Tarihler + Durum butonu */}
        <View style={styles.cardBottom}>
          <View style={styles.dateCol}>
            <Text style={styles.dateLabel}>Kayıt Tarihi</Text>
            <Text style={styles.dateValue}>{formatDate(item.createdAt)}</Text>
          </View>

          <View style={styles.dateCol}>
            <Text style={styles.dateLabel}>Son Giriş</Text>
            <Text style={styles.dateValue}>
              {formatDateTime(item.lastLogin)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.statusBtn,
              item.isActive ? styles.statusActive : styles.statusPassive,
            ]}
            onPress={() => handleToggleStatus(item)}
            disabled={isToggling}
          >
            {isToggling ? (
              <ActivityIndicator
                size="small"
                color={item.isActive ? "#16A34A" : "#DC2626"}
              />
            ) : (
              <Text
                style={[
                  styles.statusBtnText,
                  { color: item.isActive ? "#16A34A" : "#DC2626" },
                ]}
              >
                {item.isActive ? "✓ Aktif" : "✗ Pasif"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Kullanıcı Yönetimi</Text>

        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Arama */}
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="İsim veya e-posta ara..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchUsers(true)}
            tintColor="#000"
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Kullanıcı bulunamadı</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  countBadge: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: { fontSize: 14, marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: "#111827",
  },
  clearBtn: {
    fontSize: 14,
    color: "#9CA3AF",
    paddingHorizontal: 4,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  info: { flex: 1, marginRight: 8 },
  name: { fontSize: 15, fontWeight: "600", color: "#111827" },
  email: { fontSize: 12, color: "#6B7280", marginTop: 1 },
  roleBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleText: { fontSize: 11, fontWeight: "600" },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
    gap: 8,
  },
  dateCol: { flex: 1 },
  dateLabel: { fontSize: 10, color: "#9CA3AF", marginBottom: 2 },
  dateValue: { fontSize: 12, fontWeight: "500", color: "#374151" },
  statusBtn: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    minWidth: 72,
    alignItems: "center",
  },
  statusActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#16A34A",
  },
  statusPassive: {
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626",
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
});
