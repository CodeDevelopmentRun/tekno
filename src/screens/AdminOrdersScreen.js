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
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../api/axiosConfig";

const STATUS_CONFIG = {
  pending: {
    label: "Beklemede",
    color: "#F59E0B",
    bg: "#FFFBEB",
    icon: "time-outline",
  },
  processing: {
    label: "Hazırlanıyor",
    color: "#6366F1",
    bg: "#EEF2FF",
    icon: "construct-outline",
  },
  in_transit: {
    label: "Transfer'de",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    icon: "swap-horizontal-outline",
  },
  at_branch: {
    label: "Şubede",
    color: "#0EA5E9",
    bg: "#F0F9FF",
    icon: "business-outline",
  },
  out_for_delivery: {
    label: "Dağıtımda",
    color: "#F97316",
    bg: "#FFF7ED",
    icon: "bicycle-outline",
  },
  shipped: {
    label: "Kargoya Verildi",
    color: "#3B82F6",
    bg: "#EFF6FF",
    icon: "cube-outline",
  },
  delivered: {
    label: "Teslim Edildi",
    color: "#10B981",
    bg: "#F0FDF4",
    icon: "checkmark-circle-outline",
  },
  cancelled: {
    label: "İptal Edildi",
    color: "#EF4444",
    bg: "#FEF2F2",
    icon: "close-circle-outline",
  },
};

