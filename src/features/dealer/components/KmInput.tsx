import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Animated
} from "react-native";
import Slider from "@react-native-community/slider";

interface KmInputProps {
  value: string;
  onComplete: (val: string) => void;
}

export default function KmInput({ value, onComplete }: KmInputProps) {
  const [km, setKm] = useState(value || "50000");
  const [sliderValue, setSliderValue] = useState(parseFloat(value) || 50000);
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const MIN_KM = 0;
  const MAX_KM = 300000;

  // Format number with commas
  const formatKm = (num: number) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get condition based on KM
  const getCondition = (kmValue: number) => {
    if (kmValue < 20000) return { text: "Almost New", color: "#10B981" };
    if (kmValue < 50000) return { text: "Excellent", color: "#3B82F6" };
    if (kmValue < 100000) return { text: "Good", color: "#F59E0B" };
    if (kmValue < 150000) return { text: "Fair", color: "#F97316" };
    return { text: "High Mileage", color: "#EF4444" };
  };

  const condition = getCondition(sliderValue);

  // Update slider when text input changes
  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setKm(numericValue);
    const parsedValue = parseFloat(numericValue) || MIN_KM;
    if (parsedValue >= MIN_KM && parsedValue <= MAX_KM) {
      setSliderValue(parsedValue);
    }
  };

  // Update text input when slider changes
  const handleSliderChange = (val: number) => {
    setSliderValue(val);
    setKm(Math.round(val).toString());
  };

  const handleSubmit = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onComplete(km);
  };

  // Quick KM presets
  const kmPresets = [
    { label: "10K", value: 10000 },
    { label: "25K", value: 25000 },
    { label: "50K", value: 50000 },
    { label: "100K", value: 100000 },
    { label: "150K", value: 150000 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Odometer Reading</Text>
          <Text style={styles.subtitle}>Enter kilometers driven</Text>
        </View>

        {/* KM Display Card */}
        <View style={styles.kmCard}>
          <View style={styles.kmInputContainer}>
            <TextInput
              style={[styles.kmInput, isFocused && styles.kmInputFocused]}
              value={formatKm(parseFloat(km) || 0)}
              onChangeText={handleTextChange}
              keyboardType="numeric"
              placeholder="50,000"
              placeholderTextColor="#999"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <Text style={styles.kmUnit}>KM</Text>
          </View>

          {/* Condition Badge */}
          <View style={[styles.conditionBadge, { backgroundColor: condition.color + "20" }]}>
            <Text style={[styles.conditionText, { color: condition.color }]}>
              {condition.text}
            </Text>
          </View>
        </View>

        {/* Quick Presets */}
        <View style={styles.presetsContainer}>
          <Text style={styles.presetsTitle}>Quick Select</Text>
          <View style={styles.presetsRow}>
            {kmPresets.map((preset) => (
              <TouchableOpacity
                key={preset.label}
                style={[
                  styles.presetButton,
                  sliderValue === preset.value && styles.presetButtonActive
                ]}
                onPress={() => {
                  setSliderValue(preset.value);
                  setKm(preset.value.toString());
                }}
              >
                <Text style={[
                  styles.presetText,
                  sliderValue === preset.value && styles.presetTextActive
                ]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Slider Section */}
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>0</Text>
            <Text style={styles.sliderLabel}>3L</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={MIN_KM}
            maximumValue={MAX_KM}
            value={sliderValue}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#FF1EA5"
            maximumTrackTintColor="#FFE5F4"
            thumbTintColor="#FF1EA5"
            step={1000}
          />
        </View>
      </View>

      {/* Fixed Bottom Button */}
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Continue</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5FC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 160, // Space for bottom button + tab bar
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  kmCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#FF1EA5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: "#FFE5F4",
  },
  kmInputContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  kmInput: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1a1a1a",
    minWidth: 140,
    textAlign: "center",
    padding: 0,
  },
  kmInputFocused: {
    color: "#FF1EA5",
  },
  kmUnit: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
    marginLeft: 6,
  },
  conditionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: "700",
  },
  presetsContainer: {
    marginBottom: 18,
  },
  presetsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  presetsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#FFE5F4",
  },
  presetButtonActive: {
    backgroundColor: "#FF1EA5",
    borderColor: "#FF1EA5",
  },
  presetText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  presetTextActive: {
    color: "#fff",
  },
  sliderContainer: {
    marginBottom: 10,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  slider: {
    width: "100%",
    height: 36,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 80, // Moved up to sit above tab bar
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#FFE5F4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: "#FF1EA5",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF1EA5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 6,
  },
  arrow: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});