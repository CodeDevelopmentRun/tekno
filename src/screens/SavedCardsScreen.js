import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axiosConfig";

export default function SavedCardsScreen({ navigation }) {
  const { isDarkMode, colors } = useTheme();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const tp = isDarkMode ? "#FFFFFF" : "#111827";
  const tm = isDarkMode ? "#BBBBBB" : "#6B7280";
  const cardBg = isDarkMode ? "rgba(255,255,255,0.08)" : "#FFFFFF";
  const cardBorder = isDarkMode ? "rgba(255,255,255,0.15)" : "#E5E7EB";

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await api.get("/users/profile");
      setCards(res.data?.data?.cards || []);
    } catch (e) {
      Alert.alert("Hata", "Kartlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = (cardId) => {
    Alert.alert("Kartı Sil", "Bu kartı silmek istediğinize emin misiniz?", [
      { text: "Vazgeç", style: "cancel" },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          try {
            // Backend'de kart silme rotası olduğunu varsayıyoruz (yoksa bir sonraki adımda ekleriz)
            await api.delete(`/users/cards/${cardId}`);
            setCards(cards.filter((c) => c._id !== cardId));
          } catch (e) {
            Alert.alert("Hata", "Kart silinemedi.");
          }
        },
      },
    ]);
  };

  const renderCard = ({ item }) => (
    <View
      style={[
        styles.cardItem,
        { backgroundColor: cardBg, borderColor: cardBorder },
      ]}
    >
      <View style={styles.cardInfo}>
        <Ionicons name="card" size={32} color={colors.primary} />
        <View style={{ marginLeft: 15 }}>
          <Text style={[styles.cardTitle, { color: tp }]}>
            {item.cardTitle}
          </Text>
          <Text style={[styles.cardHolder, { color: tm }]}>
            {item.cardHolder}
          </Text>
          <Text style={[styles.cardDigits, { color: tp }]}>
            **** **** **** {item.lastFourDigits}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => deleteCard(item._id)}>
        <Ionicons name="trash-outline" size={24} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={tp} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: tp }]}>
            Kayıtlı Kartlarım
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 50 }} color={colors.primary} />
        ) : (
          <FlatList
            data={cards}
            keyExtractor={(item) => item._id}
            renderItem={renderCard}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: tm }]}>
                Kayıtlı kartınız bulunmuyor.
              </Text>
            }
          />
        )}
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
  list: { padding: 20, gap: 16 },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardHolder: { fontSize: 13, marginTop: 2 },
  cardDigits: { fontSize: 14, marginTop: 4, letterSpacing: 1 },
  emptyText: { textAlign: "center", marginTop: 50, fontSize: 15 },
});
