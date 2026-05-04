import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

export default function AddressScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    title: "",
    fullName: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: "",
    isDefault: false,
  };
  const [form, setForm] = useState(emptyForm);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const ts = isDarkMode ? "#DDDDDD" : "#374151";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";
  const inputBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#F9FAFB";

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/addresses");
      setAddresses(res.data.data || []);
    } catch (e) {
      Alert.alert("Hata", "Adresler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setForm({
      title: address.title,
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      fullAddress: address.fullAddress,
      isDefault: address.isDefault,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (
      !form.title ||
      !form.fullName ||
      !form.phone ||
      !form.city ||
      !form.district ||
      !form.fullAddress
    ) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun");
      return;
    }
    try {
      setSaving(true);
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress._id}`, form);
      } else {
        await api.post("/addresses", form);
      }
      setModalVisible(false);
      fetchAddresses();
    } catch (e) {
      Alert.alert("Hata", "Adres kaydedilemedi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Adresi Sil", "Bu adresi silmek istediğinizden emin misiniz?", [
      { text: "İptal", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(`/addresses/${id}`);
            fetchAddresses();
          } catch (e) {
            Alert.alert("Hata", "Adres silinemedi");
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}`, { isDefault: true });
      fetchAddresses();
    } catch (e) {
      Alert.alert("Hata", "Varsayılan adres ayarlanamadı");
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline,
    keyboardType,
  }) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: ts }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: inputBg, borderColor: cardBorder, color: tp },
          multiline && { height: 80, textAlignVertical: "top" },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tm}
        multiline={multiline}
        keyboardType={keyboardType || "default"}
      />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tp }]}>Adreslerim</Text>
          <TouchableOpacity onPress={openAddModal} style={styles.addBtn}>
            <Ionicons name="add" size={26} color="#10B981" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#10B981"
            style={{ marginTop: 40 }}
          />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View
                  style={[
                    styles.emptyIconCircle,
                    { backgroundColor: "rgba(16,185,129,0.1)" },
                  ]}
                >
                  <Ionicons name="location-outline" size={48} color="#10B981" />
                </View>
                <Text style={[styles.emptyTitle, { color: tp }]}>
                  Henüz adresiniz yok
                </Text>
                <Text style={[styles.emptySubtitle, { color: tm }]}>
                  Yeni bir teslimat adresi ekleyin
                </Text>
                <TouchableOpacity
                  style={styles.emptyAddBtn}
                  onPress={openAddModal}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#FFF" />
                  <Text style={styles.emptyAddBtnText}>Adres Ekle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {addresses.map((addr) => (
                  <View
                    key={addr._id}
                    style={[
                      styles.addressCard,
                      {
                        backgroundColor: cardBg,
                        borderColor: addr.isDefault ? "#10B981" : cardBorder,
                      },
                    ]}
                  >
                    {addr.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color="#FFF"
                        />
                        <Text style={styles.defaultBadgeText}>Varsayılan</Text>
                      </View>
                    )}
                    <View style={styles.cardHeader}>
                      <View
                        style={[
                          styles.titleIconCircle,
                          { backgroundColor: "rgba(16,185,129,0.12)" },
                        ]}
                      >
                        <Ionicons
                          name={
                            addr.title === "İş"
                              ? "briefcase-outline"
                              : "home-outline"
                          }
                          size={20}
                          color="#10B981"
                        />
                      </View>
                      <Text style={[styles.addrTitle, { color: tp }]}>
                        {addr.title}
                      </Text>
                    </View>

                    <Text style={[styles.addrName, { color: ts }]}>
                      {addr.fullName}
                    </Text>
                    <Text style={[styles.addrPhone, { color: tm }]}>
                      {addr.phone}
                    </Text>
                    <Text style={[styles.addrFull, { color: ts }]}>
                      {addr.fullAddress}, {addr.district} / {addr.city}
                    </Text>

                    <View
                      style={[
                        styles.cardActions,
                        {
                          borderTopColor: isDarkMode
                            ? "rgba(255,255,255,0.1)"
                            : "#F0F0F0",
                        },
                      ]}
                    >
                      {!addr.isDefault && (
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => handleSetDefault(addr._id)}
                        >
                          <Ionicons
                            name="star-outline"
                            size={18}
                            color="#F59E0B"
                          />
                          <Text
                            style={[styles.actionText, { color: "#F59E0B" }]}
                          >
                            Varsayılan Yap
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => openEditModal(addr)}
                      >
                        <Ionicons
                          name="create-outline"
                          size={18}
                          color="#6366F1"
                        />
                        <Text style={[styles.actionText, { color: "#6366F1" }]}>
                          Düzenle
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDelete(addr._id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#EF4444"
                        />
                        <Text style={[styles.actionText, { color: "#EF4444" }]}>
                          Sil
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.newAddressBtn}
                  onPress={openAddModal}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={22}
                    color="#10B981"
                  />
                  <Text style={styles.newAddressBtnText}>Yeni Adres Ekle</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        )}

        {/* ✅ Modal - KeyboardAvoidingView eklendi */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: tp }]}>
                  {editingAddress ? "Adresi Düzenle" : "Yeni Adres"}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={26} color={tm} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Başlık hızlı seç */}
                <Text
                  style={[styles.inputLabel, { color: ts, marginBottom: 8 }]}
                >
                  Adres Başlığı
                </Text>
                <View style={styles.titleRow}>
                  {["Ev", "İş", "Diğer"].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.titleChip,
                        form.title === t && styles.titleChipActive,
                        {
                          borderColor:
                            form.title === t ? "#10B981" : cardBorder,
                          backgroundColor:
                            form.title === t
                              ? "rgba(16,185,129,0.12)"
                              : inputBg,
                        },
                      ]}
                      onPress={() => setForm({ ...form, title: t })}
                    >
                      <Ionicons
                        name={
                          t === "Ev"
                            ? "home-outline"
                            : t === "İş"
                              ? "briefcase-outline"
                              : "location-outline"
                        }
                        size={18}
                        color={form.title === t ? "#10B981" : tm}
                      />
                      <Text
                        style={[
                          styles.titleChipText,
                          { color: form.title === t ? "#10B981" : tm },
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <InputField
                  label="Ad Soyad"
                  value={form.fullName}
                  onChangeText={(v) => setForm({ ...form, fullName: v })}
                  placeholder="Ad Soyad"
                />
                <InputField
                  label="Telefon"
                  value={form.phone}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  placeholder="05XX XXX XX XX"
                  keyboardType="phone-pad"
                />
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <InputField
                      label="İl"
                      value={form.city}
                      onChangeText={(v) => setForm({ ...form, city: v })}
                      placeholder="İstanbul"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <InputField
                      label="İlçe"
                      value={form.district}
                      onChangeText={(v) => setForm({ ...form, district: v })}
                      placeholder="ilçe"
                    />
                  </View>
                </View>
                <InputField
                  label="Tam Adres"
                  value={form.fullAddress}
                  onChangeText={(v) => setForm({ ...form, fullAddress: v })}
                  placeholder="Mahalle, sokak, no, daire..."
                  multiline
                />

                {/* Varsayılan toggle */}
                <TouchableOpacity
                  style={[
                    styles.defaultToggle,
                    { backgroundColor: inputBg, borderColor: cardBorder },
                  ]}
                  onPress={() =>
                    setForm({ ...form, isDefault: !form.isDefault })
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: "#10B981",
                        backgroundColor: form.isDefault
                          ? "#10B981"
                          : "transparent",
                      },
                    ]}
                  >
                    {form.isDefault && (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    )}
                  </View>
                  <Text style={[styles.defaultToggleText, { color: ts }]}>
                    Varsayılan adres olarak ayarla
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.saveBtn, saving && { opacity: 0.7 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={22}
                        color="#FFF"
                      />
                      <Text style={styles.saveBtnText}>
                        {editingAddress ? "Güncelle" : "Kaydet"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
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
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  addBtn: { padding: 4 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  emptyContainer: { alignItems: "center", paddingTop: 60 },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  emptySubtitle: { fontSize: 15, marginBottom: 28 },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#10B981",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptyAddBtnText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  addressCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 18,
    marginBottom: 16,
    overflow: "hidden",
  },
  defaultBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#10B981",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  defaultBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  titleIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  addrTitle: { fontSize: 17, fontWeight: "700" },
  addrName: { fontSize: 15, fontWeight: "500", marginBottom: 4 },
  addrPhone: { fontSize: 14, marginBottom: 8 },
  addrFull: { fontSize: 14, lineHeight: 20 },
  cardActions: {
    flexDirection: "row",
    gap: 4,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionText: { fontSize: 13, fontWeight: "600" },
  newAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#10B981",
    borderStyle: "dashed",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  newAddressBtnText: { color: "#10B981", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: "92%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "700" },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 13, fontWeight: "600", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  titleRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  titleChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  titleChipText: { fontSize: 14, fontWeight: "600" },
  titleChipActive: {},
  row: { flexDirection: "row" },
  defaultToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultToggleText: { fontSize: 14, fontWeight: "500" },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 10,
  },
  saveBtnText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
