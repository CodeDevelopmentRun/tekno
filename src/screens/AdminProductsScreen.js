import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../utils/colors";
import api from "../api/axiosConfig";

const CATEGORIES = [
  // Telefon & İletişim
  "Telefon",
  "Tablet",
  "Akıllı Saat",
  "Akıllı Bileklik",
  // Bilgisayar
  "Bilgisayar",
  "Laptop",
  "Monitör",
  "Klavye & Mouse",
  "Hard Disk & SSD",
  // Ses & Görüntü
  "Kulaklık",
  "Hoparlör",
  "TV",
  "Projeksiyon",
  // Fotoğraf & Video
  "Kamera",
  "Drone",
  "Lens & Aksesuar",
  // Oyun
  "Oyun Konsolu",
  "Oyun Aksesuarı",
  "Oyun Koltuğu",
  // Ev Elektroniği
  "Robot Süpürge",
  "Akıllı Ev",
  "Klima",
  "Beyaz Eşya",
  // Ağ & İnternet
  "Modem & Router",
  "Switch & Hub",
  "Kablo & Adaptör",
  // Güç & Şarj
  "Powerbank",
  "Şarj Cihazı",
  "UPS",
  // Yazıcı & Ofis
  "Yazıcı",
  "Tarayıcı",
  "Projeksiyon",
  // Aksesuar
  "Telefon Kılıfı",
  "Ekran Koruyucu",
  "Çanta & Sırt Çantası",
];

const emptyForm = {
  name: "",
  brand: "",
  category: "",
  price: "",
  oldPrice: "",
  stock: "",
  discount: "",
  description: "",
  isBestSeller: false,
  isActive: true,
};

