import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

const CATEGORY_ICONS = {
  Telefon: "phone-portrait-outline",
  Bilgisayar: "laptop-outline",
  Tablet: "tablet-portrait-outline",
  Kulaklık: "headset-outline",
  "Akıllı Saat": "watch-outline",
  Kamera: "camera-outline",
  TV: "tv-outline",
  Oyun: "game-controller-outline",
  Aksesuar: "bag-outline",
  Diğer: "grid-outline",
};

const CATEGORY_COLORS = [
  "#6366F1",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#EF4444",
  "#14B8A6",
  "#F97316",
  "#6B7280",
];

export default function CategoriesScreen({ navigation, route }) {
  const { isDarkMode, colors } = useTheme();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    route?.params?.category || null,
  );
  const [searchQuery, setSearchQuery] = useState(
    route?.params?.searchQuery || "",
  );
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadByCategory(selectedCategory);
    } else if (!searchQuery) {
      loadAllProducts();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (searchQuery) {
      const timeout = setTimeout(() => handleSearch(searchQuery), 500);
      return () => clearTimeout(timeout);
    } else {
      setSearchResults([]);
      if (selectedCategory) loadByCategory(selectedCategory);
      else loadAllProducts();
    }
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      const res = await api.get("/products/categories");
      setCategories(res.data.data || []);
    } catch (e) {
      console.error("Kategoriler yüklenemedi:", e);
    }
  };

  const loadAllProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadByCategory = async (category) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/products/category/${encodeURIComponent(category)}`,
      );
      setProducts(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    try {
      setSearching(true);
      const res = await api.get(
        `/products/search?q=${encodeURIComponent(query)}`,
      );
      setSearchResults(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const displayProducts = searchQuery ? searchResults : products;

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
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
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={[styles.productBrand, { color: colors.primary }]}>
          {item.brand}
        </Text>
        <Text style={[styles.productName, { color: tp }]} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#F59E0B" />
          <Text style={[styles.ratingText, { color: tm }]}>
            {item.rating?.toFixed(1) || "0.0"}
          </Text>
          <Text style={[styles.reviewText, { color: tm }]}>
            ({item.reviewCount || 0})
          </Text>
        </View>
        <View style={styles.priceRow}>
          {item.oldPrice ? (
            <Text style={[styles.oldPrice, { color: tm }]}>
              {item.oldPrice?.toLocaleString()} TL
            </Text>
          ) : null}
          <Text style={styles.price}>{item.price?.toLocaleString()} TL</Text>
          {item.stock === 0 && (
            <View style={styles.outOfStock}>
              <Text style={styles.outOfStockText}>Tükendi</Text>
            </View>
          )}
        </View>
      </View>
      {item.discount > 0 && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-%{item.discount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: tp }]}>Kategoriler</Text>
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: cardBg, borderColor: cardBorder },
          ]}
        >
          <Ionicons name="search-outline" size={20} color={tm} />
          <TextInput
            style={[styles.searchInput, { color: tp }]}
            placeholder="Ürün, marka ara..."
            placeholderTextColor={tm}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={tm} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Chips */}
        {!searchQuery && (
          <View style={styles.categoriesWrapper}>
            <FlatList
              data={[{ name: "Tümü" }, ...categories.map((c) => ({ name: c }))]}
              keyExtractor={(item) => item.name}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}
              renderItem={({ item, index }) => {
                const isSelected =
                  item.name === "Tümü"
                    ? !selectedCategory
                    : selectedCategory === item.name;
                const color =
                  CATEGORY_COLORS[(index - 1) % CATEGORY_COLORS.length];
                const icon = CATEGORY_ICONS[item.name] || "grid-outline";
                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryChip,
                      isSelected
                        ? {
                            backgroundColor:
                              item.name === "Tümü" ? "#6366F1" : color,
                            borderColor: "transparent",
                          }
                        : { backgroundColor: cardBg, borderColor: cardBorder },
                    ]}
                    onPress={() => {
                      if (item.name === "Tümü") setSelectedCategory(null);
                      else setSelectedCategory(item.name);
                    }}
                  >
                    <Ionicons
                      name={item.name === "Tümü" ? "grid" : icon}
                      size={16}
                      color={isSelected ? "#FFF" : tm}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: isSelected ? "#FFF" : tm },
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* Products */}
        {loading || searching ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : displayProducts.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={60} color={tm} />
            <Text style={[styles.emptyTitle, { color: tp }]}>
              {searchQuery ? "Sonuç bulunamadı" : "Bu kategoride ürün yok"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={displayProducts}
            keyExtractor={(item) => item._id}
            renderItem={renderProduct}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 28, fontWeight: "bold" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 48,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  categoriesWrapper: { marginBottom: 8 },
  categoriesRow: { paddingHorizontal: 20, gap: 8 },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: { fontSize: 13, fontWeight: "600" },
  productsList: { paddingHorizontal: 16, paddingBottom: 20 },
  row: { gap: 12, marginBottom: 12 },
  productCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  productImage: { width: "100%", height: 150, resizeMode: "cover" },
  productInfo: { padding: 10 },
  productBrand: { fontSize: 11, fontWeight: "600", marginBottom: 2 },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 4,
  },
  ratingText: { fontSize: 12, fontWeight: "600" },
  reviewText: { fontSize: 11 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  oldPrice: { fontSize: 11, textDecorationLine: "line-through" },
  price: { fontSize: 14, fontWeight: "bold", color: "#10B981" },
  outOfStock: {
    backgroundColor: "#EF444420",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  outOfStockText: { fontSize: 10, color: "#EF4444", fontWeight: "600" },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "600" },
});
