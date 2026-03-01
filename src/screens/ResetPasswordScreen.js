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
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/colors";
import { AuthAPI } from "../api/authService";

export default function ResetPasswordScreen({ navigation, route }) {
  const { email, code } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Hata", "Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthAPI.resetPassword(email, code, newPassword);

      setLoading(false);

      Alert.alert(
        "✅ Başarılı!",
        "Şifreniz başarıyla değiştirildi. E-posta adresinize bir bildirim gönderildi.\n\nArtık yeni şifrenizle giriş yapabilirsiniz.",
        [
          {
            text: "Giriş Yap",
            onPress: () => navigation.navigate("Login"),
          },
        ],
      );
    } catch (error) {
      setLoading(false);
      Alert.alert(
        "Hata",
        error.message || "Şifre değiştirilemedi. Lütfen tekrar deneyin.",
      );
    }
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0)
      return { text: "", color: COLORS.gray, width: "0%" };
    if (password.length < 6)
      return { text: "Zayıf", color: COLORS.error, width: "33%" };
    if (password.length < 8)
      return { text: "Orta", color: COLORS.warning, width: "66%" };
    return { text: "Güçlü", color: COLORS.success, width: "100%" };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
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
                <Ionicons name="key" size={60} color={COLORS.primary} />
              </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Yeni Şifre Belirle</Text>
              <Text style={styles.subtitle}>
                Hesabınız için yeni ve güçlü bir şifre oluşturun
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* New Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.gray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Yeni Şifre (min. 6 karakter)"
                  placeholderTextColor={COLORS.gray}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthFill,
                        {
                          backgroundColor: strength.color,
                          width: strength.width,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[styles.strengthText, { color: strength.color }]}
                  >
                    {strength.text}
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.gray}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Şifre Tekrar"
                  placeholderTextColor={COLORS.gray}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>

              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchIndicator}>
                  <Ionicons
                    name={
                      newPassword === confirmPassword
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={18}
                    color={
                      newPassword === confirmPassword
                        ? COLORS.success
                        : COLORS.error
                    }
                  />
                  <Text
                    style={[
                      styles.matchText,
                      {
                        color:
                          newPassword === confirmPassword
                            ? COLORS.success
                            : COLORS.error,
                      },
                    ]}
                  >
                    {newPassword === confirmPassword
                      ? "Şifreler eşleşiyor"
                      : "Şifreler eşleşmiyor"}
                  </Text>
                </View>
              )}

              {/* Tips */}
              <View style={styles.tipsBox}>
                <Text style={styles.tipsTitle}>Güçlü Şifre İpuçları:</Text>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark" size={14} color={COLORS.success} />
                  <Text style={styles.tipText}>En az 6 karakter kullanın</Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark" size={14} color={COLORS.success} />
                  <Text style={styles.tipText}>
                    Büyük ve küçük harf karıştırın
                  </Text>
                </View>
                <View style={styles.tipItem}>
                  <Ionicons name="checkmark" size={14} color={COLORS.success} />
                  <Text style={styles.tipText}>
                    Rakam ve özel karakter ekleyin
                  </Text>
                </View>
              </View>

              {/* Reset Password Button */}
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  loading && styles.resetButtonDisabled,
                ]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-done"
                      size={20}
                      color={COLORS.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.resetButtonText}>Şifremi Değiştir</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    marginBottom: 32,
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
  form: {},
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 12,
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
  eyeIcon: {
    padding: 8,
  },
  strengthContainer: {
    marginBottom: 16,
  },
  strengthBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 6,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  matchIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  matchText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },
  tipsBox: {
    backgroundColor: `${COLORS.primary}08`,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.gray,
    marginLeft: 8,
  },
  resetButton: {
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
    marginBottom: 20,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  resetButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
