import React, { useState, useEffect, useContext, useRef } from "react";
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
  Modal,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { FavoriteContext } from "../context/FavoriteContext";
import { CartContext } from "../context/CartContext";
import api from "../api/axiosConfig";

const { width, height } = Dimensions.get("window");

const buildColorList = (product) => {
  const list = [];
  if (product.color) {
    list.push({
      id: "__base__",
      color: product.color,
      colorCode: product.colorCode || "#CCCCCC",
      stock: product.stock,
      images: product.images || [],
      isBase: true,
    });
  }
  (product.variants || []).forEach((v, i) => {
    list.push({
      id: `variant_${i}`,
      color: v.color,
      colorCode: v.colorCode || "#CCCCCC",
      stock: v.stock,
      images: v.images || [],
      isBase: false,
      _variant: v,
    });
  });
  return list;
};

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
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState(null);

  // Resim slider için ref
  const imageScrollRef = useRef(null);
  const modalScrollRef = useRef(null);

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
      const p = res.data.data;
      setProduct(p);
      setReviews(p?.reviews || []);
      if (p.color) {
        setSelectedColorId("__base__");
      } else if (p.variants?.length > 0) {
        setSelectedColorId("variant_0");
      }
    } catch (e) {
      Alert.alert("Hata", "Ürün yüklenemedi");
      navigation.goBack();
    } finally {
      setLoading(false);
      setReviewsLoading(false);
    }
  };

  const colorList = product ? buildColorList(product) : [];
  const selectedColor = colorList.find((c) => c.id === selectedColorId) || null;

  const activeStock = selectedColor ? selectedColor.stock : product?.stock;
  const activeImages =
    selectedColor?.images?.length > 0
      ? selectedColor.images
      : product?.images?.length > 0
        ? product.images
        : [`https://picsum.photos/400/400?random=${product?._id}`];

  const handleColorSelect = (colorItem) => {
    setSelectedColorId(colorItem.id);
    setActiveImage(0);
    // Renk değişince slider'ı başa al
    imageScrollRef.current?.scrollTo({ x: 0, animated: false });
  };

  // Swipe ile aktif resmi güncelle
  const handleImageScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveImage(index);
  };

  // Dot'a tıklanınca slider'ı o resme kaydır
  const handleDotPress = (index) => {
    setActiveImage(index);
    imageScrollRef.current?.scrollTo({ x: index * width, animated: true });
  };

  // Modal açılınca aynı resme git
  const handleOpenModal = () => {
    setImageModalVisible(true);
    setTimeout(() => {
      modalScrollRef.current?.scrollTo({
        x: activeImage * width,
        animated: false,
      });
    }, 50);
  };

  const handleModalScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveImage(index);
  };

  const handleAddToCart = async () => {
    if (colorList.length > 0 && !selectedColor) {
      Alert.alert("Uyarı", "Lütfen bir renk seçin");
      return;
    }
    try {
      setAddingToCart(true);
      const variantPayload =
        selectedColor && !selectedColor.isBase
          ? {
              color: selectedColor.color,
              colorCode: selectedColor.colorCode,
            }
          : null;

      if (addToCart) {
        await addToCart(
          product,
          selectedColor?.isBase ? null : selectedColor?._variant,
        );
      } else {
        await api.post("/cart", {
          productId: product._id,
          quantity: 1,
          variant: variantPayload,
        });
      }
      Alert.alert("Başarılı", "Ürün sepete eklendi", [
        {
          text: "Sepete Git",
          onPress: () => navigation.navigate("MainTabs", { screen: "Sepetim" }),
        },
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* TAM EKRAN FOTOĞRAF MODAL — swipe destekli */}
        <Modal
          visible={imageModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}
        >
          <StatusBar hidden />
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setImageModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>

            <ScrollView
              ref={modalScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleModalScroll}
              style={{ width, height }}
            >
              {activeImages.map((uri, i) => (
                <Image
                  key={i}
                  source={{ uri }}
                  style={{ width, height }}
                  resizeMode="contain"
                />
              ))}
            </ScrollView>

            {/* Modal dot göstergesi */}
            {activeImages.length > 1 && (
              <View style={styles.modalDots}>
                {activeImages.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.modalDot,
                      {
                        backgroundColor:
                          i === activeImage
                            ? "#FFFFFF"
                            : "rgba(255,255,255,0.4)",
                        width: i === activeImage ? 20 : 8,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </Modal>

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
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* RESİM SLİDER */}
          <View style={styles.imageWrapper}>
            <ScrollView
              ref={imageScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleImageScroll}
              scrollEventThrottle={16}
            >
              {activeImages.map((uri, i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.95}
                  onPress={handleOpenModal}
                  style={styles.imageSlide}
                >
                  <Image
                    source={{ uri }}
                    style={styles.mainImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Büyüt ikonu */}
            <TouchableOpacity
              style={styles.expandIcon}
              onPress={handleOpenModal}
            >
              <Ionicons name="expand-outline" size={20} color="#FFF" />
            </TouchableOpacity>

            {/* Resim sayacı (sağ üst) */}
            {activeImages.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {activeImage + 1} / {activeImages.length}
                </Text>
              </View>
            )}

            {/* Dot göstergesi */}
            {activeImages.length > 1 && (
              <View style={styles.dots}>
                {activeImages.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => handleDotPress(i)}>
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
            <Text style={[styles.brand, { color: colors.primary }]}>
              {product.brand}
            </Text>
            <Text style={[styles.name, { color: tp }]}>{product.name}</Text>

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

            {/* STOK */}
            <View style={styles.stockRow}>
              <View
                style={[
                  styles.stockBadge,
                  {
                    backgroundColor:
                      activeStock > 0
                        ? "rgba(16,185,129,0.1)"
                        : "rgba(239,68,68,0.1)",
                  },
                ]}
              >
                <Ionicons
                  name={activeStock > 0 ? "checkmark-circle" : "close-circle"}
                  size={14}
                  color={activeStock > 0 ? "#10B981" : "#EF4444"}
                />
                <Text
                  style={{
                    color: activeStock > 0 ? "#10B981" : "#EF4444",
                    fontSize: 13,
                    fontWeight: "600",
                    marginLeft: 4,
                  }}
                >
                  {activeStock > 0
                    ? `Stokta (${activeStock} adet)`
                    : "Stok Yok"}
                </Text>
              </View>
            </View>

            {/* RENK SEÇİCİ */}
            {colorList.length > 0 && (
              <View
                style={[
                  styles.card,
                  { backgroundColor: cardBg, borderColor: cardBorder },
                ]}
              >
                <View style={styles.colorHeader}>
                  <Text style={[styles.sectionTitle, { color: tp }]}>
                    🎨 Renk Seçin
                  </Text>
                  {selectedColor && (
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      {selectedColor.color}
                    </Text>
                  )}
                </View>

                <View style={styles.variantRow}>
                  {colorList.map((item) => {
                    const isSelected = selectedColorId === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => handleColorSelect(item)}
                        style={[
                          styles.colorBtn,
                          {
                            borderColor: isSelected
                              ? colors.primary
                              : cardBorder,
                            backgroundColor: isSelected
                              ? colors.primary + "15"
                              : "transparent",
                            opacity: item.stock === 0 ? 0.5 : 1,
                          },
                        ]}
                        disabled={item.stock === 0}
                      >
                        <View
                          style={[
                            styles.colorCircle,
                            {
                              backgroundColor: item.colorCode || "#CCCCCC",
                              borderWidth: isSelected ? 2 : 1,
                              borderColor: isSelected
                                ? colors.primary
                                : "#D1D5DB",
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.colorLabel,
                            { color: isSelected ? colors.primary : tm },
                          ]}
                        >
                          {item.color}
                        </Text>
                        {item.stock === 0 && (
                          <Text style={styles.outOfStock}>Tükendi</Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

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

            {/* KATEGORİ / MARKA */}
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

            {/* DEĞERLENDİRMELER */}
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

        {/* Footer */}
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.background, borderTopColor: cardBorder },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.favoriteBtn,
              {
                borderColor: isFavorite ? "#EF4444" : cardBorder,
                borderWidth: 1,
              },
            ]}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#EF4444" : tp}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.cartBtn,
              { backgroundColor: colors.primary },
              (addingToCart || activeStock === 0) && { opacity: 0.6 },
            ]}
            onPress={handleAddToCart}
            disabled={addingToCart || activeStock === 0}
          >
            {addingToCart ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Ionicons name="cart-outline" size={22} color="#FFF" />
                <Text style={styles.cartBtnText}>
                  {activeStock === 0 ? "Stok Yok" : "Sepete Ekle"}
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
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "absolute",
    top: 40,
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
  imageWrapper: {
    width: width,
    height: width * 1.1,
    marginTop: 110,
    backgroundColor: "#F3F4F6",
  },
  imageSlide: {
    width: width,
    height: width * 1.1,
  },
  mainImage: { width: "100%", height: "100%" },
  expandIcon: {
    position: "absolute",
    bottom: 44,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 20,
    padding: 6,
  },
  imageCounter: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCounterText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
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
  dot: { height: 8, borderRadius: 4 },
  content: { padding: 20, gap: 12 },
  brand: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: { fontSize: 20, fontWeight: "bold", lineHeight: 28 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontSize: 13, marginLeft: 4 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  price: { fontSize: 26, fontWeight: "bold" },
  originalPrice: {
    fontSize: 16,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  stockRow: { flexDirection: "row" },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  description: { fontSize: 14, lineHeight: 22 },
  colorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  variantRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  colorBtn: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 60,
  },
  colorCircle: { width: 32, height: 32, borderRadius: 16 },
  colorLabel: { fontSize: 12, fontWeight: "600" },
  outOfStock: { fontSize: 10, color: "#EF4444" },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  specKey: { fontSize: 13, flex: 1 },
  specValue: { fontSize: 13, fontWeight: "600", flex: 1, textAlign: "right" },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  favoriteBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  cartBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingBadgeText: { fontSize: 15, fontWeight: "700" },
  ratingBadgeCount: { fontSize: 13 },
  noReview: { alignItems: "center", paddingVertical: 20, gap: 8 },
  noReviewText: { fontSize: 14 },
  reviewItem: { paddingVertical: 14, gap: 8 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDots: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  modalDot: { height: 8, borderRadius: 4 },
  modalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 8,
  },
});
