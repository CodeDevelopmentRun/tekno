import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function SupportScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  const handleEmail = () => {
    Linking.openURL("mailto:magazamteknoloji@gmail.com");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tp }]}>
            Yardım & Destek
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="help-buoy-outline"
              size={80}
              color={colors.primary}
            />
          </View>

          <Text style={[styles.title, { color: tp }]}>
            Size nasıl yardımcı olabiliriz?
          </Text>
          <Text style={[styles.description, { color: tm }]}>
            Sorularınız, önerileriniz veya teknik destek talepleriniz için bize
            her zaman ulaşabilirsiniz.
          </Text>

          <TouchableOpacity
            style={[
              styles.contactCard,
              { backgroundColor: cardBg, borderColor: cardBorder },
            ]}
            onPress={handleEmail}
          >
            <View
              style={[
                styles.emailIcon,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons name="mail-outline" size={28} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardLabel, { color: tm }]}>
                E-posta Gönderin
              </Text>
              <Text style={[styles.cardValue, { color: tp }]}>
                magazamteknoloji@gmail.com
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={tm} />
          </TouchableOpacity>

          <View
            style={[styles.infoBox, { backgroundColor: colors.primary + "10" }]}
          >
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: tp }]}>
              E-postalarınıza genellikle 24 saat içinde yanıt veriyoruz.
            </Text>
          </View>
        </ScrollView>
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
    padding: 20,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  content: { padding: 20, alignItems: "center" },
  iconContainer: { marginBottom: 20, marginTop: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    width: "100%",
    gap: 15,
  },
  emailIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLabel: { fontSize: 13, marginBottom: 2 },
  cardValue: { fontSize: 15, fontWeight: "bold" },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    width: "100%",
  },
  infoText: { fontSize: 13, flex: 1 },
});
