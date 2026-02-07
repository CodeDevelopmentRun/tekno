import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";

const brands = [
  { id: 1, name: "Apple", logo: "https://via.placeholder.com/80?text=Apple" },
  {
    id: 2,
    name: "Samsung",
    logo: "https://via.placeholder.com/80?text=Samsung",
  },
  { id: 3, name: "Xiaomi", logo: "https://via.placeholder.com/80?text=Xiaomi" },
  { id: 4, name: "Huawei", logo: "https://via.placeholder.com/80?text=Huawei" },
  { id: 5, name: "Sony", logo: "https://via.placeholder.com/80?text=Sony" },
  { id: 6, name: "LG", logo: "https://via.placeholder.com/80?text=LG" },
];

export default function BestSellerBrands() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {brands.map((brand) => (
        <TouchableOpacity key={brand.id} style={styles.brandCard}>
          <Image source={{ uri: brand.logo }} style={styles.brandLogo} />
          <Text style={styles.brandName}>{brand.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
  },
  brandCard: {
    width: 100,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  brandLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
  },
});
