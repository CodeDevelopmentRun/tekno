import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";
import { AuthAPI } from "../api/authService";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi giriniz");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Hata", "Geçerli bir e-posta adresi giriniz");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.forgotPassword(email);

      setLoading(false);

      Alert.alert(
        "✅ Kod Gönderildi",
        "Şifre sıfırlama kodu e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.",
        [
          {
            text: "Tamam",
            onPress: () => navigation.navigate("VerifyCode", { email }),
          },
        ],
      );
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Hata",
        error.message || "Kod gönderilemedi. Lütfen tekrar deneyin.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="lock-closed" size={60} color={COLORS.primary} />
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>
              Kayıtlı e-posta adresinizi girin. Size şifre sıfırlama kodu
              göndereceğiz.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.gray}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="E-posta Adresiniz"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.infoText}>
                6 haneli doğrulama kodu e-posta adresinize gönderilecektir.
              </Text>
            </View>

            {/* Send Code Button */}
            <TouchableOpacity
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleSendCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="mail"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.sendButtonText}>Kod Gönder</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => navigation.navigate("Login")}
              disabled={loading}
            >
              <Ionicons
                name="arrow-back-circle-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.backToLoginText}>Giriş sayfasına dön</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: `${COLORS.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.primary,
    marginLeft: 8,
    lineHeight: 18,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  backToLogin: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    padding: 12,
  },
  backToLoginText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "500",
    marginLeft: 8,
  },
});
