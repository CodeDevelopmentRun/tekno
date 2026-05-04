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
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";

const BASE_URL = "http://10.0.2.2:5000/api/admin";

export default function AdminCategoriesScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/categories`);
      const data = await res.json();
      // ✅ DÜZELTME: API bazen dizi yerine obje döndürüyor.
      // data bir dizi ise direkt kullan, değilse data.categories'i al, o da yoksa boş dizi ata.
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (err) {
      Alert.alert("Hata", "Kategoriler yüklenemedi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "", image: "", isActive: true });
    setModalVisible(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive !== false,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert("Uyarı", "Kategori adı zorunludur.");
      return;
    }

    setSaving(true);
    try {
      const url = editingCategory
        ? `${BASE_URL}/categories/${editingCategory._id}`
        : `${BASE_URL}/categories`;

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Hata", data.message || "İşlem başarısız.");
        return;
      }

      Alert.alert(
        "Başarılı",
        editingCategory ? "Kategori güncellendi." : "Kategori eklendi.",
      );
      setModalVisible(false);
      fetchCategories();
    } catch (err) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (category) => {
    Alert.alert(
      "Kategoriyi Sil",
      `"${category.name}" kategorisini silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await fetch(
                `${BASE_URL}/categories/${category._id}`,
                { method: "DELETE" },
              );
              const data = await res.json();
              if (!res.ok) {
                Alert.alert("Hata", data.message || "Silinemedi.");
                return;
              }
              Alert.alert("Başarılı", "Kategori silindi.");
              fetchCategories();
            } catch (err) {
              Alert.alert("Hata", "Sunucuya bağlanılamadı.");
            }
          },
        },
      ],
    );
  };

  const handleToggleStatus = async (category) => {
    try {
      const res = await fetch(
        `${BASE_URL}/categories/${category._id}/toggle-status`,
        { method: "PUT" },
      );
      const data = await res.json();
      if (!res.ok) {
        Alert.alert("Hata", data.message || "Durum değiştirilemedi.");
        return;
      }
      fetchCategories();
    } catch (err) {
      Alert.alert("Hata", "Sunucuya bağlanılamadı.");
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.adminText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kategori Yönetimi</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={18}
          color={COLORS.adminTextLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Kategori ara..."
          placeholderTextColor={COLORS.adminTextLight}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons
              name="close-circle"
              size={18}
              color={COLORS.adminTextLight}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNum}>{categories.length}</Text>
          <Text style={styles.statLbl}>Toplam</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: COLORS.adminSuccess }]}>
            {categories.filter((c) => c.isActive !== false).length}
          </Text>
          <Text style={styles.statLbl}>Aktif</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: COLORS.adminDanger }]}>
            {categories.filter((c) => c.isActive === false).length}
          </Text>
          <Text style={styles.statLbl}>Pasif</Text>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.adminPrimary} />
          <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="folder-open-outline"
            size={64}
            color={COLORS.adminTextLight}
          />
          <Text style={styles.emptyText}>
            {searchText ? "Arama sonucu bulunamadı" : "Henüz kategori yok"}
          </Text>
          {!searchText && (
            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAddModal}>
              <Text style={styles.emptyAddBtnText}>İlk kategoriyi ekle</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {filtered.map((category) => (
            <View key={category._id} style={styles.categoryCard}>
              {/* Left: icon/image */}
              <View style={styles.categoryImageContainer}>
                {category.image ? (
                  <Image
                    source={{ uri: category.image }}
                    style={styles.categoryImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.categoryImagePlaceholder}>
                    <Ionicons
                      name="folder"
                      size={28}
                      color={COLORS.adminSuccess}
                    />
                  </View>
                )}
              </View>

              {/* Middle: info */}
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                {category.description ? (
                  <Text style={styles.categoryDesc} numberOfLines={1}>
                    {category.description}
                  </Text>
                ) : null}
                <View style={styles.categoryMeta}>
                  <View
                    style={[
                      styles.badge,
                      category.isActive !== false
                        ? styles.badgeActive
                        : styles.badgeInactive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        category.isActive !== false
                          ? styles.badgeTextActive
                          : styles.badgeTextInactive,
                      ]}
                    >
                      {category.isActive !== false ? "Aktif" : "Pasif"}
                    </Text>
                  </View>
                  {category.productCount !== undefined && (
                    <Text style={styles.productCount}>
                      {category.productCount} ürün
                    </Text>
                  )}
                </View>
              </View>

              {/* Right: actions */}
              <View style={styles.categoryActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleToggleStatus(category)}
                >
                  <Ionicons
                    name={
                      category.isActive !== false
                        ? "eye-outline"
                        : "eye-off-outline"
                    }
                    size={20}
                    color={
                      category.isActive !== false
                        ? COLORS.adminSuccess
                        : COLORS.adminTextLight
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => openEditModal(category)}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={COLORS.adminInfo}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDelete(category)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={COLORS.adminDanger}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.adminText} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Kategori Adı *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="örn. Elektronik"
                  placeholderTextColor={COLORS.adminTextLight}
                  value={form.name}
                  onChangeText={(t) => setForm({ ...form, name: t })}
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Açıklama</Text>
                <TextInput
                  style={[styles.formInput, styles.formTextarea]}
                  placeholder="Kategori açıklaması..."
                  placeholderTextColor={COLORS.adminTextLight}
                  value={form.description}
                  onChangeText={(t) => setForm({ ...form, description: t })}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Image URL */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Görsel URL</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="https://..."
                  placeholderTextColor={COLORS.adminTextLight}
                  value={form.image}
                  onChangeText={(t) => setForm({ ...form, image: t })}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>

              {/* isActive toggle */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Durum</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.toggleOption,
                      form.isActive && styles.toggleOptionActive,
                    ]}
                    onPress={() => setForm({ ...form, isActive: true })}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={
                        form.isActive
                          ? COLORS.adminSuccess
                          : COLORS.adminTextLight
                      }
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        form.isActive && styles.toggleTextActive,
                      ]}
                    >
                      Aktif
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.toggleOption,
                      !form.isActive && styles.toggleOptionInactive,
                    ]}
                    onPress={() => setForm({ ...form, isActive: false })}
                  >
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={
                        !form.isActive
                          ? COLORS.adminDanger
                          : COLORS.adminTextLight
                      }
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        !form.isActive && styles.toggleTextInactive,
                      ]}
                    >
                      Pasif
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {editingCategory ? "Güncelle" : "Ekle"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.adminBackground,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.adminText,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.adminSuccess,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.adminSuccess,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.adminText,
    padding: 0,
  },

  // Stats Bar
  statsBar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.adminBackground,
  },
  statNum: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.adminText,
  },
  statLbl: {
    fontSize: 11,
    color: COLORS.adminTextLight,
    marginTop: 2,
  },

  // List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryImageContainer: {
    marginRight: 14,
  },
  categoryImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
  },
  categoryImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.adminText,
    marginBottom: 3,
  },
  categoryDesc: {
    fontSize: 12,
    color: COLORS.adminTextLight,
    marginBottom: 6,
  },
  categoryMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeActive: {
    backgroundColor: "#F0FDF4",
  },
  badgeInactive: {
    backgroundColor: "#FEF2F2",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeTextActive: {
    color: COLORS.adminSuccess,
  },
  badgeTextInactive: {
    color: COLORS.adminDanger,
  },
  productCount: {
    fontSize: 11,
    color: COLORS.adminTextLight,
  },
  categoryActions: {
    flexDirection: "row",
    gap: 4,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: COLORS.adminBackground,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty / Loading
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.adminTextLight,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.adminTextLight,
    textAlign: "center",
  },
  emptyAddBtn: {
    marginTop: 16,
    backgroundColor: COLORS.adminSuccess,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.adminText,
  },

  // Form
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.adminText,
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: COLORS.adminBackground,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.adminText,
    borderWidth: 1,
    borderColor: "transparent",
  },
  formTextarea: {
    height: 80,
    paddingTop: 12,
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  toggleOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.adminBackground,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  toggleOptionActive: {
    borderColor: COLORS.adminSuccess,
    backgroundColor: "#F0FDF4",
  },
  toggleOptionInactive: {
    borderColor: COLORS.adminDanger,
    backgroundColor: "#FEF2F2",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.adminTextLight,
  },
  toggleTextActive: {
    color: COLORS.adminSuccess,
  },
  toggleTextInactive: {
    color: COLORS.adminDanger,
  },

  // Modal Footer
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.adminBackground,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.adminTextLight,
  },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.adminSuccess,
    alignItems: "center",
    shadowColor: COLORS.adminSuccess,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
});
