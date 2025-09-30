import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");

interface OwnerSelectProps {
  value: string;
  onComplete: (val: string) => void;
}

export default function OwnerSelect({ value, onComplete }: OwnerSelectProps) {
  const owners = ["1st Owner", "2nd Owner", "3rd Owner"]; // Max 3 options
  const [scaleAnims] = useState(owners.map(() => new Animated.Value(1)));

  // Carousel images
  const carouselImages = [
    {
      url: "https://img.freepik.com/free-photo/charming-young-people-female-customer-modern-stylish-bearded-businessman-automobile-saloon_146671-16729.jpg?semt=ais_hybrid&w=740&q=80",
      title: "1st Owner",
    },
    {
      url: "https://prod.rockmedialibrary.com/api/public/content/42e6573896a8487a87f3483e41d039d5?v=69d034a3",
      title: "2nd Owner",
    },
    {
      url: "https://media.istockphoto.com/id/496352632/photo/kindly-car-manager-with-customer.jpg?s=612x612&w=0&k=20&c=v3feHgyg_XcphTMpl2Eim2eBpSQEdBtUE8Y1RMnrmac=",
      title: "3rd Owner",
    },
  ];

  const scrollRef = useRef<ScrollView>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (carouselIndex + 1) % carouselImages.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setCarouselIndex(next);
    }, 3500);
    return () => clearInterval(interval);
  }, [carouselIndex]);

  const handlePress = (owner: string, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[index], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onComplete(owner);
  };

  return (
    <View style={styles.container}>
      {/* Full-width Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
        >
          {carouselImages.map((item, idx) => (
            <View key={idx} style={styles.carouselCard}>
              <Image source={{ uri: item.url }} style={styles.carouselImage} resizeMode="cover" />
              <View style={styles.carouselOverlay}>
                <Text style={styles.carouselTitle}>{item.title}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Number of Previous Owners</Text>
        <Text style={styles.subtitle}>Select the ownership history</Text>
      </View>

      {/* Owner Cards in One Row */}
      <View style={styles.row}>
        {owners.map((owner, index) => {
          const isSelected = value === owner;
          return (
            <Animated.View
              key={owner}
              style={[styles.cardWrapper, { transform: [{ scale: scaleAnims[index] }] }]}
            >
              <TouchableOpacity
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => handlePress(owner, index)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                  <Text style={[styles.iconText, isSelected && styles.iconTextSelected]}>
                    {owner.charAt(0)}
                  </Text>
                </View>
                
                <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                  {owner}
                </Text>

                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 16, backgroundColor: "#fdf4f9" },

  carouselContainer: { height: 250, marginBottom: 24 },
  carouselCard: { width, alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  carouselImage: { width: width, height: 250, borderRadius: 16 },
  carouselOverlay: { position: "absolute", bottom: 16, left: 16, backgroundColor: "rgba(0,0,0,0.4)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  carouselTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },

  header: { marginBottom: 24, alignItems: "center" },
  title: { fontSize: 26, fontWeight: "700", color: "#1a1a1a", marginBottom: 8, textAlign: "center" },
  subtitle: { fontSize: 15, color: "#6b7280", fontWeight: "400", textAlign: "center" },

  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },

  cardWrapper: { width: width / 3 - 24, padding: 8 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#f0e0eb",
    shadowColor: "#ff1ea5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: "relative",
    minHeight: 140,
    justifyContent: "center",
  },
  cardSelected: {
    backgroundColor: "#ff1ea5",
    borderColor: "#e6188f",
    shadowColor: "#ff1ea5",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff0f8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#ffe5f4",
  },
  iconCircleSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  iconText: { fontSize: 26, fontWeight: "700", color: "#ff1ea5" },
  iconTextSelected: { color: "#ffffff" },
  cardText: { fontSize: 14, fontWeight: "600", color: "#1f2937", textAlign: "center" },
  cardTextSelected: { color: "#ffffff", fontWeight: "700" },
  checkmark: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  checkmarkText: { color: "#ffffff", fontSize: 14, fontWeight: "700" },
});
