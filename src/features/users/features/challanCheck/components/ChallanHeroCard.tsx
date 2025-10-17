import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { colors } from "../../../../../styles";
import trafficAnimation from "../../../../../assets/trafficConcept.json";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = width > 400 ? 200 : 220;

export const ChallanHeroCard: React.FC = () => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const lottieRef = React.useRef<LottieView>(null);

  React.useEffect(() => {
    lottieRef.current?.play();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      <TouchableOpacity
        activeOpacity={0.95}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Background Pattern */}
          <View style={styles.backgroundPattern}>
            <View style={[styles.patternCircle, styles.pattern1]} />
            <View style={[styles.patternCircle, styles.pattern2]} />
          </View>

          <View style={styles.content}>
            {/* Left Content */}
            <View style={styles.leftContent}>
              <View style={styles.headerRow}>
                <View style={styles.badge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.badgeText}>LIVE</Text>
                </View>
              </View>

              <Text style={styles.title}>Traffic Challan Check</Text>
              <Text style={styles.subtitle}>
                Verify pending challans instantly with verified data
              </Text>

              <View style={styles.features}>
                <FeatureChip icon="⚡" text="Instant" />
                <FeatureChip icon="🛡️" text="Secure" />
                <FeatureChip icon="✓" text="Verified" />
                 <FeatureChip icon="🚗" text="Trusted" />

              </View>
            </View>

            {/* Right Animation */}
            <View style={styles.rightContent}>
              <View style={styles.animationWrapper}>
                <LottieView
                  ref={lottieRef}
                  source={trafficAnimation}
                  autoPlay
                  loop
                  style={styles.lottieAnimation}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

interface FeatureChipProps {
  icon: string;
  text: string;
}

const FeatureChip: React.FC<FeatureChipProps> = ({ icon, text }) => (
  <View style={styles.chip}>
    <Text style={styles.chipIcon}>{icon}</Text>
    <Text style={styles.chipText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    width: width - 32,
    alignSelf: "center",
  },
  gradient: {
    height: CARD_HEIGHT,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 24,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: "absolute",
    borderRadius: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  pattern1: {
    width: 140,
    height: 140,
    top: -40,
    right: -20,
  },
  pattern2: {
    width: 100,
    height: 100,
    bottom: -30,
    left: -20,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 1,
  },
  leftContent: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 16,
    minWidth: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ade80",
    marginRight: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: width > 380 ? 22 : 20,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: -0.3,
    flexWrap: "wrap",
  },
  subtitle: {
    fontSize: width > 380 ? 12 : 11,
    fontWeight: "500",
    color: "#fff",
    opacity: 0.85,
    lineHeight: 17,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  features: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  chipIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  rightContent: {
    width: width > 380 ? 130 : 110,
    height: width > 380 ? 130 : 110,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  animationWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
  },
  lottieAnimation: {
    width: "115%",
    height: "115%",
  },
});