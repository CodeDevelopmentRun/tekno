import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import PopularCategories from "../components/home/PopularCategories";
import BestSellerBrands from "../components/home/BestSellerBrands";
import Slider from "../components/home/Slider";
import ProductCard from "../components/common/ProductCard";
import api from "../api/axiosConfig";

export default function HomeScreen({ navigation }) {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setFeaturedProducts(res.data.data || []);
    } catch (e) {
      console.error("Ürünler yüklenemedi:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate("Kategoriler", { searchQuery });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.backgroundOrbs}>
        <View
          style={[
            styles.orb,
            styles.orb1,
            { backgroundColor: colors.orb1, opacity: colors.orbOpacity },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.orb2,
            { backgroundColor: colors.orb2, opacity: colors.orbOpacity },
          ]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                backgroundColor: colors.headerBg,
                borderColor: colors.headerBorder,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View>
                <Text
                  style={[styles.welcomeText, { color: colors.textTertiary }]}
                >
                  En iyi teknoloji ürünleri için
                </Text>
                <Text
                  style={[styles.headerTitle, { color: colors.textPrimary }]}
                >
                  Tekno Mağaza
                </Text>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor: colors.searchBg,
                      borderColor: colors.searchBorder,
                    },
                  ]}
                  onPress={toggleTheme}
                >
                  <Ionicons
                    name={isDarkMode ? "sunny" : "moon"}
                    size={22}
                    color={isDarkMode ? "#FDE047" : "#6366F1"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.iconBtn,
                    {
                      backgroundColor: colors.searchBg,
                      borderColor: colors.searchBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={colors.textPrimary}
                  />
                  <View style={styles.notificationBadge} />
                </TouchableOpacity>
              </View>
            </View>
            {/* Search */}
            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: colors.searchBg,
                  borderColor: colors.searchBorder,
                },
              ]}
            >
              <Ionicons
                name="search-outline"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Ürün, marka ara..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleSearch}>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>

          {/* Slider */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Slider />
          </Animated.View>

          {/* Kategoriler */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                <Ionicons name="flame" size={22} color="#F59E0B" /> Popüler
                Kategoriler
              </Text>
              <TouchableOpacity
                style={[
                  styles.seeAllBtn,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(99,102,241,0.2)"
                      : "#EEF2FF",
                    borderColor: isDarkMode
                      ? "rgba(99,102,241,0.3)"
                      : "#C7D2FE",
                  },
                ]}
                onPress={() => navigation.navigate("Kategoriler")}
              >
                <Text
                  style={[styles.seeAllText, { color: colors.primaryLight }]}
                >
                  Tümü
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <PopularCategories
              onCategoryPress={(cat) =>
                navigation.navigate("Kategoriler", { category: cat })
              }
            />
          </View>

          {/* Çok Satanlar */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                <Ionicons name="star" size={22} color="#EC4899" /> Çok Satan
                Markalar
              </Text>
            </View>
            <BestSellerBrands />
          </View>

          {/* Öne Çıkan Ürünler */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                <Ionicons name="trophy" size={22} color="#10B981" /> Öne Çıkan
                Ürünler
              </Text>
              <TouchableOpacity
                style={[
                  styles.seeAllBtn,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(99,102,241,0.2)"
                      : "#EEF2FF",
                    borderColor: isDarkMode
                      ? "rgba(99,102,241,0.3)"
                      : "#C7D2FE",
                  },
                ]}
                onPress={() => navigation.navigate("Kategoriler")}
              >
                <Text
                  style={[styles.seeAllText, { color: colors.primaryLight }]}
                >
                  Tümü
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={14}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            {loadingProducts ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={{ marginTop: 20 }}
              />
            ) : featuredProducts.length === 0 ? (
              <View style={styles.noProducts}>
                <Ionicons
                  name="cube-outline"
                  size={40}
                  color={colors.textTertiary}
                />
                <Text
                  style={[
                    styles.noProductsText,
                    { color: colors.textTertiary },
                  ]}
                >
                  Henüz ürün eklenmedi
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.productsContainer}
              >
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    colors={colors}
                    isDarkMode={isDarkMode}
                    onPress={() =>
                      navigation.navigate("ProductDetail", {
                        productId: product._id,
                      })
                    }
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Kampanya */}
          <View style={[styles.section, { marginBottom: 20 }]}>
            <View
              style={[
                styles.campaignCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(99,102,241,0.15)"
                    : "#EEF2FF",
                  borderColor: isDarkMode ? "rgba(99,102,241,0.3)" : "#C7D2FE",
                },
              ]}
            >
              <View
                style={[
                  styles.campaignBadge,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(245,158,11,0.3)"
                      : "#FEF3C7",
                    borderColor: isDarkMode
                      ? "rgba(245,158,11,0.5)"
                      : "#FDE047",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: isDarkMode ? "#FDE047" : "#F59E0B" },
                  ]}
                >
                  %50'ye varan
                </Text>
              </View>
              <Text
                style={[styles.campaignTitle, { color: colors.textPrimary }]}
              >
                Yılın En Büyük İndirimi!
              </Text>
              <Text
                style={[
                  styles.campaignDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Tüm elektronik ürünlerde özel kampanya
              </Text>
              <TouchableOpacity
                style={[
                  styles.campaignButton,
                  { backgroundColor: isDarkMode ? "#FFF" : colors.primary },
                ]}
                onPress={() => navigation.navigate("Kategoriler")}
              >
                <Text
                  style={[
                    styles.campaignButtonText,
                    { color: isDarkMode ? "#6366F1" : "#FFF" },
                  ]}
                >
                  Hemen Keşfet
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={isDarkMode ? "#6366F1" : "#FFF"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundOrbs: { position: "absolute", width: "100%", height: "100%" },
  orb: { position: "absolute", borderRadius: 1000 },
  orb1: { width: 300, height: 300, top: -150, left: -100 },
  orb2: { width: 250, height: 250, bottom: -100, right: -80 },
  safeArea: { flex: 1 },
  header: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: { fontSize: 14, marginBottom: 4 },
  headerTitle: { fontSize: 26, fontWeight: "bold" },
  headerButtons: { flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#6366F1",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  seeAllText: { fontSize: 12, fontWeight: "600", marginRight: 4 },
  productsContainer: { paddingRight: 20 },
  noProducts: { alignItems: "center", paddingVertical: 30, gap: 8 },
  noProductsText: { fontSize: 14 },
  campaignCard: { borderRadius: 20, padding: 20, borderWidth: 1 },
  campaignBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
  campaignTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 6 },
  campaignDescription: { fontSize: 13, marginBottom: 14 },
  campaignButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  campaignButtonText: { fontWeight: "bold", fontSize: 13, marginRight: 6 },
});
