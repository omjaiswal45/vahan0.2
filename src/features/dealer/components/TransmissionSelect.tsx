import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface TransmissionSelectProps {
  value: string;
  onComplete: (val: string) => void;
}

export default function TransmissionSelect({ value, onComplete }: TransmissionSelectProps) {
  const transmissions = [
    { label: "Manual", icon: "⚙️", desc: "Classic Control", popular: true, gradient: ["#FF6B6B", "#FFD93D"] },
    { label: "Automatic", icon: "🔄", desc: "Effortless Drive", popular: true, gradient: ["#4E54C8", "#8F94FB"] },
    { label: "AMT", icon: "⚡", desc: "Smart Manual", popular: true, gradient: ["#11998E", "#38EF7D"] },
    { label: "CVT", icon: "♾️", desc: "Smooth & Efficient", popular: false, gradient: ["#F2994A", "#F2C94C"] },
    { label: "DCT", icon: "⚙️⚙️", desc: "Performance", popular: false, gradient: ["#A445B2", "#D41872"] },
    { label: "iMT", icon: "🎯", desc: "Smart Choice", popular: false, gradient: ["#667EEA", "#764BA2"] },
  ];

  const tips = [
    { title: "City Driving", desc: "Automatic is best for traffic", icon: "🚦", gradient: ["#4E54C8", "#8F94FB"] },
    { title: "Fuel Saver", desc: "Manual offers better mileage", icon: "⛽", gradient: ["#FF6B6B", "#FFD93D"] },
    { title: "Trending Now", desc: "AMT is gaining popularity", icon: "🏆", gradient: ["#11998E", "#38EF7D"] },
    { title: "Smooth Ride", desc: "CVT delivers seamless shifts", icon: "⚡", gradient: ["#F2994A", "#F2C94C"] },
  ];

  const [scaleAnims] = useState(transmissions.map(() => new Animated.Value(1)));
  const [tipOpacity] = useState(new Animated.Value(1));
  const [currentTip, setCurrentTip] = useState(0);

  // Auto-cycle tips with fade
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(tipOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
        Animated.timing(tipOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = (transmission: string, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[index], { toValue: 1.02, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnims[index], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onComplete(transmission);
  };

  const selectedTransmission = transmissions.find(t => t.label === value);
  const activeTip = tips[currentTip];

  return (
    <View style={styles.container}>
      {/* Scrollable Top Section */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🚗</Text>
          <Text style={styles.title}>Choose Transmission</Text>
          <Text style={styles.subtitle}>Select your preferred driving style</Text>
        </View>

        {/* Selected Banner */}
        {value && selectedTransmission && (
          <View style={styles.selectedBanner}>
            <LinearGradient
              colors={selectedTransmission.gradient}
              style={styles.selectedGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.selectedIcon}>{selectedTransmission.icon}</Text>
              <View style={styles.selectedText}>
                <Text style={styles.selectedTitle}>Selected: {selectedTransmission.label}</Text>
                <Text style={styles.selectedDesc}>{selectedTransmission.desc}</Text>
              </View>
              <Text style={styles.selectedCheck}>✓</Text>
            </LinearGradient>
          </View>
        )}

        {/* Transmission Grid */}
        <View style={styles.grid}>
          {transmissions.map((item, index) => {
            const isSelected = value === item.label;
            return (
              <Animated.View 
                key={item.label} 
                style={[styles.cardWrapper, { transform: [{ scale: scaleAnims[index] }] }]}
              >
                <TouchableOpacity 
                  activeOpacity={0.7} 
                  onPress={() => handlePress(item.label, index)}
                >
                  <LinearGradient
                    colors={isSelected ? item.gradient : ["#ffffff", "#f9fafb"]}
                    style={[styles.card, isSelected && styles.cardSelected, !isSelected && styles.cardUnselected]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {item.popular && !isSelected && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>⭐</Text>
                      </View>
                    )}

                    <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                      <Text style={styles.iconEmoji}>{item.icon}</Text>
                    </View>

                    <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.cardDesc, isSelected && styles.cardDescSelected]}>
                      {item.desc}
                    </Text>

                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Tips Section at Bottom */}
      <View style={styles.tipsSection}>
        <View style={styles.tipsHeader}>
          <Text style={styles.tipsTitle}>💡 Quick Tip</Text>
          <View style={styles.dots}>
            {tips.map((_, idx) => (
              <View key={idx} style={[styles.dot, currentTip === idx && styles.dotActive]} />
            ))}
          </View>
        </View>

        <Animated.View style={{ opacity: tipOpacity }}>
          <LinearGradient
            colors={activeTip.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.tipCard}
          >
            <Text style={styles.tipIcon}>{activeTip.icon}</Text>
            <View style={styles.tipText}>
              <Text style={styles.tipTitle}>{activeTip.title}</Text>
              <Text style={styles.tipDesc}>{activeTip.desc}</Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fdf4f9"
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 16
  },
  
  // Header
  header: { 
    alignItems: "center", 
    marginBottom: 12
  },
  emoji: { 
    fontSize: 40, 
    marginBottom: 8 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#1a1a2e", 
    marginBottom: 4,
    textAlign: "center" 
  },
  subtitle: { 
    fontSize: 13, 
    color: "#64748b", 
    textAlign: "center"
  },

  // Selected Banner
  selectedBanner: { 
    marginBottom: 12
  },
  selectedGradient: { 
    borderRadius: 14, 
    padding: 12, 
    flexDirection: "row", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  selectedIcon: { 
    fontSize: 28, 
    marginRight: 10 
  },
  selectedText: { 
    flex: 1 
  },
  selectedTitle: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#fff", 
    marginBottom: 2 
  },
  selectedDesc: { 
    fontSize: 11, 
    color: "rgba(255,255,255,0.9)" 
  },
  selectedCheck: { 
    fontSize: 24, 
    color: "#fff" 
  },

  // Grid
  grid: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center"
  },
  cardWrapper: { 
    width: "31%", 
    padding: 3, 
    marginBottom: 8
  },
  card: { 
    borderRadius: 16, 
    overflow: "hidden", 
    minHeight: 120, 
    justifyContent: "center", 
    alignItems: "center",
    padding: 10,
    position: "relative"
  },
  cardUnselected: {
    borderWidth: 2,
    borderColor: "#e5e7eb"
  },
  cardSelected: { 
    shadowColor: "#ff1ea5", 
    shadowOpacity: 0.4, 
    shadowRadius: 12, 
    elevation: 6
  },
  badge: { 
    position: "absolute", 
    top: 6, 
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(251, 191, 36, 0.9)",
    alignItems: "center",
    justifyContent: "center"
  },
  badgeText: { 
    fontSize: 12
  },
  iconCircle: { 
    width: 46, 
    height: 46, 
    borderRadius: 23, 
    backgroundColor: "#fff0f8", 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 8, 
    borderWidth: 2, 
    borderColor: "#ffe5f4" 
  },
  iconCircleSelected: { 
    backgroundColor: "rgba(255,255,255,0.25)", 
    borderColor: "rgba(255,255,255,0.4)" 
  },
  iconEmoji: { 
    fontSize: 22 
  },
  cardTitle: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#1f2937", 
    textAlign: "center", 
    marginBottom: 3 
  },
  cardTitleSelected: { 
    color: "#fff", 
    fontWeight: "800" 
  },
  cardDesc: { 
    fontSize: 9, 
    fontWeight: "500", 
    color: "#9ca3af", 
    textAlign: "center"
  },
  cardDescSelected: { 
    color: "rgba(255,255,255,0.95)", 
    fontWeight: "600" 
  },
  checkmark: { 
    position: "absolute", 
    top: 6, 
    left: 6, 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    backgroundColor: "#10b981", 
    alignItems: "center", 
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3
  },
  checkmarkText: { 
    color: "#fff", 
    fontSize: 14, 
    fontWeight: "700" 
  },

  // Tips Section
  tipsSection: { 
    backgroundColor: "#fdf4f9",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
    borderTopWidth: 1,
    borderTopColor: "#f3e8f0"
  },
  tipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },
  tipsTitle: { 
    fontSize: 16, 
    fontWeight: "700", 
    color: "#1a1a2e" 
  },
  dots: {
    flexDirection: "row",
    gap: 5
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#d1d5db"
  },
  dotActive: {
    backgroundColor: "#6366f1",
    width: 20
  },
  tipCard: { 
    padding: 14, 
    borderRadius: 14, 
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000", 
    shadowOpacity: 0.2, 
    shadowRadius: 10, 
    elevation: 5
  },
  tipIcon: { 
    fontSize: 32, 
    marginRight: 12 
  },
  tipText: {
    flex: 1
  },
  tipTitle: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#fff", 
    marginBottom: 4 
  },
  tipDesc: { 
    fontSize: 12, 
    color: "#fff", 
    lineHeight: 16,
    opacity: 0.95
  }
});