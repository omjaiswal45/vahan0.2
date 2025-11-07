// src/features/users/features/home/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store/store';
import { toggleSaveCar as toggleSaveCarAction } from '../../../../../store/slices/buyUsedCarSlice';
import { useLocation } from '../../../../location/hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../../../../navigation/types';
import { CarCard } from '../../buyUsedCar/components/CarCard';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { MOCK_CARS } from '../../buyUsedCar/services/mockCarData';
import { buyUsedCarAPI } from '../../buyUsedCar/services/buyUsedCarAPI';
import LottieView from 'lottie-react-native';
import VehicleNumberModal from '../../../../../components/VehicleNumberModal';
import { useVehicleNumber } from '../../../../../hooks/useVehicleNumber';

const { width, height } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 64) / 3;
const BANNER_HEIGHT = 200;
const HEADER_MAX_HEIGHT = 140;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useSelector((state: RootState) => state.location);
  const auth = useSelector((state: RootState) => state.auth);
  const reduxSavedCarIds = useSelector((state: RootState) => state.buyUsedCar.savedCarIds);
  const currentInsuranceData = useSelector((state: RootState) => state.carInsurance.currentInsuranceData);
  const pendingChallanCount = useSelector((state: RootState) => state.challanCheck.pendingChallanCount);
  const { getLocation } = useLocation();
  const navigation = useNavigation<NavigationProp>();
  const bannerAnimation = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

  // Track saved car IDs for instant UI updates
  const [savedCarIds, setSavedCarIds] = useState<Set<string>>(new Set(reduxSavedCarIds));

  // Vehicle Number Modal State
  const {
    vehicleNumber,
    shouldShowModal,
    saveVehicleNumber,
    skipForNow,
  } = useVehicleNumber();
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  useEffect(() => {
    getLocation();

    // Subtle pulse animation for banner
    Animated.loop(
      Animated.sequence([
        Animated.timing(bannerAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bannerAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Show vehicle number modal after a short delay when home screen loads
    const timer = setTimeout(() => {
      if (shouldShowModal()) {
        setShowVehicleModal(true);
      }
    }, 1500); // 1.5 second delay to let the screen render first

    return () => clearTimeout(timer);
  }, [vehicleNumber]);

  // Handle vehicle number submission from modal
  const handleVehicleNumberSubmit = (number: string) => {
    saveVehicleNumber(number);
    setShowVehicleModal(false);
  };

  // Handle skip button in modal
  const handleVehicleModalSkip = () => {
    skipForNow();
    setShowVehicleModal(false);
  };

  // Scroll-based animations
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const floatingHeaderTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [-HEADER_MIN_HEIGHT, 0],
    extrapolate: 'clamp',
  });

  const floatingHeaderOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const bannerScale = bannerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  /** ---------------- GRID ITEMS ---------------- */
  const gridItems = [
    {
      id: 1,
      title: 'Sell Your Car',
      stack: 'NewCarsScreen',
      image: 'https://acko-cms.ackoassets.com/tips_to_sell_car_6ad4e5b64f.png',
    },
    {
      id: 2,
      title: 'Buy Used Car',
      stack: 'BuyUsedCar',
      target: 'CarFeed',
      image: 'https://image.shutterstock.com/image-illustration/happy-man-dressed-suit-next-600nw-515454121.jpg',
    },
    {
      id: 3,
      title: 'Car Loan',
      stack: 'DealsScreen',
      image: 'https://elements-resized.envatousercontent.com/elements-cover-images/81388270-0885-46c7-8ea2-73754fa5b15c?w=433&cf_fit=scale-down&q=85&format=auto&s=6cefb53587fc0aac2a156ecb8fd9350f06de785ee0d3ed3e69103b3de5f82006',
    },
    {
      id: 4,
      title: 'Challan Check',
      stack: 'ChallanCheckStack',
      target: 'ChallanCheckHome',
      image: 'https://cdn.shriramgi.com/webassets/blogs/1f496a36-1409-4ea5-b969-3d534d72f108_chennai-traffic-challan-status-guide.webp',
    },
    {
      id: 5,
      title: 'RC Check',
      stack: 'RCCheckStack',
      target: 'RCCheckHome',
      image: 'https://vehicleinfo.app/rtoinfo/vehicle-registration.png',
    },
    {
      id: 6,
      title: 'Car Insurance',
      stack: 'CarInsuranceStack',
      target: 'CarInsuranceHome',
      image: 'https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-car-insurance_516790-109.jpg',
    },
  ];

/** ------------------ GENERIC NAVIGATION -------------------- */
const handleNavigate = (item: typeof gridItems[0]) => {
  // Special case for "Sell Your Car"
  if (item.title === 'Sell Your Car') {
    // Navigate to dealer AddListing flow
    navigation.navigate('SellCarStack' as any, { screen: 'AddListing' } as any);
    return;
  }

  // If screen is nested (has target)
  if (item.target) {
    navigation.navigate(item.stack as any, { screen: item.target } as any);
  } 
  // If it's a standalone screen (no target)
  else {
    navigation.navigate(item.stack as any);
  }
};


  /** ---------------- MOCK / Recommended Cars ---------------- */
  const recommendedCars = useMemo(() => {
    return MOCK_CARS.slice(0, 6).map(car => ({
      id: car.id,
      thumbnail: car.thumbnail,
      isSaved: savedCarIds.has(car.id) || car.isSaved, // Merge saved state
      isVerified: car.isVerified,
      brand: car.brand,
      model: car.model,
      year: car.year,
      variant: car.variant,
      km: car.km,
      fuelType: car.fuelType,
      transmission: car.transmission,
      ownerNumber: car.ownerNumber,
      location: car.location,
      price: car.price,
    }));
  }, [savedCarIds]);

  const handleBuyCarsPress = () => {
    navigation.navigate('BuyUsedCar' as any, { screen: 'CarFeed' } as any);
  };

  const handleCarPress = (car: any) => {
    console.log('HomeScreen -> navigating to car id:', car.id);

    // First navigate to BuyUsedCar tab to ensure CarFeed is in the stack
    navigation.navigate('BuyUsedCar' as any);

    // Then navigate to CarDetail with car ID
    // Small delay ensures CarFeed is mounted before navigating to detail
    setTimeout(() => {
      navigation.navigate('BuyUsedCar' as any, {
        screen: 'CarDetail',
        params: { carId: car.id },
      } as any);
    }, 50);
  };

  const handleSavePress = useCallback(async (car: any) => {
    const userId = auth.phone || 'guest-user'; // Use phone as userId, fallback to guest

    try {
      // Optimistically update local UI
      setSavedCarIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(car.id)) {
          newSet.delete(car.id);
        } else {
          newSet.add(car.id);
        }
        return newSet;
      });

      // Dispatch Redux action for global state + persistence
      const result = await dispatch(toggleSaveCarAction({ carId: car.id, userId })).unwrap();

      // Sync local state with Redux result
      setSavedCarIds(prev => {
        const newSet = new Set(prev);
        if (result.isSaved) {
          newSet.add(car.id);
        } else {
          newSet.delete(car.id);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to save car:', error);
      // Revert optimistic update on error
      setSavedCarIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(car.id)) {
          newSet.delete(car.id);
        } else {
          newSet.add(car.id);
        }
        return newSet;
      });
    }
  }, [auth.phone, dispatch]);

  const handleBannerPress = () => {
    navigation.navigate('BuyUsedCar' as any, { screen: 'CarFeed' } as any);
  };

  /** ---------------- RENDER ---------------- */
  const renderGridItem = ({ item }: any) => {
    // Determine insurance badge state
    let insuranceBadgeStatus: 'active' | 'expired' | null = null;
    if (item.title === 'Car Insurance' && currentInsuranceData) {
      const hasActivePolicy = currentInsuranceData.currentPolicy?.status === 'active';
      insuranceBadgeStatus = hasActivePolicy ? 'active' : 'expired';
    }

    // Show count badge for Challan Check if there are pending challans
    const showChallanBadge = item.title === 'Challan Check' && pendingChallanCount > 0;

    // Debug logs
    if (item.title === 'Car Insurance') {
      console.log('Car Insurance Grid - insuranceBadgeStatus:', insuranceBadgeStatus);
    }
    if (item.title === 'Challan Check') {
      console.log('Challan Check Grid - pendingChallanCount:', pendingChallanCount);
    }

    return (
      <TouchableOpacity
        style={styles.gridItemContainer}
        onPress={() => handleNavigate(item)}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.gridItemBackground}
          imageStyle={styles.gridItemImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.gridItemGradient}
          />
          <View style={styles.gridItemTextContainer}>
            <Text style={styles.gridItemText}>
              {item.title}
            </Text>
          </View>

        </ImageBackground>

        {/* Insurance Status Badge - Outside ImageBackground to avoid clipping */}
        {insuranceBadgeStatus && (
          <View style={[
            styles.insuranceStatusBadge,
            insuranceBadgeStatus === 'active'
              ? styles.insuranceActiveBadge
              : styles.insuranceExpiredBadge
          ]}>
            <View style={styles.insuranceBadgeDot} />
            <Text style={styles.insuranceStatusText}>
              {insuranceBadgeStatus === 'active' ? 'Active' : 'Expired'}
            </Text>
          </View>
        )}

        {/* Challan Count Badge - Outside ImageBackground to avoid clipping */}
        {showChallanBadge && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{pendingChallanCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <>
      {/* Animated Location + Search Container */}
      <Animated.View 
        style={[
          styles.animatedHeaderContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          }
        ]}
      >
        {/* Location Bar */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color="#eb259cff" />
          <Text style={styles.locationText}>{location.city || 'Fetching location...'}</Text>
          <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput 
            placeholder="Search cars, brands..." 
            style={styles.searchInput}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </Animated.View>

      {/* Interactive Banner with Lottie Animation */}
      <Animated.View style={[styles.bannerContainer, { transform: [{ scale: bannerScale }] }]}>
        <TouchableOpacity 
          activeOpacity={0.9} 
          onPress={handleBannerPress}
          style={styles.bannerTouchable}
        >
          <LinearGradient
            colors={['#FF1493', '#FF69B4', '#FFB6C1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bannerGradient}
          >
            {/* Left Content Section */}
            <View style={styles.bannerTextSection}>
              <View style={styles.badgeContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.badgeText}>FEATURED</Text>
              </View>
              
              <Text style={styles.bannerTitle}>Find Your{'\n'}Dream Car</Text>
              
              <Text style={styles.bannerSubtitle}>
                1000+ verified used cars{'\n'}at best prices
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1000+</Text>
                  <Text style={styles.statLabel}>Cars</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50+</Text>
                  <Text style={styles.statLabel}>Cities</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>100%</Text>
                  <Text style={styles.statLabel}>Verified</Text>
                </View>
              </View>

              <View style={styles.ctaButton}>
                <Text style={styles.ctaText}>Browse Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#FF1493" />
              </View>
            </View>

            {/* Right Animation Section */}
            <View style={styles.bannerAnimationSection}>
              <LottieView
                ref={lottieRef}
                source={require('../../../../../assets/animations/carsearchLottie.json')}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Stats Bar */}
      <View style={styles.quickStatsBar}>
        <View style={styles.quickStatItem}>
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          <Text style={styles.quickStatText}>Verified Cars</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Ionicons name="pricetag" size={20} color="#F59E0B" />
          <Text style={styles.quickStatText}>Best Prices</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Ionicons name="trending-up" size={20} color="#3B82F6" />
          <Text style={styles.quickStatText}>Easy Loans</Text>
        </View>
      </View>
    </>
  );

  const ListFooter = () => (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended cars</Text>
        <TouchableOpacity onPress={handleBuyCarsPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.sectionAction}>Buy Cars</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recommendedCars}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View style={{ marginRight: 12 }}>
            <CarCard
              car={item as any}
              onPress={() => handleCarPress(item)}
              onSavePress={() => handleSavePress(item)}
              compact
            />
          </View>
        )}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Floating Pink Header */}
      <Animated.View
        style={[
          styles.floatingHeader,
          {
            transform: [{ translateY: floatingHeaderTranslateY }],
            opacity: floatingHeaderOpacity,
          }
        ]}
      >
        <LinearGradient
          colors={['#ff0088f3', '#ff2592ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.floatingHeaderGradient}
        >
          <View style={styles.floatingHeaderContent}>
            <TouchableOpacity onPress={getLocation} style={styles.floatingLocationButton}>
              <Ionicons name="location" size={20} color="#fff" />
              <Text style={styles.floatingLocationText} numberOfLines={1}>
                {location.city || 'Location'}
              </Text>
            </TouchableOpacity>

            <View style={styles.floatingSearchContainer}>
              <Ionicons name="search-outline" size={18} color="#6B7280" />
              <TextInput
                placeholder="Search cars..."
                style={styles.floatingSearchInput}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <Animated.FlatList
          data={gridItems}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={renderGridItem}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      </SafeAreaView>

      {/* Vehicle Number Modal - Shows after login to encourage car number entry */}
      <VehicleNumberModal
        visible={showVehicleModal}
        onClose={() => setShowVehicleModal(false)}
        onSubmit={handleVehicleNumberSubmit}
        onSkip={handleVehicleModalSkip}
        contextTitle="Add Your Car Number"
        contextMessage="Save your car number once and get instant access to challan checks, RC details, and personalized car services across the app."
        showDemoOption={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  safeArea: { 
    flex: 1,
  },
  
  // Animated Header (Location + Search) - FIXED FOR ANDROID
  animatedHeaderContainer: {
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 8,
    backgroundColor: '#F9FAFB',
  },
  locationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2, 
    marginTop: 8,
  },
  locationText: { 
    marginLeft: 8, 
    color: '#111827', 
    flex: 1, 
    fontWeight: '600',
    fontSize: 15,
  },
  refreshButton: { 
    backgroundColor: '#ef2d97ff', 
    padding: 6, 
    borderRadius: 6 
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.white, 
    marginHorizontal: 16, 
    marginBottom: 16, 
    paddingHorizontal: spacing.md, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: colors.primaryLighter, 
    shadowColor: colors.black, 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2 
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    height: 40, 
    fontSize: 15, 
    color: '#111827' 
  },

  // Floating Header
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: '#FF1493',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  floatingHeaderGradient: {
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 8,
    paddingBottom: 12,
  },
  floatingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  floatingLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    maxWidth: 120,
  },
  floatingLocationText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  floatingSearchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 20,
    height: 40,
  },
  floatingSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#111827',
  },
  
  // Banner Styles
  bannerContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FF1493',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  bannerTouchable: {
    width: '100%',
    height: BANNER_HEIGHT,
  },
  bannerGradient: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  bannerTextSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 4,
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 32,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 18,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  ctaText: {
    color: '#FF1493',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6,
  },
  bannerAnimationSection: {
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 160,
    height: 160,
  },

  // Quick Stats Bar
  quickStatsBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStatText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  quickStatDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },

  // Grid Items
  gridItemContainer: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 12,
    overflow: 'visible',
  },
  gridItemBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridItemImage: {
    borderRadius: 12,
  },
  gridItemGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  gridItemTextContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  gridItemText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  insuranceStatusBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 100,
  },
  insuranceActiveBadge: {
    backgroundColor: '#10B981',
  },
  insuranceExpiredBadge: {
    backgroundColor: '#EF4444',
  },
  insuranceBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  insuranceStatusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  countBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 100,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },

  // Section Header
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginHorizontal: 16, 
    marginTop: 8, 
    marginBottom: 8 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#111827' 
  },
  sectionAction: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#f23aa2ff', 
    opacity: 0.8 
  },

  // Content Container
  contentContainer: {
    paddingBottom: 20,
  },
});

export default HomeScreen;