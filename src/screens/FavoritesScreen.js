import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { FavoriteContext } from "../context/FavoriteContext";

export default function FavoritesScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();
  const { favorites, toggleFavorite } = useContext(FavoriteContext);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const ts = isDarkMode ? "#DDDDDD" : "#374151";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: cardBg, borderColor: cardBorder },
      ]}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item._id })
      }
      activeOpacity={0.85}
    >
      <Image
        source={{
          uri:
            item.images?.[0] || "https://picsum.photos/200?random=" + item._id,
        }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={[styles.brand, { color: colors.primary }]}>
          {item.brand}
        </Text>
        <Text style={[styles.name, { color: tp }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={[styles.rating, { color: tm }]}>
            {item.rating?.toFixed(1)}
          </Text>
        </View>
        <Text style={styles.price}>{item.price?.toLocaleString()} TL</Text>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => toggleFavorite(item._id)}
      >
        <Ionicons name="heart" size={22} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: tp }]}>Favorilerim</Text>
          <Text style={[styles.count, { color: tm }]}>
            {favorites.length} ürün
          </Text>
        </View>

        {favorites.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={80} color={tm} />
            <Text style={[styles.emptyTitle, { color: tp }]}>
              Favori ürün yok
            </Text>
            <Text style={[styles.emptySubtitle, { color: tm }]}>
              Beğendiğin ürünleri favorilere ekle
            </Text>
            <TouchableOpacity
              style={styles.shopBtn}
              onPress={() => navigation.navigate("Ana Sayfa")}
            >
              <Text style={styles.shopBtnText}>Alışverişe Başla</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={favorites}
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
  title: { fontSize: 26, fontWeight: "bold" },
  count: { fontSize: 14 },
  list: { padding: 20, gap: 14 },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  image: { width: 100, height: 100, resizeMode: "cover" },
  info: { flex: 1, padding: 12 },
  brand: { fontSize: 11, fontWeight: "600", marginBottom: 3 },
  name: { fontSize: 14, fontWeight: "600", marginBottom: 6, lineHeight: 20 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  rating: { fontSize: 12 },
  price: { fontSize: 16, fontWeight: "bold", color: "#10B981" },
  removeBtn: { padding: 14, justifyContent: "flex-start" },
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
});
