import React, { useState, useRef } from "react";
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

export default function VerifyCodeScreen({ navigation, route }) {
  const { email } = route.params;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleCodeChange = (text, index) => {
    // Sadece sayı girişine izin ver
    if (text && !/^\d+$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Otomatik ileri gitme
    if (text && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Backspace ile geri gitme
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join("");

    if (enteredCode.length !== 6) {
      Alert.alert("Hata", "Lütfen 6 haneli kodu eksiksiz girin");
      return;
    }

    setLoading(true);

    try {
      await AuthAPI.verifyResetCode(email, enteredCode);

      setLoading(false);

      // Kod doğru - Şifre sıfırlama ekranına git
      navigation.navigate("ResetPassword", { email, code: enteredCode });
    } catch (error) {
      setLoading(false);
      Alert.alert("Hata", error.message || "Geçersiz veya süresi dolmuş kod");
    }
  };

  const handleResendCode = async () => {
    setResending(true);

    try {
      await AuthAPI.forgotPassword(email);

      setResending(false);

      // Kodu temizle
      setCode(["", "", "", "", "", ""]);
      inputRefs[0].current?.focus();

      Alert.alert(
        "✅ Kod Tekrar Gönderildi",
        "Yeni doğrulama kodu e-posta adresinize gönderildi.",
      );
    } catch (error) {
      setResending(false);
      Alert.alert("Hata", "Kod gönderilemedi. Lütfen tekrar deneyin.");
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
              <Ionicons
                name="shield-checkmark"
                size={60}
                color={COLORS.primary}
              />
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Kodu Doğrula</Text>
            <Text style={styles.subtitle}>
              {email} adresine gönderilen 6 haneli doğrulama kodunu girin
            </Text>
          </View>

          {/* Code Input */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[styles.codeInput, digit && styles.codeInputFilled]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!loading && !resending}
              />
            ))}
          </View>

          {/* Timer Info */}
          <View style={styles.timerBox}>
            <Ionicons name="time-outline" size={18} color={COLORS.warning} />
            <Text style={styles.timerText}>
              Kod 10 dakika boyunca geçerlidir
            </Text>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              loading && styles.verifyButtonDisabled,
            ]}
            onPress={handleVerifyCode}
            disabled={loading || resending}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.white}
                  style={styles.buttonIcon}
                />
                <Text style={styles.verifyButtonText}>Doğrula</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Resend Code */}
          <View style={styles.resendSection}>
            <Text style={styles.resendText}>Kod gelmedi mi?</Text>
            <TouchableOpacity
              onPress={handleResendCode}
              disabled={loading || resending}
            >
              {resending ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.resendLink}>Tekrar Gönder</Text>
              )}
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
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.black,
    backgroundColor: COLORS.lightGray,
  },
  codeInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  timerBox: {
    flexDirection: "row",
    backgroundColor: `${COLORS.warning}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 13,
    color: COLORS.warning,
    marginLeft: 8,
    fontWeight: "500",
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  buttonIcon: {
    marginRight: 8,
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  resendSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    padding: 12,
  },
  resendText: {
    fontSize: 15,
    color: COLORS.gray,
    marginRight: 8,
  },
  resendLink: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "bold",
  },
});
