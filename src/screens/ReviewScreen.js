import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

function StarRating({ value, onChange }) {
  const labels = ["", "Çok Kötü", "Kötü", "Orta", "İyi", "Mükemmel"];
  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onChange(star)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={star <= value ? "star" : "star-outline"}
              size={42}
              color={star <= value ? "#F59E0B" : "#D1D5DB"}
            />
          </TouchableOpacity>
        ))}
      </View>
      {value > 0 && <Text style={styles.ratingLabel}>{labels[value]}</Text>}
    </View>
  );
}

export default function ReviewScreen({ route, navigation }) {
  const { productId, productName, orderId } = route.params;
  const { isDarkMode, colors } = useTheme();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";
  const inputBg = isDarkMode ? "rgba(255,255,255,0.06)" : "#F9FAFB";

  const handleSubmit = async () => {
    if (rating === 0) return Alert.alert("Uyarı", "Lütfen bir puan seçin");
    if (comment.trim().length < 5)
      return Alert.alert("Uyarı", "Yorum en az 5 karakter olmalıdır");

    setSubmitting(true);
    try {
      await api.post(`/products/${productId}/review`, {
        rating,
        comment: comment.trim(),
        orderId,
      });
      Alert.alert("Teşekkürler! 🎉", "Yorumunuz başarıyla kaydedildi.", [
        { text: "Tamam", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Hata", e.response?.data?.message || "Yorum gönderilemedi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color={tp} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: tp }]}>Ürünü Değerlendir</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Ürün adı */}
            <View
              style={[
                styles.productCard,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <Ionicons name="cube-outline" size={28} color={colors.primary} />
              <Text
                style={[styles.productName, { color: tp }]}
                numberOfLines={2}
              >
                {productName}
              </Text>
            </View>

            {/* Yıldız */}
            <View
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <Text style={[styles.cardTitle, { color: tp }]}>Puanınız</Text>
              <StarRating value={rating} onChange={setRating} />
            </View>

            {/* Yorum */}
            <View
              style={[
                styles.card,
                { backgroundColor: cardBg, borderColor: cardBorder },
              ]}
            >
              <Text style={[styles.cardTitle, { color: tp }]}>Yorumunuz</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: inputBg,
                    borderColor: cardBorder,
                    color: tp,
                  },
                ]}
                placeholder="Bu ürün hakkında ne düşünüyorsunuz? (en az 5 karakter)"
                placeholderTextColor={tm}
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={5}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, { color: tm }]}>
                {comment.length}/500
              </Text>
            </View>

            {/* Gönder */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (submitting || rating === 0) && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitting || rating === 0}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={20} color="#fff" />
                  <Text style={styles.submitBtnText}>Yorumu Gönder</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
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
  backBtn: { width: 40, alignItems: "flex-start" },
  title: { fontSize: 18, fontWeight: "700" },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  productName: { fontSize: 15, fontWeight: "600", flex: 1, lineHeight: 22 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 16,
    alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "700", alignSelf: "flex-start" },
  ratingLabel: { fontSize: 16, fontWeight: "700", color: "#F59E0B" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 120,
  },
  charCount: { fontSize: 12, alignSelf: "flex-end" },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
