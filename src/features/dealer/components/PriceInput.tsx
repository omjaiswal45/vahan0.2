import React, { useState, useEffect } from "react";
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Vibration
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

interface PriceInputProps {
  value: string;
  onComplete: (val: string) => void;
  tabBarHeight?: number; // Optional tab bar height offset
}

export default function PriceInput({ value, onComplete, tabBarHeight = 60 }: PriceInputProps) {
  const insets = useSafeAreaInsets();
  const [price, setPrice] = useState(value || "500000");
  const [sliderValue, setSliderValue] = useState(parseFloat(value) || 500000);
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const shakeAnim = useState(new Animated.Value(0))[0];
  const cardAnim = useState(new Animated.Value(0))[0];

  const MIN_PRICE = 50000;
  const MAX_PRICE = 10000000;

  useEffect(() => {
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
  }, []);

  const formatIndianPrice = (num: number) => {
    const numStr = Math.round(num).toString();
    let lastThree = numStr.substring(numStr.length - 3);
    const otherNumbers = numStr.substring(0, numStr.length - 3);
    if (otherNumbers !== '') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  };

  const formatLakhs = (num: number) => {
    const lakhs = num / 100000;
    if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`;
    return `₹${lakhs.toFixed(2)} L`;
  };

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPrice(numericValue);
    const parsedValue = parseFloat(numericValue) || MIN_PRICE;
    
    if (parsedValue >= MIN_PRICE && parsedValue <= MAX_PRICE) {
      setSliderValue(parsedValue);
    } else if (parsedValue > MAX_PRICE) {
      // Shake animation for out of range
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      // Light vibration feedback
      Vibration.vibrate(50);
    }
  };

  const handleSliderChange = (val: number) => {
    setSliderValue(val);
    setPrice(Math.round(val).toString());
  };

  const handleSubmit = () => {
    const parsedPrice = parseFloat(price);
    
    if (!parsedPrice || parsedPrice < MIN_PRICE || parsedPrice > MAX_PRICE) {
      // Shake animation for invalid input
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      // Error vibration pattern
      Vibration.vibrate([0, 50, 50, 50]);
      return;
    }

    // Success animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // Success vibration
    Vibration.vibrate(100);

    onComplete(price);
  };

  const handlePresetSelect = (presetValue: number) => {
    setSliderValue(presetValue);
    setPrice(presetValue.toString());
    
    // Medium vibration feedback for preset selection
    Vibration.vibrate(30);
  };

  const pricePresets = [
    { label: "₹2L", value: 200000 },
    { label: "₹5L", value: 500000 },
    { label: "₹10L", value: 1000000 },
    { label: "₹20L", value: 2000000 },
    { label: "₹50L", value: 5000000 },
    { label: "₹1Cr", value: 10000000 },
  ];

  const cardAnimStyle = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })
      }
    ]
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardView}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.container,
          { paddingBottom: tabBarHeight + 90 } // Tab bar + button container height
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Budget</Text>
          <Text style={styles.subtitle}>Enter or slide to set the price</Text>
        </View>

        {/* Price Display Card */}
        <Animated.View style={[styles.priceCard, cardAnimStyle, { transform: [{ translateX: shakeAnim }] }]}>
          <Text style={styles.currencyLabel}>Price</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              style={[styles.priceInput, isFocused && styles.priceInputFocused]}
              value={formatIndianPrice(parseFloat(price) || 0)}
              onChangeText={handleTextChange}
              keyboardType="numeric"
              placeholder="5,00,000"
              placeholderTextColor="#999"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          <Text style={styles.priceInWords}>{formatLakhs(sliderValue)}</Text>
          
          {/* Range indicator */}
          <View style={styles.rangeIndicator}>
            <Text style={styles.rangeText}>
              Range: {formatLakhs(MIN_PRICE)} - {formatLakhs(MAX_PRICE)}
            </Text>
          </View>
        </Animated.View>

        {/* Quick Presets */}
        <View style={styles.presetsContainer}>
          <Text style={styles.presetsTitle}>Quick Select</Text>
          <View style={styles.presetsRow}>
            {pricePresets.map((preset) => (
              <TouchableOpacity
                key={preset.label}
                style={[
                  styles.presetButton,
                  sliderValue === preset.value && styles.presetButtonActive
                ]}
                onPress={() => handlePresetSelect(preset.value)}
                activeOpacity={0.7}
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
            <Text style={styles.sliderLabel}>{formatLakhs(MIN_PRICE)}</Text>
            <Text style={styles.sliderLabel}>{formatLakhs(MAX_PRICE)}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={MIN_PRICE}
            maximumValue={MAX_PRICE}
            value={sliderValue}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#ff1ea5"
            maximumTrackTintColor="#E5E5EA"
            thumbTintColor="#ff1ea5"
            step={10000}
          />
          <View style={styles.sliderTicks}>
            <View style={styles.tick} />
            <View style={styles.tick} />
            <View style={styles.tick} />
            <View style={styles.tick} />
            <View style={styles.tick} />
          </View>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          💡 Average car price in India: ₹8-12 lakhs
        </Text>
      </ScrollView>

      {/* Fixed Submit Button */}
      <View style={[
        styles.submitContainer, 
        { 
          bottom: tabBarHeight, // Position directly above tab bar
        }
      ]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollView: { flex: 1 },
  container: { 
    paddingHorizontal: 20, 
    paddingTop: 24,
  },
  header: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: "700", color: "#1a1a1a", marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: "#666", fontWeight: "400" },
  priceCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#ff1ea5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ffe5f4",
  },
  currencyLabel: { fontSize: 14, color: "#666", fontWeight: "500", marginBottom: 8 },
  priceInputContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  rupeeSymbol: { fontSize: 36, fontWeight: "700", color: "#1a1a1a", marginRight: 8 },
  priceInput: { fontSize: 40, fontWeight: "700", color: "#1a1a1a", minWidth: 200, textAlign: "left", padding: 0 },
  priceInputFocused: { color: "#ff1ea5" },
  priceInWords: { fontSize: 16, color: "#ff1ea5", fontWeight: "600" },
  rangeIndicator: { 
    marginTop: 12, 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    backgroundColor: "#f8f8f8", 
    borderRadius: 8 
  },
  rangeText: { fontSize: 12, color: "#666", fontWeight: "500" },
  presetsContainer: { marginBottom: 32 },
  presetsTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a", marginBottom: 12 },
  presetsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  presetButton: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 10, 
    backgroundColor: "#F5F5F7", 
    borderWidth: 1.5, 
    borderColor: "#E5E5EA" 
  },
  presetButtonActive: { 
    backgroundColor: "#ff1ea5", 
    borderColor: "#ff1ea5",
    shadowColor: "#ff1ea5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  presetText: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  presetTextActive: { color: "#fff" },
  sliderContainer: { marginBottom: 32 },
  sliderLabels: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  sliderLabel: { fontSize: 13, color: "#666", fontWeight: "500" },
  slider: { width: "100%", height: 40 },
  sliderTicks: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8, marginTop: -12 },
  tick: { width: 2, height: 8, backgroundColor: "#E5E5EA", borderRadius: 1 },
  infoText: { 
    textAlign: "center", 
    fontSize: 13, 
    color: "#999", 
    marginBottom: 24,
    fontWeight: "500"
  },
  submitContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButton: {
    backgroundColor: "#ff1ea5",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff1ea5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "700", marginRight: 8 },
  arrow: { color: "#fff", fontSize: 20, fontWeight: "700" },
});