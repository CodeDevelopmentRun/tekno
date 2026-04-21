import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const getApiUrl = () => {
  if (Platform.OS === "android" && !Constants.isDevice) {
    return "http://10.0.2.2:5000";
  }
  return "http://10.72.10.90:5000";
};
const API_URL = getApiUrl();

const STATUS_LABELS = {
  processing: {
    label: "Hazırlanıyor",
    color: "#F59E0B",
    icon: "time-outline",
    step: 0,
  },
  in_transit: {
    label: "Transfer Sürecinde",
    color: "#8B5CF6",
    icon: "bus-outline",
    step: 1,
  },
  at_branch: {
    label: "Şubede",
    color: "#3B82F6",
    icon: "business-outline",
    step: 2,
  },
  out_for_delivery: {
    label: "Dağıtımda",
    color: "#F97316",
    icon: "bicycle-outline",
    step: 3,
  },
  delivered: {
    label: "Teslim Edildi",
    color: "#10B981",
    icon: "checkmark-circle-outline",
    step: 4,
  },
};

const NEXT_ACTION = {
  processing: {
    nextStatus: "in_transit",
    label: "Transfer Sürecine Al",
    color: "#8B5CF6",
    icon: "bus-outline",
  },
  in_transit: {
    nextStatus: "at_branch",
    label: "Şubeye Teslim Edildi",
    color: "#3B82F6",
    icon: "business-outline",
  },
  at_branch: {
    nextStatus: "out_for_delivery",
    label: "Dağıtıma Çıkar",
    color: "#F97316",
    icon: "bicycle-outline",
  },
  out_for_delivery: {
    nextStatus: "delivered",
    label: "Teslim Edildi",
    color: "#10B981",
    icon: "checkmark-circle-outline",
  },
};

const STEPS = [
  { key: "processing", label: "Hazırlanıyor" },
  { key: "in_transit", label: "Transfer" },
  { key: "at_branch", label: "Şubede" },
  { key: "out_for_delivery", label: "Dağıtımda" },
  { key: "delivered", label: "Teslim Edildi" },
];

