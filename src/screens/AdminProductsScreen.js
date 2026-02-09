import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";

export default function AdminProductsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [products] = useState([
    {
      id: 1,
      name: "iPhone 15 Pro Max",
      category: "Ana Sayfa",
      price: 54999,
      stock: 45,
      status: "Aktif",
      image: "📱",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      category: "Favorilerim",
      price: 49999,
      stock: 32,
      status: "Aktif",
      image: "📱",
    },
    {
      id: 3,
      name: "MacBook Pro M3",
      category: "Sepetim",
      price: 89999,
      stock: 12,
      status: "Aktif",
      image: "💻",
    },
    {
      id: 4,
      name: "iPad Pro 12.9",
      category: "Kategoriler",
      price: 38999,
      stock: 28,
      status: "Aktif",
      image: "📱",
    },
    {
      id: 5,
      name: "AirPods Pro 2",
      category: "Hesabım",
      price: 9999,
      stock: 0,
      status: "Stok Yok",
      image: "🎧",
    },
  ]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStockColor = (stock) => {
    if (stock === 0) return COLORS.adminDanger;
    if (stock < 20) return COLORS.adminWarning;
    return COLORS.adminSuccess;
  };

  const handleDeleteProduct = (productId) => {
    Alert.alert("Ürünü Sil", "Bu ürünü silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: () => {
          // Delete logic here
          Alert.alert("Başarılı", "Ürün silindi");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.adminText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Yönetimi</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={COLORS.adminTextLight}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Ürün ara..."
          placeholderTextColor={COLORS.adminTextLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Products List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <Text style={styles.productEmoji}>{product.image}</Text>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productCategory}>{product.category}</Text>
              </View>
            </View>

            <View style={styles.productDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fiyat:</Text>
                <Text style={styles.detailValue}>
                  ₺{product.price.toLocaleString("tr-TR")}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Stok:</Text>
                <View
                  style={[
                    styles.stockBadge,
                    { backgroundColor: `${getStockColor(product.stock)}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.stockText,
                      { color: getStockColor(product.stock) },
                    ]}
                  >
                    {product.stock > 0 ? product.stock : "Stok Yok"}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Durum:</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        product.status === "Aktif"
                          ? `${COLORS.adminSuccess}20`
                          : `${COLORS.adminDanger}20`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          product.status === "Aktif"
                            ? COLORS.adminSuccess
                            : COLORS.adminDanger,
                      },
                    ]}
                  >
                    {product.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.productActions}>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={COLORS.white}
                />
                <Text style={styles.editButtonText}>Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProduct(product.id)}
              >
                <Ionicons name="trash-outline" size={18} color={COLORS.white} />
                <Text style={styles.deleteButtonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Add Product Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Ürün Ekle</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.adminText} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <TextInput
                style={styles.modalInput}
                placeholder="Ürün Adı"
                placeholderTextColor={COLORS.adminTextLight}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Kategori"
                placeholderTextColor={COLORS.adminTextLight}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Fiyat"
                placeholderTextColor={COLORS.adminTextLight}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Stok"
                placeholderTextColor={COLORS.adminTextLight}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Açıklama"
                placeholderTextColor={COLORS.adminTextLight}
                multiline
                numberOfLines={4}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  setShowAddModal(false);
                  Alert.alert("Başarılı", "Ürün eklendi");
                }}
              >
                <Text style={styles.saveButtonText}>Kaydet</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.adminBorder,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.adminBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.adminText,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.adminPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: COLORS.adminText,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.adminText,
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 13,
    color: COLORS.adminTextLight,
  },
  productDetails: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.adminBorder,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.adminTextLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.adminText,
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 13,
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  productActions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.adminInfo,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.adminDanger,
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.adminBorder,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.adminText,
  },
  modalForm: {
    padding: 20,
  },
  modalInput: {
    backgroundColor: COLORS.adminBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    fontSize: 15,
    color: COLORS.adminText,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.adminBorder,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.adminBackground,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.adminText,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.adminPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
