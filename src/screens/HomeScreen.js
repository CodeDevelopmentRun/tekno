import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import PopularCategories from "../components/home/PopularCategories";
import BestSellerBrands from "../components/home/BestSellerBrands";
import Slider from "../components/home/Slider";

export default function HomeScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Gradient Background Orbs */}
      <View style={styles.backgroundOrbs}>
        <View
          style={[
            styles.orb,
            styles.orb1,
            {
              backgroundColor: colors.orb1,
              opacity: colors.orbOpacity,
            },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.orb2,
            {
              backgroundColor: colors.orb2,
              opacity: colors.orbOpacity,
            },
          ]}
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Modern Header */}
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
                  Merhaba! 👋
                </Text>
                <Text
                  style={[styles.headerTitle, { color: colors.textPrimary }]}
                >
                  Tekno Mağaza
                </Text>
              </View>

              <View style={styles.headerButtons}>
                {/* Theme Toggle Button */}
                <TouchableOpacity
                  style={[
                    styles.themeButton,
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
                    styles.notificationButton,
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

            {/* Search Bar */}
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
              />
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.3)"
                      : "#EEF2FF",
                    borderColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.5)"
                      : "#C7D2FE",
                  },
                ]}
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Slider */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <Slider />
          </Animated.View>

          {/* Popüler Kategoriler */}
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
                  styles.seeAllButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.2)"
                      : "#EEF2FF",
                    borderColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.3)"
                      : "#C7D2FE",
                  },
                ]}
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
            <PopularCategories />
          </View>

          {/* Çok Satan Markalar */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                <Ionicons name="star" size={22} color="#EC4899" /> Çok Satan
                Markalar
              </Text>
              <TouchableOpacity
                style={[
                  styles.seeAllButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.2)"
                      : "#EEF2FF",
                    borderColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.3)"
                      : "#C7D2FE",
                  },
                ]}
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
                  styles.seeAllButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.2)"
                      : "#EEF2FF",
                    borderColor: isDarkMode
                      ? "rgba(99, 102, 241, 0.3)"
                      : "#C7D2FE",
                  },
                ]}
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
            >
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  colors={colors}
                  isDarkMode={isDarkMode}
                />
              ))}
            </ScrollView>
          </View>

          {/* Kampanya Banner */}
          <View style={styles.section}>
            <View
              style={[
                styles.campaignCard,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(99, 102, 241, 0.15)"
                    : "#EEF2FF",
                  borderColor: isDarkMode
                    ? "rgba(99, 102, 241, 0.3)"
                    : "#C7D2FE",
                },
              ]}
            >
              <View style={styles.campaignContent}>
                <View
                  style={[
                    styles.campaignBadge,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(245, 158, 11, 0.3)"
                        : "#FEF3C7",
                      borderColor: isDarkMode
                        ? "rgba(245, 158, 11, 0.5)"
                        : "#FDE047",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      {
                        color: isDarkMode ? "#FDE047" : "#F59E0B",
                      },
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
                    {
                      backgroundColor: isDarkMode ? "#FFF" : colors.primary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.campaignButtonText,
                      {
                        color: isDarkMode ? "#6366F1" : "#FFF",
                      },
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const ProductCard = ({ product, colors, isDarkMode }) => (
  <TouchableOpacity
    style={[
      styles.productCard,
      {
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
      },
    ]}
  >
    <View style={styles.productImageContainer}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          {
            backgroundColor: isDarkMode
              ? "rgba(0, 0, 0, 0.4)"
              : "rgba(255, 255, 255, 0.9)",
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Ionicons
          name="heart-outline"
          size={20}
          color={isDarkMode ? "#FFF" : "#EF4444"}
        />
      </TouchableOpacity>
      {product.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      )}
    </View>
    <View style={styles.productInfo}>
      <Text style={[styles.productBrand, { color: colors.textTertiary }]}>
        {product.brand}
      </Text>
      <Text
        style={[styles.productName, { color: colors.textPrimary }]}
        numberOfLines={2}
      >
        {product.name}
      </Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#F59E0B" />
        <Text style={[styles.ratingText, { color: colors.textPrimary }]}>
          {product.rating}
        </Text>
        <Text style={[styles.reviewCount, { color: colors.textTertiary }]}>
          ({product.reviews})
        </Text>
      </View>
      <View style={styles.priceContainer}>
        {product.oldPrice && (
          <Text style={[styles.oldPrice, { color: colors.textTertiary }]}>
            {product.oldPrice} TL
          </Text>
        )}
        <Text style={styles.price}>{product.price} TL</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const featuredProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    price: "54.999",
    oldPrice: "59.999",
    discount: 8,
    rating: 4.8,
    reviews: 234,
    image: "https://picsum.photos/200?random=1",
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    price: "49.999",
    oldPrice: "54.999",
    discount: 9,
    rating: 4.7,
    reviews: 189,
    image: "https://picsum.photos/200?random=2",
  },
  {
    id: 3,
    name: "MacBook Pro M3 14''",
    brand: "Apple",
    price: "84.999",
    rating: 4.9,
    reviews: 156,
    image: "https://picsum.photos/200?random=3",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundOrbs: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  orb: {
    position: "absolute",
    borderRadius: 1000,
  },
  orb1: {
    width: 300,
    height: 300,
    top: -150,
    left: -100,
  },
  orb2: {
    width: 250,
    height: 250,
    bottom: -100,
    right: -80,
  },
  safeArea: {
    flex: 1,
  },
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
  welcomeText: {
    fontSize: 14,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  notificationButton: {
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
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderWidth: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
    marginRight: 4,
  },
  productsContainer: {
    paddingRight: 20,
  },
  productCard: {
    width: 170,
    borderRadius: 18,
    marginRight: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  productImageContainer: {
    position: "relative",
    padding: 10,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  discountBadge: {
    position: "absolute",
    top: 18,
    left: 18,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  discountText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontSize: 11,
    marginBottom: 4,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 11,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  oldPrice: {
    fontSize: 12,
    textDecorationLine: "through",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#10B981",
  },
  campaignCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  campaignContent: {
    flex: 1,
  },
  campaignBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  campaignDescription: {
    fontSize: 13,
    marginBottom: 14,
  },
  campaignButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  campaignButtonText: {
    fontWeight: "bold",
    fontSize: 13,
    marginRight: 6,
  },
});
