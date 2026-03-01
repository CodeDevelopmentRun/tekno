import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { FavoriteContext } from "../../context/FavoriteContext";

export default function ProductCard({ product, onPress }) {
  const { isDarkMode, colors } = useTheme();
  const { isFavorite, toggleFavorite } = useContext(FavoriteContext);
  const fav = isFavorite(product._id);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.cardBorder },
      ]}
      onPress={() => onPress && onPress(product)}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              product.images?.[0] ||
              "https://picsum.photos/200?random=" + product._id,
          }}
          style={styles.image}
        />
        {product.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-%{product.discount}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.favBtn,
            {
              backgroundColor: isDarkMode
                ? "rgba(0,0,0,0.5)"
                : "rgba(255,255,255,0.9)",
            },
          ]}
          onPress={() => toggleFavorite(product._id)}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={18}
            color={fav ? "#EF4444" : "#9CA3AF"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.brand, { color: colors.textTertiary }]}>
          {product.brand}
        </Text>
        <Text
          style={[styles.name, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={[styles.rating, { color: colors.textPrimary }]}>
            {product.rating?.toFixed(1) || "0.0"}
          </Text>
          <Text style={[styles.reviews, { color: colors.textTertiary }]}>
            ({product.reviewCount || 0})
          </Text>
        </View>
        <View style={styles.priceRow}>
          {product.oldPrice && (
            <Text style={[styles.oldPrice, { color: colors.textTertiary }]}>
              {product.oldPrice.toLocaleString()} TL
            </Text>
          )}
          <Text style={styles.price}>{product.price?.toLocaleString()} TL</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    borderRadius: 16,
    marginRight: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageContainer: { position: "relative" },
  image: { width: "100%", height: 150, resizeMode: "cover" },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: { color: "#FFF", fontSize: 11, fontWeight: "bold" },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  info: { padding: 12 },
  brand: { fontSize: 11, marginBottom: 3 },
  name: { fontSize: 13, fontWeight: "600", marginBottom: 6, lineHeight: 18 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 3,
  },
  rating: { fontSize: 12, fontWeight: "600" },
  reviews: { fontSize: 11 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  oldPrice: { fontSize: 12, textDecorationLine: "line-through" },
  price: { fontSize: 15, fontWeight: "bold", color: "#10B981" },
});
