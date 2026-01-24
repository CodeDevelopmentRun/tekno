import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLORS } from "../utils/colors";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "MacBook Air M2",
      price: 42999,
      image: "https://via.placeholder.com/150x150/EFEFEF/666666?text=MacBook",
    },
    {
      id: 2,
      name: 'iPad Pro 11"',
      price: 28999,
      image: "https://via.placeholder.com/150x150/EFEFEF/666666?text=iPad",
    },
  ]);

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>
          {item.price.toLocaleString("tr-TR")} TL
        </Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item.id)}
      >
        <Text style={styles.heartIcon}>💔</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorilerim</Text>
        <Text style={styles.itemCount}>{favorites.length} Ürün</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyText}>Favori Ürününüz Yok</Text>
          <Text style={styles.emptySubtext}>
            Beğendiğiniz ürünleri favorilere ekleyin
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.white,
  },
  itemCount: {
    fontSize: 14,
    color: COLORS.white,
  },
  listContainer: {
    padding: 15,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: COLORS.lightGray,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.black,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  addToCartButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
  },
  heartIcon: {
    fontSize: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
  },
});