const FILTER_TABS = [
  { key: "all", label: "Tümü" },
  { key: "pending", label: "Beklemede" },
  { key: "processing", label: "Hazırlanıyor" },
  { key: "shipped", label: "Kargoda" },
  { key: "delivered", label: "Teslim" },
  { key: "cancelled", label: "İptal" },
];

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [detailModal, setDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const { data } = await api.get("/admin/orders");
      setOrders(data);
    } catch (err) {
      Alert.alert("Hata", "Siparişler yüklenemedi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    let result = orders;
    if (activeTab !== "all")
      result = result.filter((o) => o.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber?.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [orders, activeTab, search]);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    try {
      setUpdatingStatus(true);
      const { data } = await api.put(
        `/admin/orders/${selectedOrder._id}/status`,
        { status: newStatus },
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? data.order : o)),
      );
      setSelectedOrder(data.order);
      setStatusModal(false);
      Alert.alert("Başarılı", "Sipariş durumu güncellendi.");
    } catch {
      Alert.alert("Hata", "Durum güncellenemedi.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const openDetail = (order) => {
    setSelectedOrder(order);
    setDetailModal(true);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const renderItem = ({ item }) => {
    const s = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openDetail(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.orderNo}>#{item.orderNumber}</Text>
            <Text style={styles.userName}>{item.user?.name || "—"}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon} size={12} color={s.color} />
            <Text style={[styles.badgeText, { color: s.color }]}>
              {s.label}
            </Text>
          </View>
        </View>

        <View style={styles.cardMid}>
          <Text style={styles.itemsText} numberOfLines={1}>
            {item.items?.map((i) => i.name).join(", ")}
          </Text>
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.totalText}>formatPrice(item.totalPrice)</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sipariş Yönetimi</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: "Toplam", value: stats.total, color: "#6366F1" },
          { label: "Bekleyen", value: stats.pending, color: "#F59E0B" },
          { label: "Teslim", value: stats.delivered, color: "#10B981" },
          { label: "İptal", value: stats.cancelled, color: "#EF4444" },
        ].map((s, i) => (
          <View key={i} style={styles.statItem}>
            <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={16}
          color="#9CA3AF"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Sipariş no, isim veya e-posta..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchOrders(true)}
                tintColor="#6366F1"
              />
            }
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons name="receipt-outline" size={60} color="#D1D5DB" />
                <Text style={styles.emptyText}>Sipariş bulunamadı</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Detail Modal */}
      <Modal
        visible={detailModal}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sipariş Detayı</Text>
              <TouchableOpacity onPress={() => setDetailModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.detailSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sipariş No</Text>
                    <Text style={styles.detailValue}>
                      #{selectedOrder.orderNumber}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tarih</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedOrder.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Müşteri</Text>
                    <Text style={styles.detailValue}>
                      {selectedOrder.user?.name || "—"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>E-posta</Text>
                    <Text style={styles.detailValue}>
                      {selectedOrder.user?.email || "—"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Durum</Text>
                    <View
                      style={[
                        styles.badge,
                        {
                          backgroundColor: (
                            STATUS_CONFIG[selectedOrder.status] ||
                            STATUS_CONFIG.pending
                          ).bg,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          {
                            color: (
                              STATUS_CONFIG[selectedOrder.status] ||
                              STATUS_CONFIG.pending
                            ).color,
                          },
                        ]}
                      >
                        {
                          (
                            STATUS_CONFIG[selectedOrder.status] ||
                            STATUS_CONFIG.pending
                          ).label
                        }
                      </Text>
                    </View>
                  </View>
                </View>

                {selectedOrder.shippingAddress && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionHeader}>Teslimat Adresi</Text>
                    <Text style={styles.addressText}>
                      {selectedOrder.shippingAddress.fullName}
                      {"\n"}
                      {selectedOrder.shippingAddress.phone}
                      {"\n"}
                      {selectedOrder.shippingAddress.address}
                      {"\n"}
                      {selectedOrder.shippingAddress.district} /{" "}
                      {selectedOrder.shippingAddress.city}
                    </Text>
                  </View>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.sectionHeader}>Ürünler</Text>
                  {selectedOrder.items?.map((item, i) => (
                    <View key={i} style={styles.productRow}>
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.name}
                      </Text>
                      <Text style={styles.productQty}>x{item.quantity}</Text>
                      <Text style={styles.productPrice}>
                        ₺{(item.price * item.quantity).toLocaleString("tr-TR")}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Toplam</Text>
                    <Text style={styles.totalValue}>
                      ₺{selectedOrder.totalPrice?.toLocaleString("tr-TR")}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.updateStatusBtn}
                  onPress={() => setStatusModal(true)}
                >
                  <Ionicons
                    name="swap-horizontal-outline"
                    size={18}
                    color="#fff"
                  />
                  <Text style={styles.updateStatusText}>Durumu Güncelle</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Status Picker Modal */}
      <Modal
        visible={statusModal}
        animationType="fade"
        transparent
        onRequestClose={() => setStatusModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: "70%" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Durum Seç</Text>
              <TouchableOpacity onPress={() => setStatusModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.statusOption,
                    selectedOrder?.status === key && {
                      backgroundColor: val.bg,
                    },
                  ]}
                  onPress={() => handleUpdateStatus(key)}
                  disabled={updatingStatus}
                >
                  <View
                    style={[styles.statusDot, { backgroundColor: val.color }]}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      {
                        color:
                          selectedOrder?.status === key ? val.color : "#374151",
                      },
                    ]}
                  >
                    {val.label}
                  </Text>
                  {selectedOrder?.status === key && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={val.color}
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  countBadge: {
    backgroundColor: "#111827",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // Stats
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: { fontSize: 20, fontWeight: "700" },
  statLbl: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  // Search
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827", padding: 0 },

  // Tabs
  tabsScroll: {
    marginTop: 12,
    maxHeight: 44,
    flexGrow: 0,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 6,
    alignItems: "center",
    paddingBottom: 2,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  tabActive: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  tabTextActive: {
    color: "#fff",
  },

  // List
  list: { padding: 16, paddingBottom: 24 },
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  orderNo: { fontSize: 15, fontWeight: "700", color: "#111827" },
  userName: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
  cardMid: { marginBottom: 8 },
  itemsText: { fontSize: 12, color: "#6B7280" },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: { fontSize: 12, color: "#9CA3AF" },
  totalText: { fontSize: 15, fontWeight: "700", color: "#111827" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: { marginTop: 12, fontSize: 14, color: "#9CA3AF" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },

  // Detail
  detailSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: { fontSize: 13, color: "#6B7280" },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    maxWidth: "60%",
    textAlign: "right",
  },
  addressText: { fontSize: 13, color: "#374151", lineHeight: 22 },
  productRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  productName: { flex: 1, fontSize: 13, color: "#374151" },
  productQty: { fontSize: 13, color: "#6B7280", marginHorizontal: 8 },
  productPrice: { fontSize: 13, fontWeight: "600", color: "#111827" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: { fontSize: 14, fontWeight: "700", color: "#111827" },
  totalValue: { fontSize: 14, fontWeight: "700", color: "#111827" },

  updateStatusBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 8,
  },
  updateStatusText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  // Status Picker
  statusOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginBottom: 4,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  statusOptionText: { fontSize: 14, fontWeight: "600" },
});