export default function KargocuDashboardScreen({ navigation }) {
  const [tab, setTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [courierName, setCourierName] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadUser();
    fetchOrders();
  }, [tab]);

  const loadUser = async () => {
    const raw = await AsyncStorage.getItem("courierUser");
    if (raw) setCourierName(JSON.parse(raw).name);
  };

  const getToken = async () => AsyncStorage.getItem("courierToken");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const endpoint =
        tab === "active"
          ? "/api/courier/orders"
          : "/api/courier/orders/delivered";
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(data);
    } catch (err) {
      Alert.alert("Hata", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab]);

  const updateStatus = async (orderId, newStatus) => {
    const actionLabel =
      NEXT_ACTION[orders.find((o) => o._id === orderId)?.status]?.label;
    Alert.alert(
      "Durum Güncelle",
      `Sipariş "${actionLabel}" olarak işaretlensin mi?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Evet",
          onPress: async () => {
            setUpdating(orderId);
            try {
              const token = await getToken();
              const res = await fetch(
                `${API_URL}/api/courier/orders/${orderId}/status`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ status: newStatus }),
                },
              );
              const data = await res.json();
              if (!res.ok) throw new Error(data.message);
              fetchOrders();
            } catch (err) {
              Alert.alert("Hata", err.message);
            } finally {
              setUpdating(null);
            }
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("courierToken");
    await AsyncStorage.removeItem("courierUser");
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  const renderStepper = (currentStatus) => {
    const currentStep = STATUS_LABELS[currentStatus]?.step ?? 0;
    return (
      <View style={s.stepperContainer}>
        {STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;
          const isLast = index === STEPS.length - 1;

          return (
            <View key={step.key} style={s.stepRow}>
              <View style={s.stepLeft}>
                <View
                  style={[
                    s.stepDot,
                    isDone && s.stepDotDone,
                    isActive && s.stepDotActive,
                    isPending && s.stepDotPending,
                  ]}
                >
                  {isDone ? (
                    <Ionicons name="checkmark" size={11} color="#fff" />
                  ) : isActive ? (
                    <View style={s.stepDotInner} />
                  ) : null}
                </View>
                {!isLast && (
                  <View style={[s.stepLine, isDone && s.stepLineDone]} />
                )}
              </View>
              <Text
                style={[
                  s.stepLabel,
                  isDone && s.stepLabelDone,
                  isActive && s.stepLabelActive,
                  isPending && s.stepLabelPending,
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderOrder = ({ item }) => {
    const st = STATUS_LABELS[item.status] || {};
    const action = NEXT_ACTION[item.status];

    return (
      <View style={s.card}>
        <View style={s.cardTop}>
          <Text style={s.orderNo}>#{item.orderNumber}</Text>
          <View style={[s.badge, { backgroundColor: st.color + "22" }]}>
            <Ionicons name={st.icon} size={13} color={st.color} />
            <Text style={[s.badgeText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>

        <View style={s.row}>
          <Ionicons name="person-outline" size={15} color="#888" />
          <Text style={s.infoText}>{item.user?.name || "—"}</Text>
        </View>
        <View style={s.row}>
          <Ionicons name="call-outline" size={15} color="#888" />
          <Text style={s.infoText}>{item.shippingAddress?.phone || "—"}</Text>
        </View>
        <View style={s.row}>
          <Ionicons name="location-outline" size={15} color="#888" />
          <Text style={s.infoText}>
            {item.shippingAddress?.address}, {item.shippingAddress?.district}/
            {item.shippingAddress?.city}
          </Text>
        </View>

        <View style={s.divider} />
        {item.items.map((it, i) => (
          <Text key={i} style={s.productText}>
            • {it.name} × {it.quantity}
          </Text>
        ))}

        {tab === "active" && (
          <>
            <View style={s.divider} />
            {renderStepper(item.status)}
          </>
        )}

        {action && tab === "active" && (
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: action.color }]}
            onPress={() => updateStatus(item._id, action.nextStatus)}
            disabled={updating === item._id}
          >
            {updating === item._id ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name={action.icon} size={16} color="#fff" />
                <Text style={s.actionText}>{action.label}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Merhaba 👋</Text>
          <Text style={s.name}>{courierName}</Text>
        </View>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.removeItem("courierToken");
            await AsyncStorage.removeItem("courierUser");
            navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
          }}
          style={s.logoutBtn}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="log-out-outline" size={26} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <View style={s.tabs}>
        <TouchableOpacity
          style={[s.tabBtn, tab === "active" && s.tabActive]}
          onPress={() => setTab("active")}
        >
          <Text style={[s.tabText, tab === "active" && s.tabTextActive]}>
            Aktif Teslimatlar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === "delivered" && s.tabActive]}
          onPress={() => setTab("delivered")}
        >
          <Text style={[s.tabText, tab === "delivered" && s.tabTextActive]}>
            Teslim Edilenler
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 60 }}
          size="large"
          color="#FF6B35"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(i) => i._id}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders();
              }}
            />
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="cube-outline" size={56} color="#ddd" />
              <Text style={s.emptyText}>Sipariş bulunamadı</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  greeting: { fontSize: 13, color: "#888" },
  name: { fontSize: 18, fontWeight: "700", color: "#1A1A2E" },
  logoutBtn: { padding: 8 },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#FF6B35" },
  tabText: { fontSize: 14, fontWeight: "500", color: "#888" },
  tabTextActive: { color: "#FF6B35", fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  orderNo: { fontSize: 15, fontWeight: "700", color: "#1A1A2E" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 4,
  },
  infoText: { fontSize: 13, color: "#555", flex: 1 },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 10 },
  productText: { fontSize: 13, color: "#666", marginBottom: 2 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  empty: { alignItems: "center", marginTop: 80, gap: 12 },
  emptyText: { fontSize: 15, color: "#bbb" },
  stepperContainer: { paddingVertical: 4, paddingLeft: 4 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", minHeight: 36 },
  stepLeft: { alignItems: "center", width: 24, marginRight: 10 },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: { backgroundColor: "#10B981" },
  stepDotActive: {
    backgroundColor: "#FF6B35",
    borderWidth: 2,
    borderColor: "#FF6B3533",
  },
  stepDotPending: { backgroundColor: "#E5E7EB" },
  stepDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 16,
    backgroundColor: "#E5E7EB",
    marginVertical: 2,
  },
  stepLineDone: { backgroundColor: "#10B981" },
  stepLabel: { fontSize: 13, paddingTop: 2, paddingBottom: 14 },
  stepLabelDone: { color: "#10B981", fontWeight: "500" },
  stepLabelActive: { color: "#FF6B35", fontWeight: "700" },
  stepLabelPending: { color: "#9CA3AF" },
});
