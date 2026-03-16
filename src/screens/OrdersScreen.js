import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

const STATUS = {
  pending: { label: "Beklemede", color: "#F59E0B", icon: "time-outline" },
  processing: {
    label: "Hazırlanıyor",
    color: "#6366F1",
    icon: "construct-outline",
  },
  shipped: { label: "Kargoda", color: "#3B82F6", icon: "bicycle-outline" },
  delivered: {
    label: "Teslim Edildi",
    color: "#10B981",
    icon: "checkmark-circle-outline",
  },
  cancelled: {
    label: "İptal Edildi",
    color: "#EF4444",
    icon: "close-circle-outline",
  },
};

export default function OrdersScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const s = STATUS[item.status] || STATUS.pending;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: cardBg, borderColor: cardBorder },
        ]}
        onPress={() =>
          navigation.navigate("OrderDetail", { orderId: item._id })
        }
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.orderNo, { color: colors.primary }]}>
            #{item.orderNumber}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: s.color + "20" }]}
          >
            <Ionicons name={s.icon} size={13} color={s.color} />
            <Text style={[styles.statusText, { color: s.color }]}>
              {s.label}
            </Text>
          </View>
        </View>

        <Text style={[styles.date, { color: tm }]}>
          {new Date(item.createdAt).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>

        <Text style={[styles.items, { color: tm }]} numberOfLines={1}>
          {item.items.map((i) => i.name).join(", ")}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={[styles.total, { color: tp }]}>
            {item.totalPrice?.toLocaleString()} TL
          </Text>
          <Ionicons name="chevron-forward" size={18} color={tm} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: tp }]}>Siparişlerim</Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator
            style={{ marginTop: 60 }}
            size="large"
            color={colors.primary}
          />
        ) : orders.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={80} color={tm} />
            <Text style={[styles.emptyTitle, { color: tp }]}>
              Henüz sipariş yok
            </Text>
            <Text style={[styles.emptySub, { color: tm }]}>
              İlk siparişinizi vermek için alışverişe başlayın
            </Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate("MainTabs")}
            >
              <Text style={styles.shopBtnText}>Alışverişe Başla</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  list: { padding: 20, gap: 14 },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 8 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNo: { fontSize: 16, fontWeight: "700" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  date: { fontSize: 13 },
  items: { fontSize: 13 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  total: { fontSize: 17, fontWeight: "bold" },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyTitle: { fontSize: 22, fontWeight: "bold" },
  emptySub: { fontSize: 15, textAlign: "center" },
  shopBtn: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  shopBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
