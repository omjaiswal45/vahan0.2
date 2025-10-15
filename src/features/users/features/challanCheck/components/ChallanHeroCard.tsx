// src/features/users/features/challanCheck/components/ChallanHeroCard.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../../styles";

export const ChallanHeroCard: React.FC = () => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={[colors.primary, "#3AB0FF", "#007AFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Text Section */}
            <View style={styles.textSection}>
              <Text style={styles.title}>Check Traffic Challans</Text>
              <Text style={styles.subtitle}>
                Instant verification of pending & paid challans. Stay informed,
                drive smart.
              </Text>

              <View style={styles.features}>
                <FeatureItem icon="⚡" text="Instant Check" />
                <FeatureItem icon="🧾" text="Full Challan Report" />
                <FeatureItem icon="✅" text="Verified Data" />
              </View>
            </View>

            {/* Illustration Section */}
            <View style={styles.illustrationSection}>
              <View style={styles.illustration}>
                <Text style={styles.illustrationEmoji}>🚦</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface FeatureItemProps {
  icon: string;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 28,
  },
  gradient: {
    borderRadius: 24,
    padding: 24,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textSection: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#f2f2f2",
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 14,
  },
  features: {
    gap: 6,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  featureText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
    opacity: 0.95,
  },
  illustrationSection: {
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  illustration: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  illustrationEmoji: {
    fontSize: 42,
  },
});
