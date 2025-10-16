// src/features/users/features/home/screens/HomeScreen.tsx
import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
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

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 64) / 3; // 3 items per row

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HomeScreen = () => {
  const location = useSelector((state: RootState) => state.location);
  const { getLocation } = useLocation();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    getLocation();
  }, []);

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
  // take first 6 (or whichever) from MOCK_CARS so ids line up with CarDetail lookup
  return MOCK_CARS.slice(0, 6).map(car => ({
    id: car.id, // ensures id matches mock data
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
    // you can include extra fields if CarCard expects them
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

  /** ---------------- RENDER ---------------- */
  const renderGridItem = ({ item }: any) => (
    <TouchableOpacity
      style={{ width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE, borderRadius: 12, overflow: 'hidden' }}
      onPress={() => handleNavigate(item)}
    >
      <ImageBackground source={{ uri: item.image }} style={{ flex: 1, justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 12 }}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={{ ...StyleSheet.absoluteFillObject, borderRadius: 12 }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', paddingVertical: 6 }}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
            {item.title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  const ListHeader = () => (
    <>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={24} color="#eb259cff" />
        <Text style={styles.locationText}>{location.city || 'Fetching location...'}</Text>
        <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6B7280" />
        <TextInput placeholder="Search cars, brands..." style={styles.searchInput} />
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
        columnWrapperStyle={{ justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 16 }}
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
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: '#fff', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  locationText: { marginLeft: 8, color: '#111827', flex: 1, fontWeight: '600' },
  refreshButton: { backgroundColor: '#ef2d97ff', padding: 6, borderRadius: 6 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, marginHorizontal: spacing.lg, marginBottom: spacing.lg, paddingHorizontal: spacing.md, borderRadius: 12, borderWidth: 1, borderColor: colors.primaryLighter, shadowColor: colors.black, shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 8, height: 40, fontSize: 16, color: '#111827' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sectionAction: { fontSize: 14, fontWeight: '600', color: '#f23aa2ff', opacity: 0.8 },
});

export default HomeScreen;
