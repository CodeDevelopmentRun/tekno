import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../utils/colors";

export default function CategoriesScreen() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Bilgisayar & Tablet",
      icon: "💻",
      color: "#2196F3",
      count: 245,
    },
    {
      id: 2,
      name: "Telefon & Aksesuar",
      icon: "📱",
      color: "#4CAF50",
      count: 389,
    },
    { id: 3, name: "TV & Görüntü", icon: "📺", color: "#FF9800", count: 156 },
    { id: 4, name: "Ses Sistemleri", icon: "🎵", color: "#9C27B0", count: 98 },
    {
      id: 5,
      name: "Giyilebilir Teknoloji",
      icon: "⌚",
      color: "#F44336",
      count: 167,
    },
    { id: 6, name: "Oyun & Konsol", icon: "🎮", color: "#00BCD4", count: 234 },
    {
      id: 7,
      name: "Fotoğraf & Kamera",
      icon: "📷",
      color: "#FF5722",
      count: 87,
    },
    { id: 8, name: "Ev & Yaşam", icon: "🏠", color: "#795548", count: 312 },
    { id: 9, name: "Beyaz Eşya", icon: "❄️", color: "#607D8B", count: 145 },
    { id: 10, name: "Klima & Isıtma", icon: "🌡️", color: "#3F51B5", count: 76 },
  ]);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { borderLeftColor: item.color }]}
      activeOpacity={0.7}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: item.color + "20" }]}
      >
        <Text style={styles.categoryIcon}>{item.icon}</Text>
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.productCount}>{item.count} Ürün</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kategoriler</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 15,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 4,
  },
  productCount: {
    fontSize: 13,
    color: COLORS.gray,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.gray,
  },
});
