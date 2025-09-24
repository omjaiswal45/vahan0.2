import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useLocation } from '../../location/hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;
const GRID_ITEM_SIZE = (width - 64) / 3; // 3 boxes per row with margin

const HomeScreen = () => {
  const location = useSelector((state: RootState) => state.location);
  const { getLocation } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    getLocation();
  }, []);

  const cars = [
    {
      id: 1,
      name: 'Toyota Corolla',
      year: 2022,
      price: 15000,
      color: 'Red',
      image:
        'https://di-uploads-pod6.dealerinspire.com/savannahtoyota/uploads/2020/09/corolla-red.png',
    },
    {
      id: 2,
      name: 'Honda Civic',
      year: 2021,
      price: 18000,
      color: 'white',
      image:
        'https://images.prismic.io/carwow/ZpVHWx5LeNNTxKjo_2023HondaCivicfrontquarterdynamic.png?auto=format&cs=tinysrgb&fit=max&q=60',
    },
    {
      id: 3,
      name: 'BMW X5',
      year: 2023,
      price: 45000,
      color: 'Black',
      image:
        'https://stimg.cardekho.com/images/carexteriorimages/930x620/BMW/X5-2023/10452/1688992642182/front-left-side-47.jpg?impolicy=resize&imwidth=420',
    },
  ];

  const gridItems = [
    {
      id: 1,
      title: 'Sell Your Car',
      screen: 'NewCarsScreen',
      image:
        'https://acko-cms.ackoassets.com/tips_to_sell_car_6ad4e5b64f.png',
    },
    {
      id: 2,
      title: 'Buy Used Car',
      screen: 'UsedCarsScreen',
      image:
        'https://www.shutterstock.com/image-vector/happy-man-dressed-suit-next-600nw-515454121.jpg',
    },
    {
      id: 3,
      title: 'Car Loan',
      screen: 'DealsScreen',
      image:
        'https://elements-resized.envatousercontent.com/elements-cover-images/81388270-0885-46c7-8ea2-73754fa5b15c?w=433&cf_fit=scale-down&q=85&format=auto&s=6cefb53587fc0aac2a156ecb8fd9350f06de785ee0d3ed3e69103b3de5f82006',
    },
    {
      id: 4,
      title: 'Challan Check',
      screen: 'ServicesScreen',
      image:
        'https://cdn.shriramgi.com/webassets/blogs/1f496a36-1409-4ea5-b969-3d534d72f108_chennai-traffic-challan-status-guide.webp',
    },
    {
      id: 5,
      title: 'RC Check',
      screen: 'AccessoriesScreen',
      image:
        'https://vehicleinfo.app/rtoinfo/vehicle-registration.png',
    },
    {
      id: 6,
      title: 'Car Insurance',
      screen: 'FinanceScreen',
      image:
        'https://img.freepik.com/premium-vector/illustration-vector-graphic-cartoon-character-car-insurance_516790-109.jpg',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 20 }} 
        showsVerticalScrollIndicator={false} // Hide vertical scrollbar
      >
        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color="#2563EB" />
          <Text style={styles.locationText}>
            {location.city ? location.city : 'Fetching location...'}
          </Text>
          <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" />
          <TextInput
            placeholder="Search cars, brands..."
            style={styles.searchInput}
          />
        </View>

        {/* Grid Menu */}
        {[0, 1].map((rowIndex) => (
          <View key={rowIndex} style={styles.gridRow}>
            {gridItems
              .slice(rowIndex * 3, rowIndex * 3 + 3)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => navigation.navigate(item.screen as never)}
                >
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.gridImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    {/* Fade overlay */}
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.6)']}
                      style={styles.gridGradient}
                    />
                    {/* Title */}
                    <View style={styles.gridTextContainer}>
                      <Text style={styles.gridItemText}>{item.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
          </View>
        ))}

        {/* Car Feed */}
        <Text style={styles.sectionTitle}>Nearby Cars</Text>
        <View style={styles.carsContainer}>
          {cars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              <Image source={{ uri: car.image }} style={styles.carImage} />
              <View style={styles.carDetails}>
                <Text style={styles.carName}>{car.name}</Text>
                <Text style={styles.carInfo}>Year: {car.year}</Text>
                <Text style={styles.carInfo}>
                  Price: {car.price.toLocaleString()}
                </Text>
                <Text style={styles.carInfo}>Color: {car.color}</Text>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
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
    elevation: 2,
  },
  locationText: { marginLeft: 8, color: '#111827', flex: 1, fontWeight: '600' },
  refreshButton: { backgroundColor: '#2563EB', padding: 6, borderRadius: 6 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    height: 40,
    fontSize: 16,
    color: '#111827',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  gridGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  gridTextContainer: {
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
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    marginLeft: 16,
  },
  carsContainer: { paddingHorizontal: 16 },
  carCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    overflow: 'hidden',
  },
  carImage: { width: '100%', height: 180 },
  carDetails: { padding: 12 },
  carName: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  carInfo: { fontSize: 14, color: '#6B7280', marginBottom: 2 },
  bookButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default HomeScreen;
