import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import PopularCategories from "../components/home/PopularCategories";
import BestSellerBrands from "../components/home/BestSellerBrands";
import Slider from "../components/home/Slider";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Merhaba! 👋</Text>
              <Text style={styles.headerTitle}>Tekno Mağaza</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#1C1C1E"
              />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#8E8E93" />
            <TextInput
              style={styles.searchInput}
              placeholder="Ürün, marka veya kategori ara..."
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#FF6B35" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Slider */}
        <Slider />

        {/* Popüler Kategoriler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popüler Kategoriler</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <PopularCategories />
        </View>

        {/* Çok Satan Markalar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Çok Satan Markalar</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <BestSellerBrands />
        </View>

        {/* Öne Çıkan Ürünler */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Öne Çıkan Ürünler</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productsContainer}
          >
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollView>
        </View>

        {/* Kampanyalar */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Fırsat Ürünleri</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.campaignBanner}>
            <View style={styles.campaignContent}>
              <Text style={styles.campaignBadge}>%50'ye varan</Text>
              <Text style={styles.campaignTitle}>Yılın En Büyük İndirimi!</Text>
              <Text style={styles.campaignDescription}>
                Tüm elektronik ürünlerde özel kampanya
              </Text>
              <TouchableOpacity style={styles.campaignButton}>
                <Text style={styles.campaignButtonText}>Hemen Keşfet</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: "https://via.placeholder.com/150" }}
              style={styles.campaignImage}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Product Card Component
const ProductCard = ({ product }) => (
  <TouchableOpacity style={styles.productCard}>
    <View style={styles.productImageContainer}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <TouchableOpacity style={styles.favoriteButton}>
        <Ionicons name="heart-outline" size={20} color="#FF6B35" />
      </TouchableOpacity>
      {product.discount && (
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      )}
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.productBrand}>{product.brand}</Text>
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={14} color="#FFD700" />
        <Text style={styles.ratingText}>{product.rating}</Text>
        <Text style={styles.reviewCount}>({product.reviews})</Text>
      </View>
      <View style={styles.priceContainer}>
        {product.oldPrice && (
          <Text style={styles.oldPrice}>{product.oldPrice} TL</Text>
        )}
        <Text style={styles.price}>{product.price} TL</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Sample Data
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
    image: "https://via.placeholder.com/200",
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
    image: "https://via.placeholder.com/200",
  },
  {
    id: 3,
    name: "MacBook Pro M3 14''",
    brand: "Apple",
    price: "84.999",
    rating: 4.9,
    reviews: 156,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 4,
    name: "AirPods Pro 2. Nesil",
    brand: "Apple",
    price: "8.999",
    oldPrice: "10.999",
    discount: 18,
    rating: 4.8,
    reviews: 445,
    image: "https://via.placeholder.com/200",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1C1C1E",
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#FFE5DC",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "600",
  },
  productsContainer: {
    paddingRight: 20,
  },
  productCard: {
    width: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImageContainer: {
    position: "relative",
    padding: 12,
  },
  productImage: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  productInfo: {
    padding: 12,
  },
  productBrand: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  oldPrice: {
    fontSize: 13,
    color: "#8E8E93",
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  campaignBanner: {
    flexDirection: "row",
    backgroundColor: "#FF6B35",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  campaignContent: {
    flex: 1,
  },
  campaignBadge: {
    fontSize: 12,
    color: "#FFFFFF",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
    fontWeight: "600",
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  campaignDescription: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 12,
  },
  campaignButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  campaignButtonText: {
    color: "#FF6B35",
    fontWeight: "bold",
    fontSize: 14,
  },
  campaignImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
});
