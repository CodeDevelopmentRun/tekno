import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { CartContext } from "../context/CartContext";
import api from "../api/axiosConfig";

// 81 İl Listesi
const CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "Mersin",
  "İstanbul",
  "İzmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Kahramanmaraş",
  "Mardin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Şanlıurfa",
  "Uşak",
  "Van",
  "Yozgat",
  "Zonguldak",
  "Aksaray",
  "Bayburt",
  "Karaman",
  "Kırıkkale",
  "Batman",
  "Şırnak",
  "Bartın",
  "Ardahan",
  "Iğdır",
  "Yalova",
  "Karabük",
  "Kilis",
  "Osmaniye",
  "Düzce",
];

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
      maxLength={maxLength || 50}
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
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // Stateler
  const [saveCard, setSaveCard] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]); // ✅ Yeni eklendi
  const [selectedAddressId, setSelectedAddressId] = useState(null); // ✅ Yeni eklendi

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

  // Kullanıcı verilerini çek (Kartlar ve Adresler)
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await api.get("/users/profile");
      if (res.data?.data) {
        setSavedCards(res.data.data.cards || []);
        setSavedAddresses(res.data.data.addresses || []); // ✅ Adresleri state'e yükle
      }
    } catch (e) {
      console.log("Kullanıcı verileri çekilemedi:", e.message);
    }
  };

  // ✅ Kayıtlı adresi seçince formu doldurma fonksiyonu
  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      city: addr.city,
      district: addr.district,
      address: addr.address,
    });
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (selectedAddressId) setSelectedAddressId(null); // Manuel değişiklik yapılırsa seçimi kaldır
  };

  const handleCardChange = (key, value) => {
    setCardForm((prev) => ({ ...prev, [key]: value }));
    if (selectedSavedCard) setSelectedSavedCard(null);
  };

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
    if (paymentMethod === "credit_card" && !selectedSavedCard) {
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
        cardForm: paymentMethod === "credit_card" ? cardForm : null,
        saveCard: saveCard,
        useSavedCard: selectedSavedCard,
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

            {/* ✅ Kayıtlı Adresler Yatay Liste */}
            {savedAddresses.length > 0 && (
              <View style={{ marginBottom: 15 }}>
                <Text style={[styles.label, { color: tm, marginBottom: 8 }]}>
                  Kayıtlı Adreslerim
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ flexDirection: "row" }}
                >
                  {savedAddresses.map((addr) => (
                    <TouchableOpacity
                      key={addr._id}
                      onPress={() => handleSelectAddress(addr)}
                      style={[
                        {
                          padding: 12,
                          borderRadius: 12,
                          borderWidth: 1,
                          marginRight: 10,
                          backgroundColor: inputBg,
                          borderColor:
                            selectedAddressId === addr._id
                              ? colors.primary
                              : cardBorder,
                          minWidth: 140,
                        },
                      ]}
                    >
                      <Ionicons
                        name="location"
                        size={18}
                        color={
                          selectedAddressId === addr._id ? colors.primary : tm
                        }
                      />
                      <Text
                        style={{ color: tp, fontWeight: "600", marginTop: 4 }}
                        numberOfLines={1}
                      >
                        {addr.fullName}
                      </Text>
                      <Text
                        style={{ color: tm, fontSize: 11 }}
                        numberOfLines={1}
                      >
                        {addr.district} / {addr.city}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

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
              maxLength={11}
            />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: tm, marginBottom: 6 }]}>
                  Şehir
                </Text>
                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBg,
                      borderColor: cardBorder,
                      justifyContent: "center",
                    },
                  ]}
                  onPress={() => setCityModalVisible(true)}
                >
                  <Text style={{ color: form.city ? tp : tm }}>
                    {form.city || "Seçiniz"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ width: 12 }} />

              <View style={{ flex: 1 }}>
                <InputField
                  label="İlçe"
                  field="district"
                  placeholder="ilçe"
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

            {/* Kayıtlı Kartlar Listesi */}
            {paymentMethod === "credit_card" && savedCards.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.label, { color: tm, marginBottom: 8 }]}>
                  Kayıtlı Kartlarım
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ flexDirection: "row" }}
                >
                  {savedCards.map((card) => (
                    <TouchableOpacity
                      key={card._id}
                      onPress={() => {
                        setSelectedSavedCard(card._id);
                        setCardForm({
                          cardNumber: "**** **** **** " + card.lastFourDigits,
                          cardHolder: card.cardHolder,
                          expiry: card.expiry,
                          cvv: "***",
                        });
                      }}
                      style={[
                        {
                          padding: 12,
                          borderRadius: 12,
                          borderWidth: 1,
                          marginRight: 10,
                          backgroundColor: inputBg,
                          borderColor:
                            selectedSavedCard === card._id
                              ? colors.primary
                              : cardBorder,
                          minWidth: 150,
                        },
                      ]}
                    >
                      <Ionicons
                        name="card"
                        size={20}
                        color={
                          selectedSavedCard === card._id ? colors.primary : tm
                        }
                      />
                      <Text
                        style={{ color: tp, fontWeight: "600", marginTop: 4 }}
                      >
                        {card.cardTitle}
                      </Text>
                      <Text style={{ color: tm, fontSize: 12 }}>
                        **** {card.lastFourDigits}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Kart Bilgileri */}
            {paymentMethod === "credit_card" && (
              <View
                style={[styles.cardFormContainer, { borderColor: cardBorder }]}
              >
                <Text style={[styles.cardFormTitle, { color: tp }]}>
                  {selectedSavedCard
                    ? "Seçili Kart Bilgileri"
                    : "Yeni Kart Bilgileri"}
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
                    editable={!selectedSavedCard}
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
                    editable={!selectedSavedCard}
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
                        editable={!selectedSavedCard}
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
                        editable={!selectedSavedCard}
                        onChangeText={(v) => handleCardChange("cvv", v)}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>

                {!selectedSavedCard && (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                      paddingVertical: 5,
                    }}
                    onPress={() => setSaveCard(!saveCard)}
                  >
                    <Ionicons
                      name={saveCard ? "checkbox" : "square-outline"}
                      size={22}
                      color={saveCard ? colors.primary : tm}
                    />
                    <Text style={{ color: tp, marginLeft: 10, fontSize: 14 }}>
                      Kartımı gelecekteki alışverişler için kaydet
                    </Text>
                  </TouchableOpacity>
                )}
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

        {/* Şehir Seçim Modalı */}
        <Modal
          visible={cityModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: tp }]}>
                  Şehir Seçin
                </Text>
                <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                  <Ionicons name="close" size={26} color={tp} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={CITIES}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.cityItem, { borderBottomColor: cardBorder }]}
                    onPress={() => {
                      handleChange("city", item);
                      setCityModalVisible(false);
                    }}
                  >
                    <Text style={{ color: tp, fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
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
    height: 50,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "60%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  cityItem: { paddingVertical: 16, borderBottomWidth: 1 },
});
