import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const brands = [
  {
    id: 1,
    name: "Apple",
    logo: require("../../../assets/images/brands/apple.png"),
  },
  {
    id: 2,
    name: "Samsung",
    logo: require("../../../assets/images/brands/samsung.png"),
  },
  {
    id: 3,
    name: "Xiaomi",
    logo: require("../../../assets/images/brands/xiaomi.png"),
  },
  {
    id: 4,
    name: "Huawei",
    logo: require("../../../assets/images/brands/huawei.png"),
  },
  {
    id: 5,
    name: "Sony",
    logo: require("../../../assets/images/brands/sony.png"),
  },
  {
    id: 6,
    name: "LG",
    logo: require("../../../assets/images/brands/lg.png"),
  },
];

export default function BestSellerBrands() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {brands.map((brand) => (
        <TouchableOpacity
          key={brand.id}
          style={styles.brandCard}
          onPress={() => console.log(`${brand.name} tıklandı`)}
        >
          <View style={styles.logoContainer}>
            <Image
              source={brand.logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
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
    alignItems: "center",
    marginRight: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 12,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  brandName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
  },
});
