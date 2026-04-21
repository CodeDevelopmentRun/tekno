import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const SORT_OPTIONS = [
  { label: "Önerilen", value: "default" },
  { label: "En Düşük Fiyat", value: "price_asc" },
  { label: "En Yüksek Fiyat", value: "price_desc" },
  { label: "En Yüksek Puan", value: "rating_desc" },
  { label: "En Çok Değerlendirilen", value: "reviews_desc" },
];

const COLOR_MAP = {
  Siyah: "#111827",
  Beyaz: "#F9FAFB",
  Gri: "#6B7280",
  Kırmızı: "#EF4444",
  Mavi: "#3B82F6",
  Lacivert: "#1E3A5F",
  Yeşil: "#10B981",
  Sarı: "#F59E0B",
  Turuncu: "#F97316",
  Mor: "#8B5CF6",
  Pembe: "#EC4899",
  Gold: "#D97706",
  Gümüş: "#9CA3AF",
  "Rose Gold": "#F4A4A4",
};

export default function ProductsByBrandScreen({ navigation, route }) {
  const { categoryName, brandName } = route.params;
  const { isDarkMode, colors } = useTheme();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortModal, setSortModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [selectedSort, setSelectedSort] = useState("default");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const bg = isDarkMode ? "#1F2937" : "#FFFFFF";
  const border = isDarkMode ? "rgba(255,255,255,0.1)" : "#F0F0F0";
  const modalBg = isDarkMode ? "#1F2937" : "#FFFFFF";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get(
        `/products/category/${encodeURIComponent(categoryName)}?brand=${encodeURIComponent(brandName)}`,
      );
      setProducts(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Dinamik filtre seçenekleri
  const availableBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))],
    [products],
  );
  const availableCategories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products],
  );
  const availableColors = useMemo(() => {
    const all = products.flatMap((p) => p.colors || []);
    return [...new Set(all)];
  }, [products]);
  const priceRanges = useMemo(() => {
    if (!products.length) return [];
    const prices = products.map((p) => p.price).filter(Boolean);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return [{ label: `${min.toLocaleString()} TL`, min, max }];
    const step = Math.ceil((max - min) / 4 / 1000) * 1000 || 1000;
    const ranges = [];
    for (let i = min; i < max; i += step) {
      ranges.push({
        label: `${i.toLocaleString()} - ${Math.min(i + step, max).toLocaleString()} TL`,
        min: i,
        max: i + step,
      });
    }
    return ranges;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (onlyInStock) result = result.filter((p) => p.stock > 0);
    if (selectedPriceRange)
      result = result.filter(
        (p) =>
          p.price >= selectedPriceRange.min &&
          p.price <= selectedPriceRange.max,
      );
    if (selectedColors.length > 0)
      result = result.filter((p) =>
        p.colors?.some((c) => selectedColors.includes(c)),
      );
    if (selectedBrands.length > 0)
      result = result.filter((p) => selectedBrands.includes(p.brand));
    if (selectedCategories.length > 0)
      result = result.filter((p) => selectedCategories.includes(p.category));
    switch (selectedSort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "reviews_desc":
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }
    return result;
  }, [
    products,
    selectedSort,
    onlyInStock,
    selectedPriceRange,
    selectedColors,
    selectedBrands,
    selectedCategories,
  ]);

  const activeFilterCount = [
    onlyInStock,
    selectedPriceRange,
    selectedColors.length > 0,
    selectedBrands.length > 0,
    selectedCategories.length > 0,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setOnlyInStock(false);
    setSelectedPriceRange(null);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedCategories([]);
  };

  const toggleItem = (list, setList, item) => {
    setList(
      list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    );
  };

  const currentSortLabel = SORT_OPTIONS.find(
    (o) => o.value === selectedSort,
  )?.label;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: bg, borderColor: border }]}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item._id })
      }
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri:
            item.images?.[0] || "https://picsum.photos/200?random=" + item._id,
        }}
        style={styles.cardImage}
      />
      <View style={styles.cardBody}>
        <Text
          style={[styles.cardBrand, { color: colors.primary }]}
          numberOfLines={1}
        >
          {item.brand}
        </Text>
        <Text style={[styles.cardName, { color: tp }]} numberOfLines={2}>
          {item.name}
        </Text>
        {item.colors?.length > 0 && (
          <View style={styles.colorDots}>
            {item.colors.slice(0, 4).map((c, i) => (
              <View
                key={i}
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: COLOR_MAP[c] || "#ccc",
                    borderColor: border,
                  },
                ]}
              />
            ))}
          </View>
        )}
        <Text style={styles.cardPrice}>{item.price?.toLocaleString()} TL</Text>
        {item.originalPrice && item.originalPrice > item.price && (
          <Text style={styles.cardOriginalPrice}>
            {item.originalPrice?.toLocaleString()} TL
          </Text>
        )}
        {item.stock === 0 && <Text style={styles.outOfStock}>Stok Yok</Text>}
      </View>
    </TouchableOpacity>
  );

  const FilterSection = ({ title, children }) => (
    <View style={styles.filterSection}>
      <Text style={[styles.filterLabel, { color: tm }]}>{title}</Text>
      {children}
    </View>
  );

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
          <Text style={[styles.title, { color: tp }]}>{brandName}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Toolbar */}
        <View
          style={[
            styles.toolbar,
            { borderBottomColor: border, backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.productCount, { color: tm }]}>
            {loading ? "Yükleniyor..." : `${filteredProducts.length} ürün`}
          </Text>
          <View style={styles.toolbarBtns}>
            <TouchableOpacity
              style={[
                styles.toolbarBtn,
                { borderColor: border, backgroundColor: bg },
              ]}
              onPress={() => setSortModal(true)}
            >
              <Ionicons
                name="swap-vertical-outline"
                size={15}
                color={colors.primary}
              />
              <Text
                style={[styles.toolbarBtnText, { color: tp }]}
                numberOfLines={1}
              >
                {currentSortLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toolbarBtn,
                {
                  borderColor: activeFilterCount > 0 ? colors.primary : border,
                  backgroundColor: bg,
                },
              ]}
              onPress={() => setFilterModal(true)}
            >
              <Ionicons
                name="options-outline"
                size={15}
                color={activeFilterCount > 0 ? colors.primary : tp}
              />
              <Text
                style={[
                  styles.toolbarBtnText,
                  { color: activeFilterCount > 0 ? colors.primary : tp },
                ]}
              >
                Filtrele
              </Text>
              {activeFilterCount > 0 && (
                <View
                  style={[styles.badge, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.badgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* İçerik */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : filteredProducts.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={60} color={tm} />
            <Text style={[styles.emptyTitle, { color: tp }]}>
              Ürün bulunamadı
            </Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity
                onPress={resetFilters}
                style={[styles.resetBtn, { borderColor: colors.primary }]}
              >
                <Text style={{ color: colors.primary, fontWeight: "600" }}>
                  Filtreleri Temizle
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Sıralama Modal */}
        <Modal
          visible={sortModal}
          transparent
          animationType="slide"
          onRequestClose={() => setSortModal(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setSortModal(false)}
          />
          <View style={[styles.sheet, { backgroundColor: modalBg }]}>
            <View style={styles.sheetHandle} />
            <Text style={[styles.sheetTitle, { color: tp }]}>Sıralama</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionRow, { borderBottomColor: border }]}
                onPress={() => {
                  setSelectedSort(opt.value);
                  setSortModal(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: opt.value === selectedSort ? colors.primary : tp },
                  ]}
                >
                  {opt.label}
                </Text>
                {opt.value === selectedSort && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Modal>

        {/* Filtre Modal */}
        <Modal
          visible={filterModal}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterModal(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setFilterModal(false)}
          />
          <View
            style={[
              styles.sheet,
              styles.tallSheet,
              { backgroundColor: modalBg },
            ]}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeaderRow}>
              <Text style={[styles.sheetTitle, { color: tp }]}>Filtrele</Text>
              {activeFilterCount > 0 && (
                <TouchableOpacity onPress={resetFilters}>
                  <Text
                    style={{
                      color: colors.primary,
                      fontWeight: "600",
                      fontSize: 14,
                    }}
                  >
                    Tümünü Temizle
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Stok */}
              <FilterSection title="STOK DURUMU">
                <TouchableOpacity
                  style={[styles.optionRow, { borderBottomColor: border }]}
                  onPress={() => setOnlyInStock(!onlyInStock)}
                >
                  <Text style={[styles.optionText, { color: tp }]}>
                    Sadece Stokta Olanlar
                  </Text>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: onlyInStock ? colors.primary : border,
                        backgroundColor: onlyInStock
                          ? colors.primary
                          : "transparent",
                      },
                    ]}
                  >
                    {onlyInStock && (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    )}
                  </View>
                </TouchableOpacity>
              </FilterSection>

              {/* Fiyat Aralığı */}
              {priceRanges.length > 0 && (
                <FilterSection title="FİYAT ARALIĞI">
                  {priceRanges.map((range, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[styles.optionRow, { borderBottomColor: border }]}
                      onPress={() =>
                        setSelectedPriceRange(
                          selectedPriceRange?.min === range.min ? null : range,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color:
                              selectedPriceRange?.min === range.min
                                ? colors.primary
                                : tp,
                          },
                        ]}
                      >
                        {range.label}
                      </Text>
                      {selectedPriceRange?.min === range.min && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </FilterSection>
              )}

              {/* Renkler */}
              {availableColors.length > 0 && (
                <FilterSection title="RENK">
                  <View style={styles.colorFilterRow}>
                    {availableColors.map((color) => {
                      const isSelected = selectedColors.includes(color);
                      return (
                        <TouchableOpacity
                          key={color}
                          style={[
                            styles.colorFilterChip,
                            {
                              borderColor: isSelected ? colors.primary : border,
                              backgroundColor: isSelected
                                ? colors.primary + "15"
                                : bg,
                            },
                          ]}
                          onPress={() =>
                            toggleItem(selectedColors, setSelectedColors, color)
                          }
                        >
                          <View
                            style={[
                              styles.colorFilterDot,
                              {
                                backgroundColor: COLOR_MAP[color] || "#ccc",
                                borderColor: border,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              styles.colorFilterText,
                              { color: isSelected ? colors.primary : tp },
                            ]}
                          >
                            {color}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </FilterSection>
              )}

              {/* Markalar */}
              {availableBrands.length > 1 && (
                <FilterSection title="MARKA">
                  <View style={styles.chipRow}>
                    {availableBrands.map((brand) => {
                      const isSelected = selectedBrands.includes(brand);
                      return (
                        <TouchableOpacity
                          key={brand}
                          style={[
                            styles.chip,
                            {
                              borderColor: isSelected ? colors.primary : border,
                              backgroundColor: isSelected
                                ? colors.primary + "15"
                                : bg,
                            },
                          ]}
                          onPress={() =>
                            toggleItem(selectedBrands, setSelectedBrands, brand)
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              { color: isSelected ? colors.primary : tp },
                            ]}
                          >
                            {brand}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </FilterSection>
              )}

              {/* Kategoriler */}
              {availableCategories.length > 1 && (
                <FilterSection title="KATEGORİ">
                  <View style={styles.chipRow}>
                    {availableCategories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.chip,
                            {
                              borderColor: isSelected ? colors.primary : border,
                              backgroundColor: isSelected
                                ? colors.primary + "15"
                                : bg,
                            },
                          ]}
                          onPress={() =>
                            toggleItem(
                              selectedCategories,
                              setSelectedCategories,
                              cat,
                            )
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              { color: isSelected ? colors.primary : tp },
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </FilterSection>
              )}
            </ScrollView>

            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={() => setFilterModal(false)}
            >
              <Text style={styles.applyBtnText}>
                Uygula{" "}
                {activeFilterCount > 0 ? `(${activeFilterCount} filtre)` : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
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
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  productCount: { fontSize: 13 },
  toolbarBtns: { flexDirection: "row", gap: 8 },
  toolbarBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  toolbarBtnText: { fontSize: 13, fontWeight: "600" },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
  listContent: { padding: 16 },
  row: { justifyContent: "space-between" },
  card: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  cardImage: { width: "100%", height: CARD_WIDTH, resizeMode: "cover" },
  cardBody: { padding: 10, gap: 3 },
  cardBrand: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardName: { fontSize: 13, fontWeight: "600", lineHeight: 18 },
  colorDots: { flexDirection: "row", gap: 4, marginVertical: 4 },
  colorDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  cardPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#10B981",
    marginTop: 2,
  },
  cardOriginalPrice: {
    fontSize: 12,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },
  outOfStock: {
    fontSize: 11,
    color: "#EF4444",
    fontWeight: "600",
    marginTop: 2,
  },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  resetBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: "60%",
  },
  tallSheet: { maxHeight: "85%" },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  optionText: { fontSize: 15 },
  filterSection: { marginBottom: 20 },
  filterLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  // Renk filtreleri
  colorFilterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  colorFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  colorFilterDot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1 },
  colorFilterText: { fontSize: 13, fontWeight: "500" },
  // Chip (marka & kategori)
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipText: { fontSize: 13, fontWeight: "500" },
  applyBtn: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  applyBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});
