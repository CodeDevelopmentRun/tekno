import React, { useState, useEffect } from "react";
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
import api from "../api/axiosConfig";

const CATEGORIES = [
  "Telefon",
  "Tablet",
  "Akıllı Saat",
  "Akıllı Bileklik",
  "Bilgisayar",
  "Laptop",
  "Monitör",
  "Klavye & Mouse",
  "Hard Disk & SSD",
  "Kulaklık",
  "Hoparlör",
  "TV",
  "Projeksiyon",
  "Kamera",
  "Drone",
  "Lens & Aksesuar",
  "Oyun Konsolu",
  "Oyun Aksesuarı",
  "Oyun Koltuğu",
  "Robot Süpürge",
  "Akıllı Ev",
  "Klima",
  "Beyaz Eşya",
  "Modem & Router",
  "Switch & Hub",
  "Kablo & Adaptör",
  "Powerbank",
  "Şarj Cihazı",
  "UPS",
  "Yazıcı",
  "Tarayıcı",
  "Telefon Kılıfı",
  "Ekran Koruyucu",
  "Çanta & Sırt Çantası",
];

const PRODUCT_COLORS = [
  { label: "Siyah", value: "Siyah", hex: "#111827" },
  { label: "Beyaz", value: "Beyaz", hex: "#F9FAFB" },
  { label: "Gri", value: "Gri", hex: "#6B7280" },
  { label: "Kırmızı", value: "Kırmızı", hex: "#EF4444" },
  { label: "Mavi", value: "Mavi", hex: "#3B82F6" },
  { label: "Lacivert", value: "Lacivert", hex: "#1E3A5F" },
  { label: "Yeşil", value: "Yeşil", hex: "#10B981" },
  { label: "Sarı", value: "Sarı", hex: "#F59E0B" },
  { label: "Turuncu", value: "Turuncu", hex: "#F97316" },
  { label: "Mor", value: "Mor", hex: "#8B5CF6" },
  { label: "Pembe", value: "Pembe", hex: "#EC4899" },
  { label: "Gold", value: "Gold", hex: "#D97706" },
  { label: "Gümüş", value: "Gümüş", hex: "#9CA3AF" },
  { label: "Rose Gold", value: "Rose Gold", hex: "#F4A4A4" },
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
  color: "",
  colorCode: "",
};

