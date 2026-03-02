import React, { useState, useContext } from "react";
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
import { AdminContext } from "../context/AdminContext";
import { COLORS } from "../utils/colors";

export default function AdminLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useContext(AdminContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun");
      return;
    }
    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);
    if (result.success) {
      navigation.replace("AdminPanel");
    } else {
      Alert.alert("Giriş Başarısız", result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.adminText} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons
                name="shield-checkmark"
                size={60}
                color={COLORS.adminPrimary}
              />
            </View>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>Yönetim paneline giriş yapın</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.adminTextLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor={COLORS.adminTextLight}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.adminTextLight}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor={COLORS.adminTextLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.adminTextLight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={COLORS.adminInfo}
              />
              <Text style={styles.infoText}>admin@tekno.com / admin123</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.adminBackground },
  keyboardView: { flex: 1 },
  header: { padding: 20 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: { flex: 1, justifyContent: "center", padding: 20 },
  logoContainer: { alignItems: "center", marginBottom: 40 },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.adminText,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: COLORS.adminTextLight },
  form: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: COLORS.adminText },
  eyeIcon: { padding: 8 },
  loginButton: {
    backgroundColor: COLORS.adminPrimary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: COLORS.adminPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: COLORS.white, fontSize: 18, fontWeight: "bold" },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.adminInfo,
    fontWeight: "500",
  },
});
