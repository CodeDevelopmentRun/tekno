import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");
const SLIDER_WIDTH = width - 10;

// GERÇEK DOSYA İSİMLERİ!
const sliderData = [
  {
    id: 1,
    image: require("../../../assets/images/bannerr.jpg"),
  },
  {
    id: 2,
    image: require("../../../assets/images/banner1.png"),
  },
  {
    id: 3,
    image: require("../../../assets/images/banner2.jpeg"),
  },
];

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % sliderData.length;
      setActiveIndex(nextIndex);

      scrollViewRef.current?.scrollTo({
        x: nextIndex * (SLIDER_WIDTH + 16),
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (SLIDER_WIDTH + 16));
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        onMomentumScrollEnd={handleScroll}
      >
        {sliderData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.slide}
            activeOpacity={0.9}
          >
            <Image source={item.image} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {sliderData.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
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
    height: 300,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#FF6B35",
    width: 24,
  },
});
