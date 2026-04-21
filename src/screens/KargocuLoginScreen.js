import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

const getApiUrl = () => {
  if (Platform.OS === "android" && !Constants.isDevice) {
    return "http://10.0.2.2:5000";
  }
  return "http://10.72.10.90:5000";
};
const API_URL = getApiUrl();

export default function KargocuLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert("Hata", "E-posta ve şifre gerekli");

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/courier/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Giriş başarısız");

      await AsyncStorage.setItem("courierToken", data.token);
      await AsyncStorage.setItem("courierUser", JSON.stringify(data));
      navigation.replace("CourierDashboard");
    } catch (err) {
      Alert.alert("Hata", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Geri butonu */}
      <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Logo / başlık */}
      <View style={s.header}>
        <View style={s.iconBox}>
          <Ionicons name="bicycle" size={48} color="#FF6B35" />
        </View>
        <Text style={s.title}>Kargocu Girişi</Text>
        <Text style={s.subtitle}>Yetiş Kargo Teslimat Paneli</Text>
      </View>

      {/* Form */}
      <View style={s.form}>
        <Text style={s.label}>E-posta</Text>
        <TextInput
          style={s.input}
          value={email}
          onChangeText={setEmail}
          placeholder="ulas@yetiskargo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />

        <Text style={s.label}>Şifre</Text>
        <View style={s.passRow}>
          <TextInput
            style={[s.input, { flex: 1, marginBottom: 0 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••"
            secureTextEntry={!showPass}
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={s.eye}
            onPress={() => setShowPass(!showPass)}
          >
            <Ionicons
              name={showPass ? "eye-off" : "eye"}
              size={22}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[s.btn, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnText}>Giriş Yap</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", paddingHorizontal: 24 },
  back: { marginTop: 56, marginBottom: 8 },
  header: { alignItems: "center", marginTop: 16, marginBottom: 36 },
  iconBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: "#FFF0EA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 26, fontWeight: "700", color: "#1A1A2E" },
  subtitle: { fontSize: 14, color: "#888", marginTop: 6 },
  form: { gap: 6 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 4,
  },
  passRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  eye: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  btn: {
    backgroundColor: "#FF6B35",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 28,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
