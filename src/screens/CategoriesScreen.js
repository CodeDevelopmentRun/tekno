import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

const CATEGORIES = [
  {
    name: "Telefon",
    image:
      "https://wp.oggusto.com/wp-content/uploads/2025/01/en-son-cikan-telefon-modelleri.webp",
  },
  {
    name: "Bilgisayar",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZAR8PgV8nZu7NSuxqGUt23hixSBDSv9Bfg&s",
  },
  {
    name: "Bilgisayar Parçaları",
    image:
      "https://iis-akakce.akamaized.net/p.z?https%3A%2F%2Fimage01%2Eidefix%2Ecom%2Fresize%2F500%2F500%2Fproduct%2F1688079%2Fintel%2Di5%2D10400%2D8gb%2D240gb%2Dssd%2D24%2Dmonitorlu%2Dev%2Dve%2Dofis%2Dbilgisayari%2Dbusiness%2D66c3a2bd219fe%2Ejpg",
  },
  {
    name: "Tablet",
    image:
      "https://cdn.dsmcdn.com/mnresize/400/-/ty1742/product/media/images/prod/PIM/20250903/14/f60ddc0e-246f-4647-9fb8-7e95e786a858/1_org_zoom.jpg",
  },
  { name: "Kamera", image: "https://www.alkatek.net/myimages/gkc.jpg" },
  {
    name: "TV & Ev Elektroniği",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TDOIgQediE_xGA0c63B_8zR_8I6bHhxu7A&s",
  },
  {
    name: "Kulaklık & Ses",
    image:
      "https://www.teknomaster38.com.tr/images/product/4646633923600-26-3521908883354-748-p9-bluetooth-kulaklik-bluetoothlu-kulaklik-cesitleri-222-13-B.jpg",
  },
  {
    name: "Akıllı Saat & Bileklik",
    image:
      "https://www.tumsarf.com/image/cache/catalog/urunler/akilli-saat/c1-bileklik/a3-2-750x550.jpg",
  },
  {
    name: "Ofis",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTB0U_GXKG03twaJWt2EowAIFxTwYDfYWwyw&s",
  },
  {
    name: "Kırtasiye & Aksesuar",
    image:
      "https://tr.widenyrack.org/uploads/202324644/small/cute-office-organizer-sets3389c4e2-b923-419a-b045-21d6dd561127.jpg?size=360x0",
  },
  {
    name: "Oyun & Hobi",
    image:
      "https://www.senetsepet.com/idea/jz/77/myassets/products/571/202400007.jpg?revision=1768662450",
  },
  {
    name: "Elektrikli Ev Aletleri",
    image:
      "https://www.tgrthaber.com/mavikadin/wp-content/uploads/2024/09/elektrik-canavarlari-olarak-biliniyorlar-faturayi-sisiriyorlar-iste-en-cok-yakan-10-ev-aleti.jpg",
  },
  {
    name: "Kişisel Bakım Ürünleri",
    image:
      "https://www.buseterim.com.tr/upload/default/2021/1/27/sacmasas7.jpg",
  },
  {
    name: "Mutfak Aletleri",
    image:
      "https://blog.teknosa.com/wp-content/uploads/2021/10/kitchen-appliances-blender-toaster-coffee-machine-meat-ginde.jpg",
  },
  {
    name: "Drone",
    image:
      "https://www.klasfoto.com.tr/shop/rc/57/myassets/products/425/dji-mini-4k-drone-fly-more-combo.jpg?revision=1765449969",
  },
  {
    name: "Modem & Router",
    image:
      "https://www.turk.net/blog/wp-content/uploads/modem-ve-router-nedir-aralarindaki-farklar-nelerdir-2x.jpg",
  },
  {
    name: "Güç & Şarj",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_9YWNSL_Z5RH2Bw5GPK_y8spVQEh-Y0VHHQ&s",
  },
  {
    name: "Yazıcı & Tarayıcı",
    image:
      "https://www.ofisostim.com/idea/an/79/myassets/products/095/epson-l3250-yazici-tarayici-fotokopi-renkli-tankli-yazici-11729178.jpeg?revision=1708642171",
  },
];

