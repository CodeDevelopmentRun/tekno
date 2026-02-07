import React from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");
const SLIDER_WIDTH = width - 40;

const sliderData = [
  {
    id: 1,
    image: "https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=Kampanya+1",
  },
  {
    id: 2,
    image: "https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Kampanya+2",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/400x200/FFE66D/000000?text=Kampanya+3",
  },
];

export default function Slider() {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {sliderData.map((item) => (
          <TouchableOpacity key={item.id} style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingRight: 20,
  },
  slide: {
    width: SLIDER_WIDTH,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
