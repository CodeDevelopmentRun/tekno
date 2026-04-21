import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import api from "../../api/axiosConfig";

const { width } = Dimensions.get("window");
// pagingEnabled ile margin çakışmasın diye tam ekran genişliği kullan
const SLIDER_WIDTH = width - 40; // paddingHorizontal: 20 * 2

// Yerel fallback görseller (API boşsa gösterilir)
const LOCAL_BANNERS = [
  { id: "local_1", image: require("../../../assets/images/bannerr.jpg") },
  { id: "local_2", image: require("../../../assets/images/banner1.png") },
  { id: "local_3", image: require("../../../assets/images/banner2.jpeg") },
];

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    fetchBanners();
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get("/banners");
      const data = res.data?.data || [];
      // Sadece aktif banner'ları al
      const active = data.filter((b) => b.isActive !== false);
      setBanners(active.length > 0 ? active : LOCAL_BANNERS);
    } catch {
      // API yoksa yerel görsellere düş
      setBanners(LOCAL_BANNERS);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll — banners değiştiğinde yeniden kur
  useEffect(() => {
    if (banners.length <= 1) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % banners.length;
        // scrollTo içinde state değil doğrudan hesaplanan index kullan
        scrollViewRef.current?.scrollTo({
          x: next * SLIDER_WIDTH,
          animated: true,
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [banners]);

  const handleScroll = useCallback((event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / SLIDER_WIDTH);
    setActiveIndex(index);
  }, []);

  const goToSlide = (index) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * SLIDER_WIDTH,
      animated: true,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingBox]}>
        <ActivityIndicator color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        // pagingEnabled + tam genişlik slide → mükemmel hizalama
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        // Dışarıdan padding yerine decelerationRate ile kontrol
        decelerationRate="fast"
        scrollEventThrottle={16}
      >
        {banners.map((item) => (
          <TouchableOpacity
            key={item.id || item._id}
            activeOpacity={0.92}
            style={styles.slide}
          >
            <Image
              source={
                item.image
                  ? item.image // yerel require
                  : { uri: item.imageUrl || item.url } // API'dan gelen URL
              }
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {banners.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
            <View style={[styles.dot, i === activeIndex && styles.activeDot]} />
          </TouchableOpacity>
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
  loadingBox: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  // margin YOK — pagingEnabled tam SLIDER_WIDTH adımlarla kayar
  slide: {
    width: SLIDER_WIDTH,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  activeDot: {
    backgroundColor: "#FF6B35",
    width: 24,
    borderRadius: 4,
  },
});