export default function CategoriesScreen({ navigation, route }) {
  const { isDarkMode, colors } = useTheme();

  // 1. HomeScreen'den gelen searchQuery'yi başlangıç değeri olarak al
  const [searchQuery, setSearchQuery] = useState(
    route.params?.searchQuery || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ürün araması için yeni state'ler
  const [allProducts, setAllProducts] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const bg = isDarkMode ? "#111827" : "#FFFFFF";
  const border = isDarkMode ? "rgba(255,255,255,0.1)" : "#F0F0F0";

  // 2. Sayfa her açıldığında (HomeScreen'den gelindiğinde) yeni query'yi yakala
  useEffect(() => {
    if (route.params?.searchQuery) {
      setSearchQuery(route.params.searchQuery);
    }
  }, [route.params?.searchQuery]);

  // 3. searchQuery değiştiğinde ürünleri API'den çekip filtrele
  useEffect(() => {
    if (!searchQuery.trim()) {
      setAllProducts([]);
      return;
    }
    const fetchProducts = async () => {
      setLoadingSearch(true);
      try {
        const res = await api.get("/products");
        const all = res.data.data || [];
        setAllProducts(
          all.filter(
            (p) =>
              p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        );
      } catch (e) {
        console.error("Ürün arama hatası:", e);
      } finally {
        setLoadingSearch(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const filteredCategories = CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCategoryPress = (category) => {
    navigation.navigate("BrandsScreen", {
      categoryName: category.name,
      categoryImage: category.image,
    });
  };

  const loadByCategory = async (categoryName) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/products/category/${encodeURIComponent(categoryName)}`,
      );
      setProducts(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={[styles.productCard, { backgroundColor: bg, borderColor: border }]}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item._id })
      }
    >
      <Image
        source={{
          uri:
            item.images?.[0] || "https://picsum.photos/100?random=" + item._id,
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={[styles.productBrand, { color: colors.primary }]}>
          {item.brand}
        </Text>
        <Text style={[styles.productName, { color: tp }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>
          {item.price?.toLocaleString()} TL
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={tm} />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryRow,
        { borderBottomColor: border, backgroundColor: bg },
      ]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <Text style={[styles.categoryName, { color: tp }]}>{item.name}</Text>
      <Ionicons name="chevron-forward" size={22} color={tm} />
    </TouchableOpacity>
  );

  if (selectedCategory) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.header, { borderBottomColor: border }]}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color={tp} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: tp }]}>
              {selectedCategory.name}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 40 }}
            />
          ) : products.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={60} color={tm} />
              <Text style={[styles.emptyTitle, { color: tp }]}>
                Bu kategoride ürün yok
              </Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id}
              renderItem={renderProduct}
              contentContainerStyle={{ paddingVertical: 8 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: border }]}>
          <Text style={[styles.title, { color: tp }]}>
            {searchQuery.trim() ? "Arama Sonuçları" : "Kategoriler"}
          </Text>
          {searchQuery.trim() ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close" size={26} color={tp} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons name="search-outline" size={26} color={tp} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: isDarkMode ? "#1F2937" : "#F5F5F5" },
          ]}
        >
          <Ionicons name="search-outline" size={18} color={tm} />
          <TextInput
            style={[styles.searchInput, { color: tp }]}
            placeholder="Ürün, marka veya kategori ara..."
            placeholderTextColor={tm}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={tm} />
            </TouchableOpacity>
          )}
        </View>

        {/* 4. searchQuery varsa ürün listesi, yoksa kategori listesi göster */}
        {searchQuery.trim() ? (
          loadingSearch ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: 40 }}
            />
          ) : allProducts.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={60} color={tm} />
              <Text style={[styles.emptyTitle, { color: tp }]}>
                Ürün bulunamadı
              </Text>
              <Text style={[styles.emptySubtitle, { color: tm }]}>
                "{searchQuery}" için sonuç yok
              </Text>
            </View>
          ) : (
            <FlatList
              data={allProducts}
              keyExtractor={(item) => item._id}
              renderItem={renderProduct}
              contentContainerStyle={{ paddingVertical: 8 }}
              showsVerticalScrollIndicator={false}
            />
          )
        ) : (
          <FlatList
            data={filteredCategories}
            keyExtractor={(item) => item.name}
            renderItem={renderCategoryItem}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  categoryImage: {
    width: 72,
    height: 72,
    borderRadius: 8,
    resizeMode: "cover",
    marginRight: 16,
  },
  categoryName: { flex: 1, fontSize: 16, fontWeight: "600" },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  productImage: { width: 70, height: 70, borderRadius: 8, resizeMode: "cover" },
  productInfo: { flex: 1, marginLeft: 12 },
  productBrand: { fontSize: 11, fontWeight: "600" },
  productName: { fontSize: 13, fontWeight: "600", marginVertical: 3 },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#10B981" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "600" },
  emptySubtitle: { fontSize: 13 },
});
