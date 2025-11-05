import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../styles/colors';

interface RegistrationInputProps {
  value: string;
  onComplete: (val: string) => void;
  onChooseBrand: (brand: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const padding = 20;
const gap = 12;

const popularBrands = [
  { id: "1", name: "Maruti", logo: "https://static.vecteezy.com/system/resources/previews/020/336/024/non_2x/maruti-logo-maruti-icon-free-free-vector.jpg" },
  { id: "2", name: "Hyundai", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRM_Xtp5Yzs_-y7sxk344C59OX5kEaZIb2LA&s" },
  { id: "3", name: "Honda", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR08y9H67CSKglmuSWh8jGdeQt9xmJnogNKTQ&s" },
  { id: "4", name: "Toyota", logo: "https://1000logos.net/wp-content/uploads/2018/02/Toyota-logo.png" },
  { id: "5", name: "Kia", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6LXHdTPrqcQ3cXNbfD9c4gg3J2IHCR54jfg&s" },
];


export default function RegistrationInput({
  value,
  onComplete,
  onChooseBrand,
}: RegistrationInputProps) {
  const [reg, setReg] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(30);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const brandCardWidth = (screenWidth - padding * 2 - gap * 2) / 3;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFetch = () => {
    if (reg.trim()) onComplete(reg.trim());
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Scroll up when input is focused for better UX
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: Platform.OS === 'ios' ? 280 : 200,
        animated: true,
      });
    }, Platform.OS === 'ios' ? 300 : 100);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const renderBrandCard = (
    brand: typeof popularBrands[0],
    isMore = false,
    key: string
  ) => {
    const scale = new Animated.Value(1);
    const cardElevation = new Animated.Value(3);

    const handlePressIn = () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 0.92,
          useNativeDriver: true,
        }),
        Animated.timing(cardElevation, {
          toValue: 8,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    };

    const handlePressOut = () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(cardElevation, {
          toValue: 3,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    };

    return (
      <Animated.View
        key={key}
        style={{
          transform: [{ scale }],
          marginRight: gap,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onChooseBrand(isMore ? "more" : brand.name)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[styles.brandCard, { width: brandCardWidth }]}
        >
          {isMore ? (
            <LinearGradient
              colors={["#fff1f9", "#ffe5f4"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.moreCardGradient}
            >
              <View style={styles.moreIconContainer}>
                <Ionicons name="grid" size={28} color="#ff1ea5" />
              </View>
              <Text style={styles.moreText}>More</Text>
            </LinearGradient>
          ) : (
            <View style={styles.brandCardContent}>
              <View style={styles.brandLogoContainer}>
                <Image source={{ uri: brand.logo }} style={styles.logo} />
              </View>
              <Text style={styles.brandName}>{brand.name}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderContent = () => {
    // For Android, don't use animations that could interfere with keyboard
    const containerStyle = Platform.OS === 'android'
      ? {}
      : {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };

    return (
      <Animated.View style={containerStyle}>
        {/* Hero Section with Image and Title */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          {/* Left Side - Text Content */}
          <View style={styles.heroTextContainer}>
            <View style={styles.promoBadge}>
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.promoBadgeGradient}
              >
                <Ionicons name="trending-up" size={16} color={colors.white} />
                <Text style={styles.promoBadgeText}>BEST DEALS</Text>
              </LinearGradient>
            </View>
            <Text style={styles.mainTitle}>Sell Car Online at the Best Price</Text>
            <Text style={styles.tagline}>Get instant valuation & quick sale</Text>
          </View>

          {/* Right Side - Animated Image */}
          <Animated.View
            style={[
              styles.heroImageContainer,
              {
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 10],
                    })
                  },
                  { scale: 1.05 }
                ],
              }
            ]}
          >
            <Image
              source={require('../../../../assets/sellcar.png')}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Quick Stats Bar */}
        <View style={styles.quickStatsBar}>
          <View style={styles.quickStatItem}>
            <Ionicons name="shield-checkmark" size={18} color="#10B981" />
            <Text style={styles.quickStatText}>Verified</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Ionicons name="pricetag" size={18} color="#F59E0B" />
            <Text style={styles.quickStatText}>Best Price</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Ionicons name="flash" size={18} color="#3B82F6" />
            <Text style={styles.quickStatText}>Quick Sale</Text>
          </View>
        </View>
      </View>

      {/* Registration Input Card */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Enter your car registration number</Text>
        <View style={[styles.inputCard, isFocused && styles.inputCardFocused]}>
          <TextInput
            style={styles.input}
            placeholder="e.g., DL34AC4564"
            placeholderTextColor={colors.gray[400]}
            value={reg}
            onChangeText={setReg}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize="characters"
          />
        </View>

        {/* Fetch Button */}
        <TouchableOpacity
          style={[styles.fetchBtn, !reg.trim() && styles.fetchBtnDisabled]}
          onPress={handleFetch}
          disabled={!reg.trim()}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={reg.trim() ? [colors.primary, colors.primaryDark] : [colors.gray[300], colors.gray[400]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fetchBtnGradient}
          >
            <Text style={styles.fetchBtnText}>Fetch car details</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Brand Selection Header */}
      <Text style={styles.brandSectionTitle}>Select your car brand</Text>

      {/* Brand Cards */}
      <View style={styles.brandsContainer}>
        {/* First Row: 3 cards */}
        <View style={styles.row}>
          {popularBrands.slice(0, 3).map((b) => renderBrandCard(b, false, b.id))}
        </View>

        {/* Second Row: 2 cards + More */}
        <View style={styles.row}>
          {popularBrands.slice(3).map((b) => renderBrandCard(b, false, b.id))}
          {renderBrandCard({ id: "more", name: "More", logo: "" }, true, "more")}
        </View>
      </View>
    </Animated.View>
    );
  };

  // iOS: Use ScrollView with smooth animation
  if (Platform.OS === 'ios') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          {renderContent()}
        </ScrollView>
      </View>
    );
  }

  // Android: Use ScrollView but without automatic keyboard handling
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding,
    paddingTop: 16,
    paddingBottom: 100,
  },
  // Brand Header Section
  brandHeader: {
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  appName: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    letterSpacing: 0.5,
  },
  // Hero Section
  heroSection: {
    marginBottom: 32,
    backgroundColor: colors.pink[50],
    borderRadius: 24,
    overflow: "hidden",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingRight: 20,
    paddingBottom: 16,
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  promoBadge: {
    alignSelf: "flex-start",
    marginBottom: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  promoBadgeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  promoBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
    lineHeight: 32,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 6,
    fontWeight: "600",
    flexShrink: 1,
  },
  heroImageContainer: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    zIndex: 3,
  },
  glowCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    opacity: 0.15,
    zIndex: 1,
  },
  glowCircleOuter: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primary,
    opacity: 0.08,
    zIndex: 0,
  },
  // Quick Stats Bar
  quickStatsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.pink[100],
  },
  quickStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickStatText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  quickStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.gray[200],
  },
  // Input Section
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputCardFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
    fontWeight: "500",
  },
  fetchBtn: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  fetchBtnDisabled: {
    shadowOpacity: 0.05,
  },
  fetchBtnGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fetchBtnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: 16,
    fontWeight: "600",
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Brand Section
  brandSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  brandsContainer: {
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: gap,
  },
  brandCard: {
    height: 120,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  brandCardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    position: "relative",
  },
  brandLogoContainer: {
    width: 70,
    height: 70,
    borderRadius: 14,
    backgroundColor: colors.gray[50],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  logo: {
    width: 58,
    height: 58,
    resizeMode: "contain",
  },
  brandName: {
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
    color: colors.text,
    letterSpacing: 0.3,
  },
  moreCardGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  moreIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  moreText: {
    fontWeight: "700",
    fontSize: 15,
    color: colors.primary,
  },
});
