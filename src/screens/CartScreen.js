import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { CartContext } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useContext(CartContext);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const ts = isDarkMode ? "#DDDDDD" : "#374151";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleClearCart = () => {
    Alert.alert("Sepeti Temizle", "Tüm ürünler sepetten kaldırılacak.", [
      { text: "İptal", style: "cancel" },
      { text: "Temizle", style: "destructive", onPress: clearCart },
    ]);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        { backgroundColor: cardBg, borderColor: cardBorder },
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetail", { productId: item.product._id })
        }
      >
        <Image
          source={{
            uri:
              item.product?.images?.[0] ||
              "https://picsum.photos/200?random=" + item.product?._id,
          }}
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.brand, { color: colors.primary }]}>
          {item.product?.brand}
        </Text>
        <Text style={[styles.name, { color: tp }]} numberOfLines={2}>
          {item.product?.name}
        </Text>
        <Text style={styles.price}>
          {(item.price * item.quantity).toLocaleString()} TL
        </Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={[
              styles.qtyBtn,
              { backgroundColor: colors.background, borderColor: cardBorder },
            ]}
            onPress={() => {
              if (item.quantity <= 1) removeFromCart(item._id);
              else updateQuantity(item._id, item.quantity - 1);
            }}
          >
            <Ionicons
              name={item.quantity <= 1 ? "trash-outline" : "remove"}
              size={16}
              color={item.quantity <= 1 ? "#EF4444" : tp}
            />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: tp }]}>{item.quantity}</Text>
          <TouchableOpacity
            style={[
              styles.qtyBtn,
              { backgroundColor: colors.background, borderColor: cardBorder },
            ]}
            onPress={() => updateQuantity(item._id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={tp} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFromCart(item._id)}
      >
        <Ionicons name="close" size={20} color={tm} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: tp }]}>Sepetim</Text>
          {cartItems.length > 0 && (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearText}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

        {cartItems.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={80} color={tm} />
            <Text style={[styles.emptyTitle, { color: tp }]}>
              Sepetiniz boş
            </Text>
            <Text style={[styles.emptySubtitle, { color: tm }]}>
              Ürünleri sepete ekleyerek alışverişe başla
            </Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate("Ana Sayfa")}
            >
              <Text style={styles.shopBtnText}>Alışverişe Başla</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
            <View
              style={[
                styles.bottomBar,
                { backgroundColor: colors.background, borderColor: cardBorder },
              ]}
            >
              <View>
                <Text style={[styles.totalLabel, { color: tm }]}>
                  Toplam Tutar
                </Text>
                <Text style={[styles.totalPrice, { color: tp }]}>
                  {total.toLocaleString()} TL
                </Text>
              </View>
              <TouchableOpacity style={styles.checkoutBtn}>
                <Text style={styles.checkoutText}>Siparişi Tamamla</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
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
  title: { fontSize: 26, fontWeight: "bold" },
  clearText: { color: "#EF4444", fontSize: 14, fontWeight: "600" },
  list: { padding: 20, gap: 14 },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  image: { width: 100, height: 110, resizeMode: "cover" },
  info: { flex: 1, padding: 12 },
  brand: { fontSize: 11, fontWeight: "600", marginBottom: 3 },
  name: { fontSize: 14, fontWeight: "600", marginBottom: 6, lineHeight: 20 },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
    marginBottom: 10,
  },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: { padding: 10 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyTitle: { fontSize: 22, fontWeight: "bold" },
  emptySubtitle: { fontSize: 15, textAlign: "center" },
  shopBtn: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  shopBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
  },
  totalLabel: { fontSize: 13, marginBottom: 4 },
  totalPrice: { fontSize: 22, fontWeight: "bold" },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  checkoutText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
