import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { useLocation } from '../../location/hooks/useLocation';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // full width minus padding

const HomeScreen = () => {
  const location = useSelector((state: RootState) => state.location);
  const { getLocation } = useLocation();

  useEffect(() => {
    getLocation();
  }, []);

  const cars = [
    { id: 1, name: 'Toyota Corolla', year: 2022, price: 15000, color: 'Red', image: 'https://di-uploads-pod6.dealerinspire.com/savannahtoyota/uploads/2020/09/corolla-red.png'},
    { id: 2, name: 'Honda Civic', year: 2021, price: 18000, color: 'white', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg/1200px-Honda_Civic_e-HEV_Sport_%28XI%29_%E2%80%93_f_30062024.jpg' },
    { id: 3, name: 'BMW X5', year: 2023, price: 45000, color: 'Black', image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/BMW/X5-2023/10452/1688992642182/front-left-side-47.jpg?impolicy=resize&imwidth=420' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Location */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={24} color="#2563EB" />
          <Text style={styles.locationText}>
            {location.latitude != null && location.longitude != null
              ? `Lat: ${location.latitude.toFixed(4)}, Lng: ${location.longitude.toFixed(4)}`
              : 'Fetching location...'}
          </Text>
          <TouchableOpacity onPress={getLocation} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Car Feed */}
        <Text style={styles.sectionTitle}>Nearby Cars</Text>
        <View style={styles.carsContainer}>
          {cars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              <Image source={{ uri: car.image }} style={styles.carImage} />

              <View style={styles.carDetails}>
                <Text style={styles.carName}>{car.name}</Text>
                <Text style={styles.carInfo}>Year:  {car.year}</Text>
                <Text style={styles.carInfo}>Price: {car.price.toLocaleString()}</Text>
                <Text style={styles.carInfo}>Color: {car.color}</Text>
              </View>

              {/* Book Button Outside Card Content */}
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
  locationText: { marginLeft: 8, color: '#111827', flex: 1 },
  refreshButton: { backgroundColor: '#2563EB', padding: 6, borderRadius: 6 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 12, marginLeft: 16 },
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
    overflow: 'hidden', // keep image rounded
  },
  carImage: { width: '100%', height: 180 },
  carDetails: { padding: 12 },
  carName: { fontWeight: '700', fontSize: 16, color: '#111827', marginBottom: 4 },
  carInfo: { fontSize: 14, color: '#6B7280', marginBottom: 2 },
  bookButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    alignItems: 'center',
  },
  bookButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default HomeScreen;
