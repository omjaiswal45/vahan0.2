// src/features/users/features/home/screens/HomeScreen.tsx
import React, { useEffect, useMemo, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
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
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 64) / 3;
const BANNER_HEIGHT = 200;

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HomeScreen = () => {
  const location = useSelector((state: RootState) => state.location);
  const { getLocation } = useLocation();
  const navigation = useNavigation<NavigationProp>();
  const bannerAnimation = useRef(new Animated.Value(0)).current;
  const lottieRef = useRef<LottieView>(null);

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
  }, []);

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
      stack: 'FinanceScreen',
      image: 'https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-car-insurance_516790-109.jpg',
    },
  ];

  /** ------------------ GENERIC NAVIGATION -------------------- */
  const handleNavigate = (item: typeof gridItems[0]) => {
    if (item.target) {
      navigation.navigate(item.stack as any, { screen: item.target } as any);
    } else {
      navigation.navigate(item.stack as any);
    }
  };

  /** ---------------- MOCK / Recommended Cars ---------------- */
  const recommendedCars = useMemo(() => {
    return MOCK_CARS.slice(0, 6).map(car => ({
      id: car.id,
      thumbnail: car.thumbnail,
      isSaved: car.isSaved,
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
  }, []);

  const handleBuyCarsPress = () => {
    navigation.navigate('BuyUsedCar' as any, { screen: 'CarFeed' } as any);
  };

  const handleCarPress = (car: any) => {
    console.log('HomeScreen -> navigating to car id:', car.id);
    navigation.navigate('BuyUsedCar' as any, {
      screen: 'CarDetail',
      params: { carId: car.id },
    } as any);
  };

  const handleSavePress = (car: any) => {
    console.log('save clicked', car.id);
  };

  const handleBannerPress = () => {
    navigation.navigate('BuyUsedCar' as any, { screen: 'CarFeed' } as any);
  };

  /** ---------------- RENDER ---------------- */
  const renderGridItem = ({ item }: any) => (
    <TouchableOpacity
      style={{ width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE, borderRadius: 12, overflow: 'hidden' }}
      onPress={() => handleNavigate(item)}
    >
      <ImageBackground 
        source={{ uri: item.image }} 
        style={{ flex: 1, justifyContent: 'flex-end' }} 
        imageStyle={{ borderRadius: 12 }}
      >
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.6)']} 
          style={{ ...StyleSheet.absoluteFillObject, borderRadius: 12 }} 
        />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', paddingVertical: 6 }}>
          <Text style={{ 
            color: '#fff', 
            fontWeight: '700', 
            fontSize: 14, 
            textAlign: 'center', 
            textShadowColor: 'rgba(0,0,0,0.6)', 
            textShadowOffset: { width: 0, height: 1 }, 
            textShadowRadius: 3 
          }}>
            {item.title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <>
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
        <TextInput placeholder="Search cars, brands..." style={styles.searchInput} />
      </View>

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
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={gridItems}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{ 
          justifyContent: 'space-between', 
          marginHorizontal: 16, 
          marginBottom: 16 
        }}
        renderItem={renderGridItem}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  locationContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    margin: 16, 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    shadowOffset: { width: 0, height: 2 }, 
    elevation: 2 
  },
  locationText: { 
    marginLeft: 8, 
    color: '#111827', 
    flex: 1, 
    fontWeight: '600' 
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
    marginHorizontal: spacing.lg, 
    marginBottom: spacing.lg, 
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
    fontSize: 16, 
    color: '#111827' 
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
});

export default HomeScreen;