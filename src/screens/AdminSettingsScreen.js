import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../utils/colors";

const API_BASE = "http://10.0.2.2:5000/api/admin";

const VARIABLE_INFO = {
  welcome: ["{{name}}"],
  passwordReset: ["{{name}}", "{{code}}"],
  passwordChanged: ["{{name}}"],
  orderConfirmation: [
    "{{name}}",
    "{{orderNumber}}",
    "{{totalPrice}}",
    "{{itemsHtml}}",
    "{{shippingAddress}}",
  ],
  shipped: ["{{name}}", "{{orderNumber}}", "{{shippingAddress}}"],
  delivered: ["{{name}}", "{{orderNumber}}"],
};

const MAIL_SERVICES = ["gmail", "hotmail", "yahoo", "outlook"];

export default function AdminSettingsScreen({ navigation }) {
  // ── Şablon state ───────────────────────────────────────────────────────────
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ── Mail config state ──────────────────────────────────────────────────────
  const [mailConfig, setMailConfig] = useState(null);
  const [loadingMailConfig, setLoadingMailConfig] = useState(true);
  const [mailService, setMailService] = useState("gmail");
  const [mailUser, setMailUser] = useState("");
  const [mailPass, setMailPass] = useState("");
  const [mailFrom, setMailFrom] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [savingMail, setSavingMail] = useState(false);
  const [mailSectionOpen, setMailSectionOpen] = useState(false);

  // ── Auth header helper ─────────────────────────────────────────────────────
  const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // ── Şablonları yükle ──────────────────────────────────────────────────────
  const fetchTemplates = useCallback(async () => {
    try {
      setLoadingTemplates(true);
      const res = await fetch(`${API_BASE}/email-templates`, {
        headers: await getAuthHeaders(),
      });
      const data = await res.json();
      setTemplates(
        Array.isArray(data) ? data : data.templates || data.data || [],
      );
    } catch {
      Alert.alert("Hata", "Şablonlar yüklenemedi");
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  // ── Mail config yükle ──────────────────────────────────────────────────────
  const fetchMailConfig = useCallback(async () => {
    try {
      setLoadingMailConfig(true);
      const res = await fetch(`${API_BASE}/mail-config`, {
        headers: await getAuthHeaders(),
      });
      const data = await res.json();
      setMailConfig(data);
      setMailService(data.service || "gmail");
      setMailUser(data.user || "");
      setMailFrom(data.from || "");
    } catch {
      Alert.alert("Hata", "Mail ayarları yüklenemedi");
    } finally {
      setLoadingMailConfig(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
    fetchMailConfig();
  }, [fetchTemplates, fetchMailConfig]);

  // ── Şablon seç / kapat ────────────────────────────────────────────────────
  const selectTemplate = async (key) => {
    if (selectedKey === key) {
      setSelectedKey(null);
      return;
    }
    try {
      setLoadingDetail(true);
      setSelectedKey(key);
      const res = await fetch(`${API_BASE}/email-templates/${key}`, {
        headers: await getAuthHeaders(),
      });
      const data = await res.json();
      setEditSubject(data.subject);
      setEditHtml(data.html);
    } catch {
      Alert.alert("Hata", "Şablon yüklenemedi");
    } finally {
      setLoadingDetail(false);
    }
  };

  // ── Şablon kaydet ─────────────────────────────────────────────────────────
  const saveTemplate = async () => {
    if (!editSubject.trim() || !editHtml.trim()) {
      Alert.alert("Uyarı", "Konu ve içerik boş bırakılamaz");
      return;
    }
    try {
      setSavingTemplate(true);
      const res = await fetch(`${API_BASE}/email-templates/${selectedKey}`, {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ subject: editSubject, html: editHtml }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Alert.alert("✅ Başarılı", "Şablon güncellendi");
      setTemplates((prev) =>
        prev.map((t) =>
          t.key === selectedKey ? { ...t, subject: editSubject } : t,
        ),
      );
    } catch (err) {
      Alert.alert("Hata", err.message || "Kaydedilemedi");
    } finally {
      setSavingTemplate(false);
    }
  };

  // ── Mail config kaydet ────────────────────────────────────────────────────
  const saveMailConfig = async () => {
    if (!mailUser.trim() || !mailFrom.trim()) {
      Alert.alert("Uyarı", "Mail adresi ve gönderen adı zorunludur");
      return;
    }
    if (!mailConfig?.hasPassword && !mailPass.trim()) {
      Alert.alert("Uyarı", "İlk kurulumda şifre zorunludur");
      return;
    }
    try {
      setSavingMail(true);
      const body = { service: mailService, user: mailUser, from: mailFrom };
      if (mailPass.trim()) body.pass = mailPass;

      const res = await fetch(`${API_BASE}/mail-config`, {
        method: "PUT",
        headers: await getAuthHeaders(),
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      Alert.alert("✅ Başarılı", "Mail ayarları güncellendi");
      setMailConfig({ ...data.config, hasPassword: true });
      setMailPass("");
    } catch (err) {
      Alert.alert("Hata", err.message || "Kaydedilemedi");
    } finally {
      setSavingMail(false);
    }
  };

  const renderVariableBadges = (key) => {
    const vars = VARIABLE_INFO[key] || [];
    return (
      <View style={styles.badgeRow}>
        {vars.map((v) => (
          <View key={v} style={styles.badge}>
            <Text style={styles.badgeText}>{v}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.adminText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sistem Ayarları</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══ MAİL AYARLARI KARTI ══════════════════════════════════════════ */}
          <Text style={styles.sectionTitle}>📨 Mail Ayarları</Text>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setMailSectionOpen((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeaderLeft}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#FEF3C7" }]}
                >
                  <Ionicons name="settings-outline" size={20} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.templateName}>Gönderen Mail Hesabı</Text>
                  <Text style={styles.templateSubject} numberOfLines={1}>
                    {loadingMailConfig
                      ? "Yükleniyor..."
                      : mailConfig?.user || "Henüz ayarlanmadı"}
                  </Text>
                </View>
              </View>
              <Ionicons
                name={mailSectionOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color={COLORS.adminTextLight}
              />
            </TouchableOpacity>

            {mailSectionOpen && (
              <View style={styles.editArea}>
                {loadingMailConfig ? (
                  <ActivityIndicator
                    color={COLORS.adminPrimary}
                    style={{ marginVertical: 20 }}
                  />
                ) : (
                  <>
                    {/* Servis seçimi */}
                    <Text style={styles.label}>Mail Servisi</Text>
                    <View style={styles.serviceRow}>
                      {MAIL_SERVICES.map((s) => (
                        <TouchableOpacity
                          key={s}
                          style={[
                            styles.serviceBtn,
                            mailService === s && styles.serviceBtnActive,
                          ]}
                          onPress={() => setMailService(s)}
                        >
                          <Text
                            style={[
                              styles.serviceBtnText,
                              mailService === s && styles.serviceBtnTextActive,
                            ]}
                          >
                            {s}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Mail adresi */}
                    <Text style={styles.label}>Mail Adresi</Text>
                    <TextInput
                      style={styles.inputSingle}
                      value={mailUser}
                      onChangeText={setMailUser}
                      placeholder="ornek@gmail.com"
                      placeholderTextColor={COLORS.adminTextLight}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    {/* Uygulama şifresi */}
                    <Text style={styles.label}>
                      Uygulama Şifresi{" "}
                      {mailConfig?.hasPassword && (
                        <Text
                          style={{ color: COLORS.adminTextLight, fontSize: 11 }}
                        >
                          (boş bırakırsan mevcut şifre korunur)
                        </Text>
                      )}
                    </Text>
                    <View style={styles.passRow}>
                      <TextInput
                        style={[styles.inputSingle, { flex: 1 }]}
                        value={mailPass}
                        onChangeText={setMailPass}
                        placeholder={
                          mailConfig?.hasPassword
                            ? "Değiştirmek için girin..."
                            : "Uygulama şifresini girin..."
                        }
                        placeholderTextColor={COLORS.adminTextLight}
                        secureTextEntry={!showPass}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.eyeBtn}
                        onPress={() => setShowPass((v) => !v)}
                      >
                        <Ionicons
                          name={showPass ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color={COLORS.adminTextLight}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Gönderen adı */}
                    <Text style={styles.label}>Gönderen Adı</Text>
                    <TextInput
                      style={styles.inputSingle}
                      value={mailFrom}
                      onChangeText={setMailFrom}
                      placeholder="Tekno Mağaza <ornek@gmail.com>"
                      placeholderTextColor={COLORS.adminTextLight}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />

                    <View style={styles.infoBox}>
                      <Ionicons
                        name="information-circle-outline"
                        size={16}
                        color="#1E40AF"
                      />
                      <Text style={styles.infoText}>
                        Gmail kullanıyorsan Google hesabından "Uygulama Şifresi"
                        oluşturman gerekir. Normal Gmail şifresi çalışmaz.
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.saveBtn,
                        { backgroundColor: "#D97706" },
                        savingMail && { opacity: 0.6 },
                      ]}
                      onPress={saveMailConfig}
                      disabled={savingMail}
                    >
                      {savingMail ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={18}
                            color="#fff"
                          />
                          <Text style={styles.saveBtnText}>
                            Mail Ayarlarını Kaydet
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>

          {/* ══ E-POSTA ŞABLONLARI ════════════════════════════════════════════ */}
          <Text style={styles.sectionTitle}>✉️ E-posta Şablonları</Text>
          <Text style={styles.sectionInfo}>
            Uygulamanın gönderdiği maillerin içeriklerini düzenleyin.
            Değişkenler gönderim sırasında otomatik doldurulur.
          </Text>

          {loadingTemplates ? (
            <ActivityIndicator
              size="large"
              color={COLORS.adminPrimary}
              style={{ marginTop: 24 }}
            />
          ) : (
            templates.map((template) => (
              <View key={template.key} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => selectTemplate(template.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeaderLeft}>
                    <View style={styles.iconCircle}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={COLORS.adminPrimary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.templateName}>{template.name}</Text>
                      <Text style={styles.templateSubject} numberOfLines={1}>
                        {template.subject}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name={
                      selectedKey === template.key
                        ? "chevron-up"
                        : "chevron-down"
                    }
                    size={20}
                    color={COLORS.adminTextLight}
                  />
                </TouchableOpacity>

                {selectedKey === template.key && (
                  <View style={styles.editArea}>
                    {loadingDetail ? (
                      <ActivityIndicator
                        color={COLORS.adminPrimary}
                        style={{ marginVertical: 20 }}
                      />
                    ) : (
                      <>
                        <Text style={styles.label}>
                          Kullanılabilir Değişkenler
                        </Text>
                        {renderVariableBadges(template.key)}

                        <Text style={styles.label}>Mail Konusu</Text>
                        <TextInput
                          style={styles.inputSingle}
                          value={editSubject}
                          onChangeText={setEditSubject}
                          placeholder="Mail konusunu girin..."
                          placeholderTextColor={COLORS.adminTextLight}
                        />

                        <Text style={styles.label}>HTML İçeriği</Text>
                        <TextInput
                          style={styles.inputMulti}
                          value={editHtml}
                          onChangeText={setEditHtml}
                          multiline
                          placeholder="HTML içeriğini girin..."
                          placeholderTextColor={COLORS.adminTextLight}
                          textAlignVertical="top"
                          autoCorrect={false}
                          autoCapitalize="none"
                        />

                        <TouchableOpacity
                          style={[
                            styles.saveBtn,
                            savingTemplate && { opacity: 0.6 },
                          ]}
                          onPress={saveTemplate}
                          disabled={savingTemplate}
                        >
                          {savingTemplate ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <>
                              <Ionicons
                                name="checkmark-circle-outline"
                                size={18}
                                color="#fff"
                              />
                              <Text style={styles.saveBtnText}>Kaydet</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.adminText,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.adminText,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionInfo: {
    fontSize: 13,
    color: COLORS.adminTextLight,
    marginHorizontal: 16,
    marginBottom: 8,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  templateName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.adminText,
    marginBottom: 2,
  },
  templateSubject: {
    fontSize: 12,
    color: COLORS.adminTextLight,
  },
  editArea: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.adminTextLight,
    marginBottom: 6,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 4,
  },
  badge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.adminPrimary,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  inputSingle: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.adminText,
    backgroundColor: "#fff",
  },
  inputMulti: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 12,
    color: COLORS.adminText,
    backgroundColor: "#fff",
    minHeight: 200,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  serviceRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  serviceBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  serviceBtnActive: {
    backgroundColor: "#D97706",
    borderColor: "#D97706",
  },
  serviceBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.adminTextLight,
    textTransform: "capitalize",
  },
  serviceBtnTextActive: {
    color: "#fff",
  },
  passRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eyeBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: "#1E40AF",
    flex: 1,
    lineHeight: 18,
  },
  saveBtn: {
    backgroundColor: COLORS.adminPrimary,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
