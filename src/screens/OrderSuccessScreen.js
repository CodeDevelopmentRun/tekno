import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function OrderSuccessScreen({ navigation, route }) {
  const { isDarkMode, colors } = useTheme();
  const order = route.params?.order;

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  const statusMap = {
    pending: { label: "Beklemede", color: "#F59E0B" },
    processing: { label: "Hazırlanıyor", color: "#6366F1" },
    shipped: { label: "Kargoda", color: "#3B82F6" },
    delivered: { label: "Teslim Edildi", color: "#10B981" },
    cancelled: { label: "İptal Edildi", color: "#EF4444" },
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Başarı İkonu */}
          <View style={styles.successBox}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color="#FFF" />
            </View>
            <Text style={[styles.successTitle, { color: tp }]}>
              Siparişiniz Alındı!
            </Text>
            <Text style={[styles.successSubtitle, { color: tm }]}>
              Siparişiniz başarıyla oluşturuldu. En kısa sürede hazırlanacak.
            </Text>
            {order?.orderNumber && (
              <View
                style={[
                  styles.orderNumBox,
                  { backgroundColor: cardBg, borderColor: cardBorder },
                ]}
              >
                <Text style={[styles.orderNumLabel, { color: tm }]}>
                  Sipariş No
                </Text>
                <Text style={[styles.orderNum, { color: colors.primary }]}>
                  #{order.orderNumber}
                </Text>
              </View>
            )}
          </View>

          {/* Sipariş Detayı */}
          {order && (
            <View
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <Text style={[styles.cardTitle, { color: tp }]}>
                Sipariş Detayı
              </Text>

              {order.items?.map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.itemRow,
                    i < order.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderColor: cardBorder,
                      paddingBottom: 12,
                    },
                  ]}
                >
                  <Text
                    style={[styles.itemName, { color: tp }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.itemQty, { color: tm }]}>
                    x{item.quantity}
                  </Text>
                  <Text style={[styles.itemPrice, { color: tp }]}>
                    {(item.price * item.quantity).toLocaleString()} TL
                  </Text>
                </View>
              ))}

              <View
                style={[
                  styles.totalRow,
                  { borderTopWidth: 1, borderColor: cardBorder },
                ]}
              >
                <Text style={[styles.totalLabel, { color: tp }]}>Toplam</Text>
                <Text style={[styles.totalValue, { color: tp }]}>
                  {order.totalPrice?.toLocaleString()} TL
                </Text>
              </View>
            </View>
          )}

          {/* Teslimat Adresi */}
          {order?.shippingAddress && (
            <View
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <Text style={[styles.cardTitle, { color: tp }]}>
                📍 Teslimat Adresi
              </Text>
              <Text style={[styles.addressText, { color: tm }]}>
                {order.shippingAddress.fullName}
                {"\n"}
                {order.shippingAddress.phone}
                {"\n"}
                {order.shippingAddress.address},{"\n"}
                {order.shippingAddress.district} / {order.shippingAddress.city}
              </Text>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            { backgroundColor: colors.background, borderColor: cardBorder },
          ]}
        >
          {/* Siparişlerim Butonu - Hesabım sekmesine ve içindeki Orders'a yönlendirir */}
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={() =>
              navigation.navigate("MainTabs", {
                screen: "Hesabım",
                params: { screen: "Orders" },
              })
            }
          >
            <Ionicons name="list-outline" size={20} color="#FFF" />
            <Text style={styles.btnText}>Siparişlerim</Text>
          </TouchableOpacity>

          {/* Ana Sayfa Butonu - Doğrudan Ana Sayfa sekmesine yönlendirir */}
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: cardBorder,
              },
            ]}
            onPress={() =>
              navigation.navigate("MainTabs", { screen: "Ana Sayfa" })
            }
          >
            <Ionicons name="home-outline" size={20} color={tp} />
            <Text style={[styles.btnText, { color: tp }]}>Ana Sayfa</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, gap: 16 },
  successBox: { alignItems: "center", paddingVertical: 24, gap: 12 },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  successTitle: { fontSize: 26, fontWeight: "bold" },
  successSubtitle: { fontSize: 15, textAlign: "center", lineHeight: 22 },
  orderNumBox: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  orderNumLabel: { fontSize: 12, fontWeight: "500" },
  orderNum: { fontSize: 20, fontWeight: "bold", marginTop: 2 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, gap: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    gap: 8,
  },
  itemName: { flex: 1, fontSize: 14, fontWeight: "500" },
  itemQty: { fontSize: 13 },
  itemPrice: { fontSize: 14, fontWeight: "600" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  totalLabel: { fontSize: 15, fontWeight: "700" },
  totalValue: { fontSize: 18, fontWeight: "bold" },
  addressText: { fontSize: 14, lineHeight: 22 },
  bottomBar: { padding: 20, borderTopWidth: 1, flexDirection: "row", gap: 12 },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