const emptyVariantForm = { color: "", colorCode: "", stock: "" };

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

  const [variants, setVariants] = useState([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantForm, setVariantForm] = useState(emptyVariantForm);
  const [variantLocalImages, setVariantLocalImages] = useState([]);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);

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
    setVariants([]);
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
      color: product.color || "",
      colorCode: product.colorCode || "",
    });
    setSelectedImages([]);
    setVariants(
      (product.variants || []).map((v) => ({
        color: v.color,
        colorCode: v.colorCode,
        stock: v.stock?.toString() || "0",
        existingImages: v.images || [],
        localImages: [],
      })),
    );
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

  const removeSelectedImage = (index) =>
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

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

  const openVariantAdd = () => {
    setEditingVariantIndex(null);
    setVariantForm(emptyVariantForm);
    setVariantLocalImages([]);
    setShowVariantModal(true);
  };

  const openVariantEdit = (index) => {
    const v = variants[index];
    setEditingVariantIndex(index);
    setVariantForm({ color: v.color, colorCode: v.colorCode, stock: v.stock });
    setVariantLocalImages(v.localImages || []);
    setShowVariantModal(true);
  };

  const pickVariantImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("İzin gerekli", "Galeri erişimine izin verin");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 4,
    });
    if (!result.canceled) {
      setVariantLocalImages((prev) => [
        ...prev,
        ...result.assets.map((a) => a.uri),
      ]);
    }
  };

  const saveVariant = () => {
    if (!variantForm.color) {
      Alert.alert("Uyarı", "Renk seçin");
      return;
    }
    if (!variantForm.stock) {
      Alert.alert("Uyarı", "Stok girin");
      return;
    }

    const newVariant = {
      color: variantForm.color,
      colorCode: variantForm.colorCode,
      stock: variantForm.stock,
      existingImages:
        editingVariantIndex !== null
          ? variants[editingVariantIndex].existingImages
          : [],
      localImages: variantLocalImages,
    };

    if (editingVariantIndex !== null) {
      setVariants((prev) =>
        prev.map((v, i) => (i === editingVariantIndex ? newVariant : v)),
      );
    } else {
      if (variants.some((v) => v.color === variantForm.color)) {
        Alert.alert("Uyarı", "Bu renk zaten eklenmiş");
        return;
      }
      setVariants((prev) => [...prev, newVariant]);
    }
    setShowVariantModal(false);
  };

  const removeVariant = (index) => {
    Alert.alert("Varyantı Sil", "Bu renk varyantı kaldırılacak.", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: () =>
          setVariants((prev) => prev.filter((_, i) => i !== index)),
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

      formData.append("name", form.name);
      formData.append("brand", form.brand);
      formData.append("category", form.category);
      if (form.color) formData.append("color", form.color);
      if (form.colorCode) formData.append("colorCode", form.colorCode);
      formData.append("price", form.price);
      if (form.oldPrice) formData.append("oldPrice", form.oldPrice);
      formData.append("stock", form.stock);
      if (form.discount) formData.append("discount", form.discount);
      formData.append("description", form.description || "");
      formData.append("isBestSeller", form.isBestSeller.toString());
      formData.append("isActive", form.isActive.toString());

      const variantsData = variants.map((v) => ({
        color: v.color,
        colorCode: v.colorCode,
        stock: Number(v.stock),
      }));
      formData.append("variants", JSON.stringify(variantsData));

      selectedImages.forEach((uri, i) => {
        const ext = uri.split(".").pop() || "jpg";
        formData.append("images", {
          uri,
          name: `product_${i}.${ext}`,
          type: `image/${ext === "jpg" ? "jpeg" : ext}`,
        });
      });

      variants.forEach((v, i) => {
        (v.localImages || []).forEach((uri, j) => {
          const ext = uri.split(".").pop() || "jpg";
          formData.append(`variantImages_${i}`, {
            uri,
            name: `variant_${i}_${j}.${ext}`,
            type: `image/${ext === "jpg" ? "jpeg" : ext}`,
          });
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
        {item.variants?.length > 0 && (
          <View style={{ flexDirection: "row", gap: 4, marginTop: 4 }}>
            {item.variants.map((v, i) => (
              <View
                key={i}
                style={[
                  styles.variantDotSmall,
                  { backgroundColor: v.colorCode },
                ]}
              />
            ))}
          </View>
        )}
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

      {/* ===================== ANA ÜRÜN MODAL ===================== */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
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
            {/* Fotoğraflar */}
            <Text style={styles.sectionTitle}>Ana Fotoğraflar</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesRow}
            >
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
              <TouchableOpacity style={styles.addImgBtn} onPress={pickImages}>
                <Ionicons name="camera-outline" size={28} color="#6366F1" />
                <Text style={styles.addImgText}>Fotoğraf{"\n"}Ekle</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Form Alanları */}
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

            {/* ✅ ÜRÜN RENGİ - Kategori seçicinin hemen altında */}
            <Text style={styles.label}>Ürün Rengi</Text>
            <View style={styles.colorsGrid}>
              {PRODUCT_COLORS.map((color) => {
                const isSelected = form.color === color.value;
                return (
                  <TouchableOpacity
                    key={color.value}
                    style={[
                      styles.colorChip,
                      isSelected && { borderColor: "#6366F1", borderWidth: 2 },
                    ]}
                    onPress={() =>
                      setForm({
                        ...form,
                        color: color.value,
                        colorCode: color.hex,
                      })
                    }
                  >
                    <View
                      style={[styles.colorDot, { backgroundColor: color.hex }]}
                    />
                    <Text
                      style={[
                        styles.colorChipText,
                        isSelected && { color: "#6366F1", fontWeight: "700" },
                      ]}
                    >
                      {color.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#6366F1" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

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
                <Text style={styles.label}>Genel Stok *</Text>
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

            {/* VARYANT / RENK YÖNETİMİ */}
            <View style={styles.variantHeader}>
              <Text style={styles.sectionTitle}>Renk Varyantları</Text>
              <TouchableOpacity
                style={styles.addVariantBtn}
                onPress={openVariantAdd}
              >
                <Ionicons name="add" size={18} color="#FFF" />
                <Text style={styles.addVariantBtnText}>Renk Ekle</Text>
              </TouchableOpacity>
            </View>

            {variants.length === 0 ? (
              <View style={styles.noVariant}>
                <Text style={styles.noVariantText}>
                  Henüz renk varyantı eklenmedi
                </Text>
              </View>
            ) : (
              variants.map((v, i) => (
                <View key={i} style={styles.variantCard}>
                  <View style={styles.variantCardLeft}>
                    <View
                      style={[
                        styles.variantColorCircle,
                        { backgroundColor: v.colorCode },
                      ]}
                    />
                    <View>
                      <Text style={styles.variantColorName}>{v.color}</Text>
                      <Text style={styles.variantColorMeta}>
                        Stok: {v.stock} •{" "}
                        {(v.existingImages?.length || 0) +
                          (v.localImages?.length || 0)}{" "}
                        fotoğraf
                      </Text>
                    </View>
                  </View>
                  <View style={styles.variantCardActions}>
                    <TouchableOpacity
                      style={styles.variantEditBtn}
                      onPress={() => openVariantEdit(i)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#3B82F6"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.variantDeleteBtn}
                      onPress={() => removeVariant(i)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {/* Toggles */}
            <View style={[styles.toggleRow, { marginTop: 16 }]}>
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

      {/* ===================== VARYANT MODAL ===================== */}
      <Modal
        visible={showVariantModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowVariantModal(false)}
      >
        <View style={styles.variantModalOverlay}>
          <View style={styles.variantModalSheet}>
            <View style={styles.variantModalHeader}>
              <Text style={styles.variantModalTitle}>
                {editingVariantIndex !== null
                  ? "Varyantı Düzenle"
                  : "Renk Varyantı Ekle"}
              </Text>
              <TouchableOpacity onPress={() => setShowVariantModal(false)}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ padding: 20 }}
            >
              <Text style={styles.label}>Renk Seçin *</Text>
              <View style={styles.colorsGrid}>
                {PRODUCT_COLORS.map((color) => {
                  const isSelected = variantForm.color === color.value;
                  return (
                    <TouchableOpacity
                      key={color.value}
                      style={[
                        styles.colorChip,
                        isSelected && {
                          borderColor: "#6366F1",
                          borderWidth: 2,
                        },
                      ]}
                      onPress={() =>
                        setVariantForm({
                          ...variantForm,
                          color: color.value,
                          colorCode: color.hex,
                        })
                      }
                    >
                      <View
                        style={[
                          styles.colorDot,
                          { backgroundColor: color.hex },
                        ]}
                      />
                      <Text
                        style={[
                          styles.colorChipText,
                          isSelected && { color: "#6366F1", fontWeight: "700" },
                        ]}
                      >
                        {color.label}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={14} color="#6366F1" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.label}>Bu Renk İçin Stok *</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={variantForm.stock}
                onChangeText={(v) =>
                  setVariantForm({ ...variantForm, stock: v })
                }
                keyboardType="numeric"
              />

              <Text style={styles.label}>Bu Renk İçin Fotoğraflar</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                {editingVariantIndex !== null &&
                  variants[editingVariantIndex]?.existingImages?.map(
                    (img, i) => (
                      <View key={"ex-" + i} style={styles.imgWrapper}>
                        <Image source={{ uri: img }} style={styles.imgThumb} />
                      </View>
                    ),
                  )}
                {variantLocalImages.map((uri, i) => (
                  <View key={"vl-" + i} style={styles.imgWrapper}>
                    <Image source={{ uri }} style={styles.imgThumb} />
                    <TouchableOpacity
                      style={styles.imgRemove}
                      onPress={() =>
                        setVariantLocalImages((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>Yeni</Text>
                    </View>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.addImgBtn}
                  onPress={pickVariantImages}
                >
                  <Ionicons name="camera-outline" size={28} color="#6366F1" />
                  <Text style={styles.addImgText}>Fotoğraf{"\n"}Ekle</Text>
                </TouchableOpacity>
              </ScrollView>

              <TouchableOpacity
                style={styles.saveVariantBtn}
                onPress={saveVariant}
              >
                <Text style={styles.saveVariantBtnText}>
                  {editingVariantIndex !== null ? "Güncelle" : "Varyantı Ekle"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Kategori Picker */}
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
  variantDotSmall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
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
  variantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  addVariantBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#6366F1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addVariantBtnText: { color: "#FFF", fontSize: 13, fontWeight: "600" },
  noVariant: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  noVariantText: { color: "#9CA3AF", fontSize: 14 },
  variantCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    marginBottom: 8,
  },
  variantCardLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  variantColorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  variantColorName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  variantColorMeta: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  variantCardActions: { flexDirection: "row", gap: 8 },
  variantEditBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  variantDeleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },
  variantModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  variantModalSheet: {
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  variantModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  variantModalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  saveVariantBtn: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  saveVariantBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  colorsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  colorChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  colorChipText: { fontSize: 13, color: "#374151" },
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
