import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

export default function BrandsScreen({ navigation, route }) {
  const { categoryName } = route.params;
  const { isDarkMode, colors } = useTheme();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const bg = isDarkMode ? "#111827" : "#FFFFFF";
  const border = isDarkMode ? "rgba(255,255,255,0.1)" : "#F0F0F0";

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await api.get(
        `/products/brands/${encodeURIComponent(categoryName)}`,
      );
      setBrands(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: tp }]}>{categoryName}</Text>
          <View style={{ width: 40 }} />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : brands.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="pricetag-outline" size={60} color={tm} />
            <Text style={[styles.emptyTitle, { color: tp }]}>
              Marka bulunamadı
            </Text>
          </View>
        ) : (
          <FlatList
            data={brands}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.brandRow,
                  { borderBottomColor: border, backgroundColor: bg },
                ]}
                onPress={() =>
                  navigation.navigate("ProductsByBrand", {
                    categoryName,
                    brandName: item,
                  })
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.brandIcon,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Text style={[styles.brandLetter, { color: colors.primary }]}>
                    {item.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.brandName, { color: tp }]}>{item}</Text>
                <Ionicons name="chevron-forward" size={22} color={tm} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 40 },
  title: { fontSize: 22, fontWeight: "bold" },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  brandLetter: { fontSize: 18, fontWeight: "bold" },
  brandName: { flex: 1, fontSize: 16, fontWeight: "600" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
});
