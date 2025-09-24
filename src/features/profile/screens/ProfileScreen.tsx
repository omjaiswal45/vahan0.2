import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  const userName = 'Om Jaiswal';
  const userRole = 'Customer';

  const cars = [
    { id: 1, name: 'Toyota Corolla', year: 2022, image: 'https://cdn.pixabay.com/photo/2016/03/27/22/22/car-1289165_1280.jpg' },
    { id: 2, name: 'Honda Civic', year: 2021, image: 'https://cdn.pixabay.com/photo/2017/02/15/12/12/car-2064193_1280.jpg' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Ionicons name="person-circle" size={80} color="#2563EB" />
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>{userRole}</Text>
        </View>

        {/* My Cars */}
        <Text style={styles.sectionTitle}>My Cars</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carsContainer}>
          {cars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              <Image source={{ uri: car.image }} style={styles.carImage} />
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carYear}>{car.year}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          <View style={styles.activityItem}>
            <Ionicons name="car-outline" size={24} color="#2563EB" />
            <Text style={styles.activityText}>Booked a car inspection</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#2563EB" />
            <Text style={styles.activityText}>Contacted dealer about Toyota Corolla</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  userInfo: { alignItems: 'center', marginVertical: 20 },
  userName: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 8 },
  userRole: { fontSize: 16, color: '#6B7280' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12, marginLeft: 16 },
  carsContainer: { marginBottom: 24, paddingLeft: 16 },
  carCard: { width: 150, marginRight: 12, backgroundColor: '#fff', borderRadius: 12, padding: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  carImage: { width: '100%', height: 80, borderRadius: 8, marginBottom: 6 },
  carName: { fontWeight: '600', fontSize: 14, color: '#111827' },
  carYear: { fontSize: 12, color: '#6B7280' },
  activityContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  activityText: { marginLeft: 10, color: '#111827', fontSize: 14 },
});

export default ProfileScreen;
