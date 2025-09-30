import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

interface FuelSelectProps {
  value: string;
  onComplete: (val: string) => void;
}

export default function FuelSelect({ value, onComplete }: FuelSelectProps) {
  const [selectedFuel, setSelectedFuel] = useState(value);
  const [scaleAnims] = useState(
    ["Petrol", "Diesel", "CNG", "Hybrid", "Electric"].reduce((acc, fuel) => {
      acc[fuel] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  );

  const fuels = [
    { 
      type: "Petrol", 
      icon: "⛽", 
      color: "#FF6B6B",
      gradient: ["#FF6B6B", "#FF8E8E"]
    },
    { 
      type: "Diesel", 
      icon: "🚛", 
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#6EE7E0"]
    },
    { 
      type: "CNG", 
      icon: "💨", 
      color: "#95E1D3",
      gradient: ["#95E1D3", "#B0EBE0"]
    },
    { 
      type: "Hybrid", 
      icon: "🔋", 
      color: "#FFA07A",
      gradient: ["#FFA07A", "#FFB399"]
    },
    { 
      type: "Electric", 
      icon: "⚡", 
      color: "#A8E6CF",
      gradient: ["#A8E6CF", "#C0EFDC"]
    },
  ];

  const handlePress = (fuel: string) => {
    // Animate the press
    Animated.sequence([
      Animated.timing(scaleAnims[fuel], {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[fuel], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedFuel(fuel);
    setTimeout(() => onComplete(fuel), 200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Fuel Type</Text>
        <Text style={styles.subtitle}>Choose your vehicle's fuel preference</Text>
      </View>

      <View style={styles.grid}>
        {fuels.map((fuel) => {
          const isSelected = selectedFuel === fuel.type;
          return (
            <Animated.View
              key={fuel.type}
              style={[
                styles.cardWrapper,
                { transform: [{ scale: scaleAnims[fuel.type] }] }
              ]}
            >
              <TouchableOpacity
                onPress={() => handlePress(fuel.type)}
                activeOpacity={0.8}
                style={[
                  styles.fuelCard,
                  isSelected && styles.selectedCard,
                  { borderColor: fuel.color }
                ]}
              >
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: fuel.color }]}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                )}
                
                <View style={[styles.iconContainer, { backgroundColor: fuel.color + "20" }]}>
                  <Text style={styles.icon}>{fuel.icon}</Text>
                </View>
                
                <Text style={[styles.fuelText, isSelected && styles.selectedText]}>
                  {fuel.type}
                </Text>
                
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <View style={[styles.selectedDot, { backgroundColor: fuel.color }]} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {selectedFuel ? `${selectedFuel} selected` : "Tap to select"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    fontWeight: "400",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 16,
  },
  fuelCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  selectedCard: {
    borderWidth: 2.5,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    fontSize: 32,
  },
  fuelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    letterSpacing: 0.2,
  },
  selectedText: {
    fontWeight: "700",
  },
  selectedIndicator: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
  },
  selectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
});