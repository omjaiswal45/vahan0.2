import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Keyboard,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCarInsurance } from '../hooks/useCarInsurance';
import { colors } from '../../../../../styles';
import VehicleNumberModal from '../../../../../components/VehicleNumberModal';
import { useVehicleNumber } from '../../../../../hooks/useVehicleNumber';

const { width } = Dimensions.get('window');
const HERO_CARD_HEIGHT = width > 400 ? 220 : 240;

interface CarInsuranceHomeScreenProps {
  navigation: any;
}

export const CarInsuranceHomeScreen: React.FC<CarInsuranceHomeScreenProps> = ({ navigation }) => {
  const {
    isLoading,
    recentSearches,
    searchInsurance,
    clearAllSearches,
  } = useCarInsurance();

  const {
    vehicleNumber,
    shouldShowModal,
    saveVehicleNumber,
    skipForNow,
  } = useVehicleNumber();

  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState(vehicleNumber || '');
  const heroScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Car Insurance',
    });
  }, [navigation]);

  useEffect(() => {
    if (shouldShowModal()) {
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    setSearchInput(vehicleNumber || '');
  }, [vehicleNumber]);

  const handleVehicleNumberSubmit = (number: string) => {
    saveVehicleNumber(number);
    setShowModal(false);
    setSearchInput(number);
    handleSearch(number);
  };

  const handleSkip = () => {
    skipForNow();
    setShowModal(false);
  };

  const handleSearch = async (registrationNumber: string) => {
    if (!registrationNumber.trim()) {
      Alert.alert('Invalid Input', 'Please enter a vehicle registration number');
      return;
    }

    if (registrationNumber.trim().length < 6) {
      Alert.alert('Invalid Input', 'Vehicle number must be at least 6 characters');
      return;
    }

    try {
      Keyboard.dismiss();
      const startTime = Date.now();
      const data = await searchInsurance({ registrationNumber: registrationNumber.trim().toUpperCase() });
      const duration = Date.now() - startTime;
      if (duration < 300) await new Promise(res => setTimeout(res, 300 - duration));

      // Navigate to InsuranceReportScreen to display the insurance details
      navigation.navigate('InsuranceReport', { registrationNumber: data.registrationNumber });
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch insurance data. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleRecentSearchSelect = (registrationNumber: string) => {
    setSearchInput(registrationNumber);
    handleSearch(registrationNumber);
  };

  const formatRegistrationNumber = (text: string) => {
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setSearchInput(cleaned);
  };

  const handleClearInput = () => {
    setSearchInput('');
  };

  const handleSearchPress = () => {
    if (searchInput.trim()) {
      handleSearch(searchInput);
    } else {
      Alert.alert('Invalid Input', 'Please enter a vehicle registration number');
    }
  };

  const handleHeroPressIn = () => {
    Animated.spring(heroScaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handleHeroPressOut = () => {
    Animated.spring(heroScaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Eye-Catching Hero Card with Animation */}
          <Animated.View style={[styles.heroCard, { transform: [{ scale: heroScaleAnim }] }]}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={handleHeroPressIn}
              onPressOut={handleHeroPressOut}
              style={styles.heroTouchable}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                {/* Background Pattern Circles */}
                <View style={styles.backgroundPattern}>
                  <View style={[styles.patternCircle, styles.pattern1]} />
                  <View style={[styles.patternCircle, styles.pattern2]} />
                  <View style={[styles.patternCircle, styles.pattern3]} />
                </View>

                {/* Content Container */}
                <View style={styles.heroContent}>
                  {/* Left Text Section */}
                  <View style={styles.heroTextSection}>
                    <View style={styles.heroBadge}>
                      <View style={styles.liveDot} />
                      <Text style={styles.heroBadgeText}>PROTECT NOW</Text>
                    </View>

                    <Text style={styles.heroTitle}>Car Insurance{'\n'}Made Easy</Text>

                    <Text style={styles.heroSubtitle}>
                      Check policy status, get instant{'\n'}quotes & renew in minutes
                    </Text>

                    <View style={styles.featureRow}>
                      <FeatureChip icon="⚡" text="Instant" />
                      <FeatureChip icon="🛡️" text="Secure" />
                      <FeatureChip icon="💰" text="Best Rates" />
                      <FeatureChip icon="✓" text="Verified" />
                    </View>
                  </View>

                  {/* Right Insurance Image Section */}
                  <View style={styles.heroAnimationSection}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={require('../../../../../../assets/insurance.png')}
                        style={styles.insuranceImage}
                        resizeMode="contain"
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.searchSection}>
            <Text style={styles.sectionTitle}>Enter Vehicle Number</Text>

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="car-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={searchInput}
                  onChangeText={formatRegistrationNumber}
                  placeholder="e.g., DL01AB1234"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={15}
                  editable={!isLoading}
                  onSubmitEditing={handleSearchPress}
                  returnKeyType="search"
                />
                {searchInput.length > 0 && (
                  <TouchableOpacity onPress={handleClearInput} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              {searchInput.length > 0 && (
                <Text style={styles.charCounter}>{searchInput.length}/15</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
              onPress={handleSearchPress}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <Ionicons name="search" size={20} color={colors.white} style={styles.searchIcon} />
                  <Text style={styles.searchButtonText}>Check Insurance Status</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {recentSearches.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearAllSearches}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleRecentSearchSelect(search)}
                >
                  <Text style={styles.recentText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.infoSection}>
            <InfoCard
              icon="=�"
              title="Complete Coverage"
              description="Get details on your insurance policy, coverage, and add-ons."
            />
            <InfoCard
              icon="=�"
              title="Easy Renewal"
              description="Renew your car insurance quickly with best quotes from top insurers."
            />
            <InfoCard
              icon="=�"
              title="Track Policies"
              description="View your complete policy history and NCB status anytime."
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VehicleNumberModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleVehicleNumberSubmit}
        onSkip={handleSkip}
        contextTitle="Check Your Car Insurance"
        contextMessage="Enter your car number to check insurance status, expiry date, and get renewal quotes instantly."
        showDemoOption={false}
      />
    </SafeAreaView>
  );
};

interface FeatureChipProps {
  icon: string;
  text: string;
}

const FeatureChip: React.FC<FeatureChipProps> = ({ icon, text }) => (
  <View style={styles.featureChip}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

interface InfoCardProps {
  icon: string;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoIcon}>{icon}</Text>
    <View style={styles.infoContent}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
  heroCard: {
    marginHorizontal: 0,
    marginVertical: 12,
    borderRadius: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },
  heroTouchable: {
    width: '100%',
    height: HERO_CARD_HEIGHT,
  },
  heroGradient: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  pattern1: {
    width: 150,
    height: 150,
    top: -50,
    right: -30,
  },
  pattern2: {
    width: 120,
    height: 120,
    bottom: -40,
    left: -30,
  },
  pattern3: {
    width: 80,
    height: 80,
    top: '40%',
    right: '30%',
  },
  heroContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  },
  heroTextSection: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: width > 380 ? 26 : 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.5,
    lineHeight: width > 380 ? 32 : 30,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: width > 380 ? 13 : 12,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.95,
    lineHeight: 18,
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  featureIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  ctaButtonHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaTextHero: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  heroAnimationSection: {
    width: width > 380 ? 140 : 120,
    height: width > 380 ? 140 : 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    padding: 8,
  },
  insuranceImage: {
    width: '100%',
    height: '100%',
  },
  searchSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
  charCounter: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
    marginRight: 4,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  recentSection: {
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  recentItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoSection: {
    gap: 12,
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 30,
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  infoDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
