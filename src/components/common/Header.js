import React from "react";
import { View, Text, StyleSheet } from "react-native";
// react-native yerine buradan import ediyoruz:
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../utils/colors";

const Header = () => {
  return (
    /* edges={["top"]} sayesinde sadece üstten güvenli boşluk bırakır */
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.header}>
        <AntDesign name="plus" size={24} color="black" />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Vatan</Text>
          <Text style={styles.subTitle}>BİLGİSAYAR</Text>
        </View>

        <Ionicons name="heart-outline" size={28} color="black" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // SafeAreaView için arka plan rengi ekledik
  safeArea: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  header: {
    height: 60, // SafeArea kullandığımız için yüksekliği biraz azalttık
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  subTitle: {
    fontSize: 8,
    letterSpacing: 1,
    color: COLORS.primary,
  },
});

export default Header;
