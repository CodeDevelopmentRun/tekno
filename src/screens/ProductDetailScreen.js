import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { FavoriteContext } from "../context/FavoriteContext";
import { CartContext } from "../context/CartContext";
import api from "../api/axiosConfig";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { isDarkMode, colors } = useTheme();
  const { favorites, toggleFavorite } = useContext(FavoriteContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  const isFavorite = favorites.some((f) => f._id === productId);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      setProduct(res.data.data);
      setReviews(res.data.data?.reviews || []);
    } catch (e) {
      Alert.alert("Hata", "Ürün yüklenemedi");
      navigation.goBack();
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      if (addToCart) {
        await addToCart(product);
      } else {
        await api.post("/cart", { productId: product._id, quantity: 1 });
      }
      Alert.alert("Başarılı", "Ürün sepete eklendi", [
        { text: "Sepete Git", onPress: () => navigation.navigate("Sepetim") },
        { text: "Alışverişe Devam", style: "cancel" },
      ]);
    } catch (e) {
      Alert.alert("Hata", "Sepete eklenemedi");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [`https://picsum.photos/400/400?random=${product._id}`];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
                borderWidth: 1,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={tp} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerBtn,
              {
                backgroundColor: cardBg,
                borderColor: cardBorder,
                borderWidth: 1,
              },
            ]}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#EF4444" : tp}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Ürün Görseli */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: images[activeImage] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            {images.length > 1 && (
              <View style={styles.dots}>
                {images.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => setActiveImage(i)}>
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            i === activeImage ? colors.primary : "#D1D5DB",
                          width: i === activeImage ? 20 : 8,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.content}>
            {/* Marka & İsim */}
            <Text style={[styles.brand, { color: colors.primary }]}>
              {product.brand}
            </Text>
            <Text style={[styles.name, { color: tp }]}>{product.name}</Text>

            {/* Puan */}
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={
                    star <= Math.round(product.rating || 0)
                      ? "star"
                      : "star-outline"
                  }
                  size={16}
                  color="#F59E0B"
                />
              ))}
              <Text style={[styles.ratingText, { color: tm }]}>
                {product.rating?.toFixed(1)} ({product.reviewCount || 0}{" "}
                değerlendirme)
              </Text>
            </View>

            {/* Fiyat */}
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: tp }]}>
                {product.price?.toLocaleString()} TL
              </Text>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <Text style={styles.originalPrice}>
                    {product.originalPrice?.toLocaleString()} TL
                  </Text>
                )}
            </View>

            {/* Stok Durumu */}
            <View style={styles.stockRow}>
              <View
                style={[
                  styles.stockBadge,
                  {
                    backgroundColor:
                      product.stock > 0
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(239,68,68,0.1)",
                  },
                ]}
              >
                <Ionicons
                  name={product.stock > 0 ? "checkmark-circle" : "close-circle"}
                  size={14}
                  color={product.stock > 0 ? "#10B981" : "#EF4444"}
                />
                <Text
                  style={{
                    color: product.stock > 0 ? "#10B981" : "#EF4444",
                    fontSize: 13,
                    fontWeight: "600",
                    marginLeft: 4,
                  }}
                >
                  {product.stock > 0
                    ? `Stokta (${product.stock} adet)`
                    : "Stok Yok"}
                </Text>
              </View>
            </View>

            {/* Açıklama */}
            {product.description && (
              <View
                style={[
                  styles.card,
                  { backgroundColor: cardBg, borderColor: cardBorder },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: tp }]}>
                  📋 Ürün Açıklaması
                </Text>
                <Text style={[styles.description, { color: tm }]}>
                  {product.description}
                </Text>
              </View>
            )}

            {/* Özellikler */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <View
                style={[
                  styles.card,
                  { backgroundColor: cardBg, borderColor: cardBorder },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: tp }]}>
                  🔧 Teknik Özellikler
                </Text>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <View
                    key={i}
                    style={[
                      styles.specRow,
                      i > 0 && {
                        borderTopWidth: 1,
                        borderTopColor: cardBorder,
                      },
                    ]}
                  >
                    <Text style={[styles.specKey, { color: tm }]}>{key}</Text>
                    <Text style={[styles.specValue, { color: tp }]}>
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Kategori */}
            <View
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: tm }]}>Kategori</Text>
                <Text style={[styles.infoValue, { color: tp }]}>
                  {product.category}
                </Text>
              </View>
              {product.brand && (
                <View
                  style={[
                    styles.infoRow,
                    { borderTopWidth: 1, borderTopColor: cardBorder },
                  ]}
                >
                  <Text style={[styles.infoLabel, { color: tm }]}>Marka</Text>
                  <Text style={[styles.infoValue, { color: tp }]}>
                    {product.brand}
                  </Text>
                </View>
              )}
            </View>

            {/* Değerlendirmeler */}
            <View
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <View style={styles.reviewsHeader}>
                <Text style={[styles.sectionTitle, { color: tp }]}>
                  ⭐ Değerlendirmeler
                </Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={[styles.ratingBadgeText, { color: tp }]}>
                    {product.rating?.toFixed(1) || "0.0"}
                  </Text>
                  <Text style={[styles.ratingBadgeCount, { color: tm }]}>
                    ({reviews.length})
                  </Text>
                </View>
              </View>

              {reviewsLoading ? (
                <ActivityIndicator
                  color={colors.primary}
                  style={{ marginVertical: 16 }}
                />
              ) : reviews.length === 0 ? (
                <View style={styles.noReview}>
                  <Ionicons name="chatbubble-outline" size={36} color={tm} />
                  <Text style={[styles.noReviewText, { color: tm }]}>
                    Henüz değerlendirme yok
                  </Text>
                </View>
              ) : (
                reviews.map((review, i) => (
                  <View
                    key={review._id || i}
                    style={[
                      styles.reviewItem,
                      i > 0 && {
                        borderTopWidth: 1,
                        borderTopColor: cardBorder,
                      },
                    ]}
                  >
                    <View style={styles.reviewTop}>
                      <View style={styles.reviewerInfo}>
                        <View
                          style={[
                            styles.avatar,
                            { backgroundColor: colors.primary + "30" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.avatarText,
                              { color: colors.primary },
                            ]}
                          >
                            {(review.user?.name ||
                              review.userName ||
                              "K")[0].toUpperCase()}
                          </Text>
                        </View>
                        <View>
                          <Text style={[styles.reviewerName, { color: tp }]}>
                            {review.user?.name ||
                              review.userName ||
                              "Kullanıcı"}
                          </Text>
                          <Text style={[styles.reviewDate, { color: tm }]}>
                            {new Date(review.createdAt).toLocaleDateString(
                              "tr-TR",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Ionicons
                            key={s}
                            name={s <= review.rating ? "star" : "star-outline"}
                            size={13}
                            color="#F59E0B"
                          />
                        ))}
                      </View>
                    </View>
                    {review.comment ? (
                      <Text style={[styles.reviewComment, { color: tm }]}>
                        {review.comment}
                      </Text>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          </View>
        </ScrollView>

        {/* Sepete Ekle Butonu */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.background, borderTopColor: cardBorder },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.cartBtn,
              { backgroundColor: colors.primary },
              (addingToCart || product.stock === 0) && { opacity: 0.6 },
            ]}
            onPress={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
          >
            {addingToCart ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="cart-outline" size={22} color="#FFF" />
                <Text style={styles.cartBtnText}>
                  {product.stock === 0 ? "Stok Yok" : "Sepete Ekle"}
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
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: width,
    height: width * 0.85,
    backgroundColor: "#F3F4F6",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  dots: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  brand: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  price: {
    fontSize: 26,
    fontWeight: "bold",
  },
  originalPrice: {
    fontSize: 16,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  stockRow: {
    flexDirection: "row",
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  specKey: {
    fontSize: 13,
    flex: 1,
  },
  specValue: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  cartBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingBadgeText: { fontSize: 15, fontWeight: "700" },
  ratingBadgeCount: { fontSize: 13 },
  noReview: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 8,
  },
  noReviewText: { fontSize: 14 },
  reviewItem: {
    paddingVertical: 14,
    gap: 8,
  },
  reviewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "700" },
  reviewerName: { fontSize: 14, fontWeight: "600" },
  reviewDate: { fontSize: 12, marginTop: 2 },
  reviewStars: { flexDirection: "row", gap: 2 },
  reviewComment: { fontSize: 14, lineHeight: 20 },
});
