// src/features/users/features/home/screens/HomeScreen.tsx
import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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

// Adjust this import path to match your project structure:
import { CarCard } from '../../buyUsedCar/components/CarCard';

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 64) / 3;

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const HomeScreen = () => {
  const location = useSelector((state: RootState) => state.location);
  const { getLocation } = useLocation();
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    getLocation();
  }, []);

  const gridItems: {
    id: number;
    title: string;
    stack: keyof HomeStackParamList;
    target?: string;
    image: string;
  }[] = [
    { id: 1, title: 'Sell Your Car', stack: 'NewCarsScreen', image: 'https://acko-cms.ackoassets.com/tips_to_sell_car_6ad4e5b64f.png' },
    { id: 2, title: 'Buy Used Car', stack: 'BuyUsedCarStack', target: 'CarFeedScreen', image: 'https://image.shutterstock.com/image-illustration/happy-man-dressed-suit-next-600nw-515454121.jpg' },
    { id: 3, title: 'Car Loan', stack: 'DealsScreen', image: 'https://elements-resized.envatousercontent.com/elements-cover-images/81388270-0885-46c7-8ea2-73754fa5b15c?w=433&cf_fit=scale-down&q=85&format=auto&s=6cefb53587fc0aac2a156ecb8fd9350f06de785ee0d3ed3e69103b3de5f82006' },
    { id: 4, title: 'Challan Check', stack: 'ServicesScreen', image: 'https://cdn.shriramgi.com/webassets/blogs/1f496a36-1409-4ea5-b969-3d534d72f108_chennai-traffic-challan-status-guide.webp' },
    { id: 5, title: 'RC Check', stack: 'RCCheckStack', target: 'RCCheckHome', image: 'https://vehicleinfo.app/rtoinfo/vehicle-registration.png' },
    { id: 6, title: 'Car Insurance', stack: 'FinanceScreen', image: 'https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-car-insurance_516790-109.jpg' },
  ];

  const handleNavigate = (item: typeof gridItems[0]) => {
    if (item.target) {
      navigation.navigate(item.stack as any, { screen: item.target } as any);
    } else {
      navigation.navigate(item.stack as any);
    }
  };

  // --- MOCK / example cars for horizontal list ---
  // Replace with real data from redux/api where available
  const recommendedCars = useMemo(() => ([
    {
      id: 'c1',
      thumbnail: 'https://images.financialexpressdigital.com/2020/05/maruti-suzuki-swift.jpg?w=660',
      isSaved: false,
      isVerified: true,
      brand: 'Maruti',
      model: 'Swift',
      year: 2018,
      variant: 'VXI',
      km: 45000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      ownerNumber: 1,
      location: { city: 'Gurgaon', state: 'Haryana' },
      price: 450000,
    },
    {
      id: 'c2',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPKv5m5AIqKXIb5tvvNtWJun2F1-u9h8kpdA&s',
      isSaved: true,
      isVerified: false,
      brand: 'Hyundai',
      model: 'i20',
      year: 2017,
      variant: 'Asta',
      km: 52000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      ownerNumber: 2,
      location: { city: 'Noida', state: 'Uttar Pradesh' },
      price: 530000,
    },
    {
      id: 'c3',
      thumbnail: 'https://m.media-amazon.com/images/I/61W6YPlEx9L._UF1000,1000_QL80_.jpg',
      isSaved: false,
      isVerified: true,
      brand: 'Honda',
      model: 'City',
      year: 2016,
      variant: 'VX',
      km: 72000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      ownerNumber: 1,
      location: { city: 'Lucknow', state: 'Uttar Pradesh' },
      price: 780000,
    },
    {
      id: 'c4',
      thumbnail: 'https://m.media-amazon.com/images/I/61W6YPlEx9L._UF1000,1000_QL80_.jpg',
      isSaved: false,
      isVerified: true,
      brand: 'Ford',
      model: 'Figo',
      year: 2015,
      variant: 'Titanium',
      km: 90000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      ownerNumber: 2,
      location: { city: 'Kanpur', state: 'Uttar Pradesh' },
      price: 320000,
    },
    {
      id: 'c5',
      thumbnail: 'https://cdn.pixabay.com/photo/2017/08/06/18/56/speed-2599079_1280.jpg',
      isSaved: true,
      isVerified: false,
      brand: 'Toyota',
      model: 'Etios',
      year: 2014,
      variant: 'G',
      km: 102000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      ownerNumber: 3,
      location: { city: 'Agra', state: 'Uttar Pradesh' },
      price: 290000,
    },
    {
      id: 'c6',
      thumbnail: 'https://cdn.pixabay.com/photo/2020/04/11/18/33/buggy-5027957_1280.jpg',
      isSaved: false,
      isVerified: true,
      brand: 'Tata',
      model: 'Tiago',
      year: 2019,
      variant: 'XT',
      km: 30000,
      fuelType: 'Petrol',
      transmission: 'Manual',
      ownerNumber: 1,
      location: { city: 'Allahabad', state: 'Uttar Pradesh' },
      price: 445000,
    },
  ]), []);

const handleBuyCarsPress = () => {
  navigation.navigate('BuyUsedCar' as any, {
    screen: 'CarFeed',
  } as any);
};


const handleCarPress = (car: any) => {
  navigation.navigate('BuyUsedCar' as any, {
    screen: 'CarDetail',
    params: { carId: car.id } // ✅ must match the type
  } as any);
};


  const handleSavePress = (car: any) => {
    // Replace with dispatch to save/unsave action
    console.log('save clicked', car.id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color="#2563EB" />
          <Text style={styles.locationText}>{location.city || 'Fetching location...'}</Text>
          <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput placeholder="Search cars, brands..." style={styles.searchInput} />
        </View>

        {/* Grid Menu */}
        {[0, 1].map((rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {gridItems.slice(rowIndex * 3, rowIndex * 3 + 3).map((item) => (
              <TouchableOpacity key={item.id} style={styles.gridItem} onPress={() => handleNavigate(item)}>
                <ImageBackground source={{ uri: item.image }} style={styles.gridImage} imageStyle={{ borderRadius: 12 }}>
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.gridGradient} />
                  <View style={styles.gridTextContainer}>
                    <Text style={styles.gridItemText}>{item.title}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* --- Horizontal recommended cars section --- */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', margin: 16, backgroundColor: '#fff', padding: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  locationText: { marginLeft: 8, color: '#111827', flex: 1, fontWeight: '600' },
  refreshButton: { backgroundColor: '#2563EB', padding: 6, borderRadius: 6 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 16, paddingHorizontal: 12, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 8, height: 40, fontSize: 16, color: '#111827' },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginBottom: 16 },
  gridItem: { width: GRID_ITEM_SIZE, height: GRID_ITEM_SIZE, borderRadius: 12, overflow: 'hidden' },
  gridImage: { flex: 1, justifyContent: 'flex-end' },
  gridGradient: { ...StyleSheet.absoluteFillObject, borderRadius: 12 },
  gridTextContainer: { position: 'absolute', bottom: 0, width: '100%', alignItems: 'center', paddingVertical: 6 },
  gridItemText: { color: '#fff', fontWeight: '700', fontSize: 14, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },

  // section header for horizontal list
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  sectionAction: { fontSize: 14, fontWeight: '600', color: '#2563EB', opacity: 0.8 },

});

export default HomeScreen;
