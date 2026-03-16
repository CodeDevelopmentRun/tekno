import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

const STATUS = {
  pending: {
    label: "Beklemede",
    color: "#F59E0B",
    icon: "time-outline",
    step: 0,
  },
  processing: {
    label: "Hazırlanıyor",
    color: "#6366F1",
    icon: "construct-outline",
    step: 1,
  },
  in_transit: {
    label: "Transfer Sürecinde",
    color: "#8B5CF6",
    icon: "bus-outline",
    step: 2,
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
    step: 2,
  },
  shipped: {
    label: "Kargoda",
    color: "#3B82F6",
    icon: "bicycle-outline",
    step: 2,
  },
  delivered: {
    label: "Teslim Edildi",
    color: "#10B981",
    icon: "checkmark-circle-outline",
    step: 3,
  },
  cancelled: {
    label: "İptal Edildi",
    color: "#EF4444",
    icon: "close-circle-outline",
    step: -1,
  },
};

const STEPS = [
  { key: "processing", label: "Hazırlanıyor", icon: "construct-outline" },
  { key: "shipped", label: "Kargoya Verildi", icon: "bicycle-outline" },
  {
    key: "delivered",
    label: "Teslim Edildi",
    icon: "checkmark-circle-outline",
  },
];

export default function OrderDetailScreen({ route, navigation }) {
  const { orderId } = route.params;
  const { isDarkMode, colors } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const ts = isDarkMode ? "#DDDDDD" : "#374151";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";
  const divider = isDarkMode ? "rgba(255,255,255,0.1)" : "#F0F0F0";

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (e) {
      Alert.alert("Hata", "Sipariş yüklenemedi");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Siparişi İptal Et",
      "Bu siparişi iptal etmek istediğinizden emin misiniz?",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "İptal Et",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelling(true);
              await api.put(`/orders/${orderId}/cancel`);
              await fetchOrder();
            } catch (e) {
              Alert.alert(
                "Hata",
                e.response?.data?.message || "İptal edilemedi",
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!order) return null;

  const s = STATUS[order.status] || STATUS.pending;
  const currentStep = s.step;
  const isCancelled = order.status === "cancelled";
  const canCancel = ["pending", "processing"].includes(order.status);
  const isDelivered = order.status === "delivered";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: tp }]}>Sipariş Detayı</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Sipariş No & Durum */}
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <View style={styles.orderTopRow}>
              <View>
                <Text style={[styles.orderNoLabel, { color: tm }]}>
                  Sipariş No
                </Text>
                <Text style={[styles.orderNo, { color: colors.primary }]}>
                  #{order.orderNumber}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: s.color + "20" },
                ]}
              >
                <Ionicons name={s.icon} size={15} color={s.color} />
                <Text style={[styles.statusText, { color: s.color }]}>
                  {s.label}
                </Text>
              </View>
            </View>
            <Text style={[styles.dateText, { color: tm }]}>
              {new Date(order.createdAt).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          {/* Sipariş Takip */}
          {!isCancelled && (
            <View
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: tp }]}>
                📦 Sipariş Durumu
              </Text>
              <View style={styles.stepsContainer}>
                {STEPS.map((step, index) => {
                  const done = currentStep > index + 1;
                  const active = currentStep === index + 1;
                  const stepColor = done || active ? colors.primary : tm;
                  return (
                    <View key={step.key} style={styles.stepRow}>
                      <View style={styles.stepLeft}>
                        <View
                          style={[
                            styles.stepCircle,
                            {
                              backgroundColor:
                                done || active ? colors.primary : "transparent",
                              borderColor:
                                done || active ? colors.primary : cardBorder,
                            },
                          ]}
                        >
                          {done ? (
                            <Ionicons name="checkmark" size={14} color="#FFF" />
                          ) : (
                            <Ionicons
                              name={step.icon}
                              size={14}
                              color={active ? "#FFF" : tm}
                            />
                          )}
                        </View>
                        {index < STEPS.length - 1 && (
                          <View
                            style={[
                              styles.stepLine,
                              {
                                backgroundColor: done
                                  ? colors.primary
                                  : cardBorder,
                              },
                            ]}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.stepLabel,
                          {
                            color: stepColor,
                            fontWeight: active ? "700" : "400",
                          },
                        ]}
                      >
                        {step.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Ürünler */}
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: tp }]}>🛒 Ürünler</Text>
            {order.items.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.productRow,
                  i > 0 && {
                    borderTopWidth: 1,
                    borderTopColor: divider,
                    paddingTop: 14,
                  },
                ]}
              >
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                ) : (
                  <View
                    style={[
                      styles.productImagePlaceholder,
                      { backgroundColor: cardBorder },
                    ]}
                  >
                    <Ionicons name="image-outline" size={24} color={tm} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.productName, { color: tp }]}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.productQty, { color: tm }]}>
                    {item.quantity} adet × {item.price?.toLocaleString()} TL
                  </Text>

                  {/* Teslim edilmişse değerlendir butonu */}
                  {isDelivered && (
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      onPress={() =>
                        navigation.navigate("Review", {
                          productId: item.product?._id || item.product,
                          productName: item.name,
                          orderId: order._id,
                        })
                      }
                    >
                      <Ionicons name="star-outline" size={14} color="#D97706" />
                      <Text style={styles.reviewBtnText}>
                        Ürünü Değerlendir
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={[styles.productTotal, { color: tp }]}>
                  {(item.price * item.quantity).toLocaleString()} TL
                </Text>
              </View>
            ))}
          </View>

          {/* Teslimat Adresi */}
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: tp }]}>
              📍 Teslimat Adresi
            </Text>
            <Text style={[styles.addressName, { color: tp }]}>
              {order.shippingAddress?.fullName}
            </Text>
            <Text style={[styles.addressText, { color: tm }]}>
              {order.shippingAddress?.phone}
            </Text>
            <Text style={[styles.addressText, { color: tm }]}>
              {order.shippingAddress?.district}, {order.shippingAddress?.city}
            </Text>
            <Text style={[styles.addressText, { color: tm }]}>
              {order.shippingAddress?.address}
            </Text>
          </View>

          {/* Ödeme Özeti */}
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: tp }]}>
              💳 Ödeme Özeti
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: tm }]}>
                Ödeme Yöntemi
              </Text>
              <Text style={[styles.summaryValue, { color: ts }]}>
                {order.paymentMethod === "credit_card"
                  ? "Kredi Kartı"
                  : "Kapıda Ödeme"}
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: divider }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: tm }]}>
                Ara Toplam
              </Text>
              <Text style={[styles.summaryValue, { color: ts }]}>
                {order.totalPrice?.toLocaleString()} TL
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: tm }]}>Kargo</Text>
              <Text style={{ color: "#10B981", fontWeight: "600" }}>
                Ücretsiz
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: divider }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: tp }]}>Toplam</Text>
              <Text style={[styles.totalValue, { color: tp }]}>
                {order.totalPrice?.toLocaleString()} TL
              </Text>
            </View>
          </View>

          {/* İptal Butonu */}
          {canCancel && (
            <TouchableOpacity
              style={[styles.cancelBtn, cancelling && { opacity: 0.6 }]}
              onPress={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <ActivityIndicator color="#EF4444" />
              ) : (
                <>
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color="#EF4444"
                  />
                  <Text style={styles.cancelBtnText}>Siparişi İptal Et</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, gap: 10 },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderNoLabel: { fontSize: 12, marginBottom: 2 },
  orderNo: { fontSize: 20, fontWeight: "bold" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 13, fontWeight: "600" },
  dateText: { fontSize: 13 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  stepsContainer: { gap: 0 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  stepLeft: { alignItems: "center", width: 28 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLine: { width: 2, height: 32, marginTop: 2 },
  stepLabel: { fontSize: 14, paddingTop: 5, flex: 1 },
  productRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingBottom: 14,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    resizeMode: "cover",
  },
  productImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  productName: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  productQty: { fontSize: 13 },
  productTotal: { fontSize: 14, fontWeight: "700" },
  reviewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  reviewBtnText: { fontSize: 12, fontWeight: "600", color: "#D97706" },
  addressName: { fontSize: 15, fontWeight: "600" },
  addressText: { fontSize: 14 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: "500" },
  divider: { height: 1, marginVertical: 4 },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 20, fontWeight: "bold" },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "#EF4444",
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: "rgba(239,68,68,0.08)",
  },
  cancelBtnText: { color: "#EF4444", fontSize: 15, fontWeight: "600" },
});