export default function AdminProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedImages, setSelectedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (e) {
      Alert.alert("Hata", "Ürünler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setSelectedImages([]);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      oldPrice: product.oldPrice?.toString() || "",
      stock: product.stock?.toString() || "",
      discount: product.discount?.toString() || "",
      description: product.description || "",
      isBestSeller: product.isBestSeller || false,
      isActive: product.isActive !== false,
    });
    setSelectedImages([]);
    setShowModal(true);
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("İzin gerekli", "Galeri erişimine izin verin");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5,
    });
    if (!result.canceled) {
      setSelectedImages((prev) => [
        ...prev,
        ...result.assets.map((a) => a.uri),
      ]);
    }
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageUrl) => {
    if (!editProduct) return;
    Alert.alert("Fotoğrafı Sil", "Bu fotoğraf silinecek.", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await api.post(`/products/${editProduct._id}/remove-image`, {
              imageUrl,
            });
            await loadProducts();
            setEditProduct((prev) => ({
              ...prev,
              images: prev.images.filter((img) => img !== imageUrl),
            }));
          } catch (e) {
            Alert.alert("Hata", "Fotoğraf silinemedi");
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (
      !form.name ||
      !form.brand ||
      !form.category ||
      !form.price ||
      !form.stock
    ) {
      Alert.alert(
        "Hata",
        "Zorunlu alanları doldurun (Ad, Marka, Kategori, Fiyat, Stok)",
      );
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        formData.append(key, val.toString());
      });
      selectedImages.forEach((uri, i) => {
        const ext = uri.split(".").pop() || "jpg";
        formData.append("images", {
          uri,
          name: `product_${i}.${ext}`,
          type: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });
      });

      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("Başarılı", "Ürün güncellendi");
      } else {
        await api.post("/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Alert.alert("Başarılı", "Ürün eklendi");
      }
      setShowModal(false);
      await loadProducts();
    } catch (e) {
      Alert.alert("Hata", e.response?.data?.message || "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (product) => {
    Alert.alert("Ürünü Sil", `"${product.name}" silinecek. Emin misiniz?`, [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/products/${product._id}`);
            await loadProducts();
          } catch (e) {
            Alert.alert("Hata", "Ürün silinemedi");
          }
        },
      },
    ]);
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStockColor = (stock) => {
    if (stock === 0) return "#EF4444";
    if (stock < 10) return "#F59E0B";
    return "#10B981";
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image
        source={{
          uri:
            item.images?.[0] || "https://picsum.photos/100?random=" + item._id,
        }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <View style={styles.productMeta}>
          <Text style={styles.productPrice}>
            {item.price?.toLocaleString()} TL
          </Text>
          <View
            style={[
              styles.stockBadge,
              { backgroundColor: getStockColor(item.stock) + "20" },
            ]}
          >
            <Text
              style={[styles.stockText, { color: getStockColor(item.stock) }]}
            >
              {item.stock} adet
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
          <Ionicons name="create-outline" size={20} color="#3B82F6" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Yönetimi</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Ürün, marka, kategori ara..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{products.length}</Text>
          <Text style={styles.statLabel}>Toplam Ürün</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: "#10B981" }]}>
            {products.filter((p) => p.stock > 0).length}
          </Text>
          <Text style={styles.statLabel}>Stokta</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNum, { color: "#EF4444" }]}>
            {products.filter((p) => p.stock === 0).length}
          </Text>
          <Text style={styles.statLabel}>Stok Yok</Text>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6366F1"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderProduct}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="cube-outline" size={60} color="#D1D5DB" />
              <Text style={styles.emptyText}>Henüz ürün yok</Text>
              <TouchableOpacity style={styles.addFirstBtn} onPress={openAdd}>
                <Text style={styles.addFirstText}>İlk Ürünü Ekle</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={26} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </Text>
            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>Kaydet</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {/* Images Section */}
            <Text style={styles.sectionTitle}>Fotoğraflar</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesRow}
            >
              {/* Mevcut fotoğraflar */}
              {editProduct?.images?.map((img, i) => (
                <View key={i} style={styles.imgWrapper}>
                  <Image source={{ uri: img }} style={styles.imgThumb} />
                  <TouchableOpacity
                    style={styles.imgRemove}
                    onPress={() => removeExistingImage(img)}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
              {/* Yeni seçilen fotoğraflar */}
              {selectedImages.map((uri, i) => (
                <View key={"new-" + i} style={styles.imgWrapper}>
                  <Image source={{ uri }} style={styles.imgThumb} />
                  <TouchableOpacity
                    style={styles.imgRemove}
                    onPress={() => removeSelectedImage(i)}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>Yeni</Text>
                  </View>
                </View>
              ))}
              {/* Ekle butonu */}
              <TouchableOpacity style={styles.addImgBtn} onPress={pickImages}>
                <Ionicons name="camera-outline" size={28} color="#6366F1" />
                <Text style={styles.addImgText}>Fotoğraf{"\n"}Ekle</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Form */}
            <Text style={styles.sectionTitle}>Ürün Bilgileri</Text>

            <Text style={styles.label}>Ürün Adı *</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: iPhone 15 Pro Max 256GB"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
            />

            <Text style={styles.label}>Marka *</Text>
            <TextInput
              style={styles.input}
              placeholder="Örn: Apple"
              value={form.brand}
              onChangeText={(v) => setForm({ ...form, brand: v })}
            />

            <Text style={styles.label}>Kategori *</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategoryPicker(true)}
            >
              <Text
                style={[
                  styles.categorySelectorText,
                  !form.category && { color: "#9CA3AF" },
                ]}
              >
                {form.category || "Kategori seçin..."}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Fiyat (TL) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={form.price}
                  onChangeText={(v) => setForm({ ...form, price: v })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>Eski Fiyat (TL)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={form.oldPrice}
                  onChangeText={(v) => setForm({ ...form, oldPrice: v })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfField}>
                <Text style={styles.label}>Stok *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={form.stock}
                  onChangeText={(v) => setForm({ ...form, stock: v })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfField}>
                <Text style={styles.label}>İndirim (%)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={form.discount}
                  onChangeText={(v) => setForm({ ...form, discount: v })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.label}>Açıklama</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Ürün açıklaması..."
              value={form.description}
              onChangeText={(v) => setForm({ ...form, description: v })}
              multiline
              numberOfLines={4}
            />

            {/* Toggles */}
            <View style={styles.toggleRow}>
              <View>
                <Text style={styles.toggleLabel}>Çok Satan</Text>
                <Text style={styles.toggleSub}>Ana sayfada öne çıkar</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, form.isBestSeller && styles.toggleOn]}
                onPress={() =>
                  setForm({ ...form, isBestSeller: !form.isBestSeller })
                }
              >
                <View
                  style={[
                    styles.toggleThumb,
                    form.isBestSeller && styles.toggleThumbOn,
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.toggleRow, { marginBottom: 40 }]}>
              <View>
                <Text style={styles.toggleLabel}>Aktif</Text>
                <Text style={styles.toggleSub}>Ürün yayında mı?</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggle, form.isActive && styles.toggleOn]}
                onPress={() => setForm({ ...form, isActive: !form.isActive })}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    form.isActive && styles.toggleThumbOn,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Category Picker Modal */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <View style={styles.pickerOverlay}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Kategori Seç</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.pickerItem,
                    form.category === cat && styles.pickerItemSelected,
                  ]}
                  onPress={() => {
                    setForm({ ...form, category: cat });
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.pickerItemText,
                      form.category === cat && styles.pickerItemTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                  {form.category === cat && (
                    <Ionicons name="checkmark" size={20} color="#6366F1" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 46,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: "#111827" },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statNum: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  statLabel: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  list: { padding: 20, gap: 12 },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  productImage: { width: 90, height: 90, resizeMode: "cover" },
  productInfo: { flex: 1, padding: 10 },
  productBrand: { fontSize: 11, color: "#6366F1", fontWeight: "600" },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginVertical: 2,
  },
  productCategory: { fontSize: 11, color: "#9CA3AF", marginBottom: 4 },
  productMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#10B981" },
  stockBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  stockText: { fontSize: 11, fontWeight: "600" },
  productActions: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 10,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { alignItems: "center", marginTop: 60, gap: 12 },
  emptyText: { fontSize: 16, color: "#9CA3AF" },
  addFirstBtn: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addFirstText: { color: "#FFF", fontWeight: "bold" },
  // Modal
  modalContainer: { flex: 1, backgroundColor: "#F9FAFB" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  saveBtn: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  modalBody: { flex: 1, padding: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  },
  imagesRow: { marginBottom: 20 },
  imgWrapper: { position: "relative", marginRight: 10 },
  imgThumb: { width: 90, height: 90, borderRadius: 12 },
  imgRemove: { position: "absolute", top: -6, right: -6 },
  newBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "#10B981",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  addImgBtn: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6366F1",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  addImgText: {
    fontSize: 11,
    color: "#6366F1",
    textAlign: "center",
    marginTop: 4,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    marginBottom: 14,
  },
  textarea: { height: 100, textAlignVertical: "top" },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
  },
  categorySelectorText: { fontSize: 15, color: "#111827" },
  row: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleLabel: { fontSize: 15, fontWeight: "600", color: "#111827" },
  toggleSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    padding: 2,
  },
  toggleOn: { backgroundColor: "#6366F1" },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  toggleThumbOn: { alignSelf: "flex-end" },
  // Category Picker
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  pickerSheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  pickerTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pickerItemSelected: { backgroundColor: "#EEF2FF" },
  pickerItemText: { fontSize: 16, color: "#374151" },
  pickerItemTextSelected: { color: "#6366F1", fontWeight: "600" },
});
