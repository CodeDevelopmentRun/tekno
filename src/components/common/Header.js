import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../utils/colors";

const Header = () => {
  return (
    <View style={styles.header}>
      <AntDesign name="plus" size={24} color="black" />

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Vatan</Text>
        <Text style={styles.subTitle}>BİLGİSAYAR</Text>
      </View>

      <Ionicons name="heart-outline" size={28} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
