import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { CartContext } from "../context/CartContext";
import api from "../api/axiosConfig";

const InputField = ({
  label,
  field,
  placeholder,
  keyboardType,
  form,
  handleChange,
  inputBg,
  cardBorder,
  tp,
  tm,
  maxLength,
}) => (
  <View style={styles.inputGroup}>
    <Text style={[styles.label, { color: tm }]}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        { backgroundColor: inputBg, borderColor: cardBorder, color: tp },
      ]}
      placeholder={placeholder}
      placeholderTextColor={tm}
      value={form[field]}
      onChangeText={(v) => handleChange(field, v)}
      keyboardType={keyboardType || "default"}
      maxLength={maxLength}
    />
  </View>
);

export default function CheckoutScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();
  const { cartItems, clearCart } = useContext(CartContext);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const ts = isDarkMode ? "#DDDDDD" : "#374151";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";
  const inputBg = isDarkMode ? "rgba(255,255,255,0.06)" : "#F9FAFB";

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    address: "",
  });
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    cardHolder: "",
    expiry: "",
    cvv: "",
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const handleCardChange = (key, value) =>
    setCardForm((prev) => ({ ...prev, [key]: value }));

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ") : cleaned;
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleOrder = async () => {
    const { fullName, phone, city, district, address } = form;
    if (!fullName || !phone || !city || !district || !address) {
      Alert.alert("Eksik Bilgi", "Lütfen tüm teslimat alanlarını doldurun.");
      return;
    }
    if (paymentMethod === "credit_card") {
      if (
        !cardForm.cardNumber ||
        !cardForm.cardHolder ||
        !cardForm.expiry ||
        !cardForm.cvv
      ) {
        Alert.alert("Eksik Bilgi", "Lütfen kart bilgilerini doldurun.");
        return;
      }
    }
    try {
      setLoading(true);
      const res = await api.post("/orders", {
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      navigation.replace("OrderSuccess", { order: res.data.data });
    } catch (e) {
      Alert.alert(
        "Hata",
        e.response?.data?.message || "Sipariş oluşturulamadı",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: tp }]}>Teslimat Bilgileri</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Adres Formu */}
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: tp }]}>
              📍 Teslimat Adresi
            </Text>
            <InputField
              label="Ad Soyad"
              field="fullName"
              placeholder="Ad Soyad"
              form={form}
              handleChange={handleChange}
              inputBg={inputBg}
              cardBorder={cardBorder}
              tp={tp}
              tm={tm}
            />
            <InputField
              label="Telefon"
              field="phone"
              placeholder="05XX XXX XX XX"
              keyboardType="phone-pad"
              form={form}
              handleChange={handleChange}
              inputBg={inputBg}
              cardBorder={cardBorder}
              tp={tp}
              tm={tm}
            />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputField
                  label="Şehir"
                  field="city"
                  placeholder="İstanbul"
                  form={form}
                  handleChange={handleChange}
                  inputBg={inputBg}
                  cardBorder={cardBorder}
                  tp={tp}
                  tm={tm}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <InputField
                  label="İlçe"
                  field="district"
                  placeholder="Kadıköy"
                  form={form}
                  handleChange={handleChange}
                  inputBg={inputBg}
                  cardBorder={cardBorder}
                  tp={tp}
                  tm={tm}
                />
              </View>
            </View>
            <InputField
              label="Adres"
              field="address"
              placeholder="Mahalle, sokak, bina no..."
              form={form}
              handleChange={handleChange}
              inputBg={inputBg}
              cardBorder={cardBorder}
              tp={tp}
              tm={tm}
            />
          </View>

          {/* Ödeme Yöntemi */}
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: tp }]}>
              💳 Ödeme Yöntemi
            </Text>
            {[
              {
                key: "credit_card",
                label: "Kredi / Banka Kartı",
                icon: "card-outline",
              },
              {
                key: "cash_on_delivery",
                label: "Kapıda Ödeme",
                icon: "cash-outline",
              },
            ].map((pm) => (
              <TouchableOpacity
                key={pm.key}
                style={[
                  styles.paymentOption,
                  {
                    borderColor:
                      paymentMethod === pm.key ? colors.primary : cardBorder,
                  },
                  paymentMethod === pm.key && {
                    backgroundColor: colors.primary + "15",
                  },
                ]}
                onPress={() => setPaymentMethod(pm.key)}
              >
                <Ionicons
                  name={pm.icon}
                  size={22}
                  color={paymentMethod === pm.key ? colors.primary : tm}
                />
                <Text
                  style={[
                    styles.paymentLabel,
                    { color: paymentMethod === pm.key ? colors.primary : ts },
                  ]}
                >
                  {pm.label}
                </Text>
                {paymentMethod === pm.key && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            ))}

            {/* Kart Bilgileri - sadece kredi kartı seçilince */}
            {paymentMethod === "credit_card" && (
              <View
                style={[styles.cardFormContainer, { borderColor: cardBorder }]}
              >
                <Text style={[styles.cardFormTitle, { color: tp }]}>
                  Kart Bilgileri
                </Text>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: tm }]}>
                    Kart Numarası
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBg,
                        borderColor: cardBorder,
                        color: tp,
                      },
                    ]}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor={tm}
                    value={cardForm.cardNumber}
                    onChangeText={(v) =>
                      handleCardChange("cardNumber", formatCardNumber(v))
                    }
                    keyboardType="numeric"
                    maxLength={19}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.label, { color: tm }]}>
                    Kart Üzerindeki İsim
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: inputBg,
                        borderColor: cardBorder,
                        color: tp,
                      },
                    ]}
                    placeholder="AD SOYAD"
                    placeholderTextColor={tm}
                    value={cardForm.cardHolder}
                    onChangeText={(v) =>
                      handleCardChange("cardHolder", v.toUpperCase())
                    }
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: tm }]}>
                        Son Kullanma
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: inputBg,
                            borderColor: cardBorder,
                            color: tp,
                          },
                        ]}
                        placeholder="AA/YY"
                        placeholderTextColor={tm}
                        value={cardForm.expiry}
                        onChangeText={(v) =>
                          handleCardChange("expiry", formatExpiry(v))
                        }
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.inputGroup}>
                      <Text style={[styles.label, { color: tm }]}>CVV</Text>
                      <TextInput
                        style={[
                          styles.input,
                          {
                            backgroundColor: inputBg,
                            borderColor: cardBorder,
                            color: tp,
                          },
                        ]}
                        placeholder="***"
                        placeholderTextColor={tm}
                        value={cardForm.cvv}
                        onChangeText={(v) => handleCardChange("cvv", v)}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Özet */}
          <View
            style={[
              styles.card,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: tp }]}>
              🛒 Sipariş Özeti
            </Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: tm }]}>
                {cartItems.length} ürün
              </Text>
              <Text style={[styles.summaryValue, { color: tp }]}>
                {total.toLocaleString()} TL
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: tm }]}>Kargo</Text>
              <Text style={{ color: "#10B981", fontWeight: "600" }}>
                Ücretsiz
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: cardBorder }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: tp }]}>Toplam</Text>
              <Text style={[styles.totalValue, { color: tp }]}>
                {total.toLocaleString()} TL
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            { backgroundColor: colors.background, borderColor: cardBorder },
          ]}
        >
          <TouchableOpacity
            style={[styles.orderBtn, loading && { opacity: 0.7 }]}
            onPress={handleOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.orderBtnText}>Siparişi Onayla</Text>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#FFF"
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  scroll: { padding: 20, gap: 16, paddingBottom: 20 },
  card: { borderRadius: 16, borderWidth: 1, padding: 18, gap: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: "500" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  row: { flexDirection: "row" },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
  },
  paymentLabel: { fontSize: 15, fontWeight: "500" },
  cardFormContainer: {
    borderTopWidth: 1,
    paddingTop: 16,
    gap: 14,
  },
  cardFormTitle: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: "600" },
  divider: { height: 1, marginVertical: 4 },
  totalLabel: { fontSize: 16, fontWeight: "700" },
  totalValue: { fontSize: 20, fontWeight: "bold" },
  bottomBar: { padding: 20, borderTopWidth: 1 },
  orderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 14,
  },
  orderBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});
