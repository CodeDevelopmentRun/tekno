import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { FavoriteContext } from "../context/FavoriteContext";
import { CartContext } from "../context/CartContext";
import { ProductAPI } from "../api/endpoints";

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { isDarkMode, colors } = useTheme();
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  const fav = product ? isFavorite(product._id) : false;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await ProductAPI.getById(productId);
      setProduct(res.data.data);
    } catch (e) {
      Alert.alert("Hata", "Ürün yüklenemedi");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await addToCart(product, quantity);
    setAddingToCart(false);
    if (result.success) {
      Alert.alert("Başarılı", "Ürün sepete eklendi!", [
        { text: "Alışverişe Devam", style: "cancel" },
        { text: "Sepete Git", onPress: () => navigation.navigate("Sepetim") },
      ]);
    } else {
      Alert.alert("Hata", result.message || "Sepete eklenemedi");
    }
  };

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const ts = isDarkMode ? "#DDDDDD" : "#374151";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://picsum.photos/400?random=" + product._id];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tp }]} numberOfLines={1}>
            Ürün Detayı
          </Text>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
            onPress={() => toggleFavorite(product._id)}
          >
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={22}
              color={fav ? "#EF4444" : tp}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Images */}
          <View style={styles.imageSection}>
            <Image
              source={{ uri: images[activeImage] }}
              style={styles.mainImage}
            />
            {images.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.thumbnails}
              >
                {images.map((img, i) => (
                  <TouchableOpacity key={i} onPress={() => setActiveImage(i)}>
                    <Image
                      source={{ uri: img }}
                      style={[
                        styles.thumbnail,
                        i === activeImage && styles.thumbnailActive,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.content}>
            {/* Brand & Name */}
            <Text style={[styles.brand, { color: colors.primary }]}>
              {product.brand}
            </Text>
            <Text style={[styles.name, { color: tp }]}>{product.name}</Text>

            {/* Rating */}
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons
                  key={s}
                  name={
                    s <= Math.round(product.rating) ? "star" : "star-outline"
                  }
                  size={18}
                  color="#F59E0B"
                />
              ))}
              <Text style={[styles.ratingText, { color: tm }]}>
                {product.rating?.toFixed(1)} ({product.reviewCount}{" "}
                değerlendirme)
              </Text>
            </View>

            {/* Price */}
            <View
              style={[
                styles.priceCard,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <View>
                {product.oldPrice && (
                  <Text style={[styles.oldPrice, { color: tm }]}>
                    {product.oldPrice.toLocaleString()} TL
                  </Text>
                )}
                <Text style={styles.price}>
                  {product.price?.toLocaleString()} TL
                </Text>
              </View>
              {product.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    %{product.discount} İndirim
                  </Text>
                </View>
              )}
            </View>

            {/* Stock */}
            <View style={styles.stockRow}>
              <View
                style={[
                  styles.stockDot,
                  {
                    backgroundColor: product.stock > 0 ? "#10B981" : "#EF4444",
                  },
                ]}
              />
              <Text
                style={[
                  styles.stockText,
                  { color: product.stock > 0 ? "#10B981" : "#EF4444" },
                ]}
              >
                {product.stock > 0
                  ? `Stokta var (${product.stock} adet)`
                  : "Stokta yok"}
              </Text>
            </View>

            {/* Quantity */}
            <View style={[styles.quantitySection, { borderColor: cardBorder }]}>
              <Text style={[styles.sectionLabel, { color: ts }]}>Adet</Text>
              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    { backgroundColor: cardBg, borderColor: cardBorder },
                  ]}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Ionicons name="remove" size={20} color={tp} />
                </TouchableOpacity>
                <Text style={[styles.qtyText, { color: tp }]}>{quantity}</Text>
                <TouchableOpacity
                  style={[
                    styles.qtyBtn,
                    { backgroundColor: cardBg, borderColor: cardBorder },
                  ]}
                  onPress={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                >
                  <Ionicons name="add" size={20} color={tp} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Description */}
            <View style={styles.descSection}>
              <Text style={[styles.sectionLabel, { color: ts }]}>
                Ürün Açıklaması
              </Text>
              <Text style={[styles.description, { color: tm }]}>
                {product.description}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View
          style={[
            styles.bottomBar,
            { backgroundColor: colors.background, borderColor: cardBorder },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.favBottomBtn,
              { borderColor: fav ? "#EF4444" : cardBorder },
            ]}
            onPress={() => toggleFavorite(product._id)}
          >
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={24}
              color={fav ? "#EF4444" : tm}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              product.stock === 0 && styles.disabledBtn,
            ]}
            onPress={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
          >
            {addingToCart ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="cart-outline" size={22} color="#FFF" />
                <Text style={styles.addToCartText}>
                  {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },
  imageSection: { paddingHorizontal: 20 },
  mainImage: {
    width: "100%",
    height: 280,
    borderRadius: 20,
    resizeMode: "cover",
  },
  thumbnails: { marginTop: 12 },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
    opacity: 0.6,
  },
  thumbnailActive: { opacity: 1, borderWidth: 2, borderColor: "#6366F1" },
  content: { padding: 20 },
  brand: { fontSize: 14, fontWeight: "600", marginBottom: 6, marginTop: 4 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 12, lineHeight: 30 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 16,
  },
  ratingText: { fontSize: 13, marginLeft: 4 },
  priceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  price: { fontSize: 26, fontWeight: "bold", color: "#10B981" },
  discountBadge: {
    backgroundColor: "#EF444420",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  discountText: { color: "#EF4444", fontWeight: "bold", fontSize: 14 },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  stockDot: { width: 10, height: 10, borderRadius: 5 },
  stockText: { fontSize: 14, fontWeight: "600" },
  quantitySection: { borderTopWidth: 1, paddingTop: 20, marginBottom: 20 },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  qtyText: {
    fontSize: 20,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  descSection: { marginBottom: 20 },
  description: { fontSize: 15, lineHeight: 24 },
  bottomBar: { flexDirection: "row", gap: 12, padding: 20, borderTopWidth: 1 },
  favBottomBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#6366F1",
    borderRadius: 16,
    height: 56,
  },
  disabledBtn: { backgroundColor: "#9CA3AF" },
  addToCartText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
