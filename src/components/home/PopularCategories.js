import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const categories = [
  { id: 1, name: "Telefon", icon: "phone-portrait", color: "#FF6B35" },
  { id: 2, name: "Bilgisayar", icon: "laptop", color: "#4ECDC4" },
  { id: 3, name: "Tablet", icon: "tablet-portrait", color: "#FFE66D" },
  { id: 4, name: "Kulaklık", icon: "headset", color: "#95E1D3" },
  { id: 5, name: "Saat", icon: "watch", color: "#F38181" },
  { id: 6, name: "Kamera", icon: "camera", color: "#AA96DA" },
];

export default function PopularCategories() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity key={category.id} style={styles.categoryCard}>
          <View
            style={[styles.iconContainer, { backgroundColor: category.color }]}
          >
            <Ionicons name={category.icon} size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.categoryName}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 20,
    width: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
  },
});
