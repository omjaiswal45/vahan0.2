import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../../../store/slices/dealerSlice';
import { setLocation, setCity } from '../../../store/slices/locationSlice';
import { AppDispatch, RootState } from '../../../store/store';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';

import KPIBox from '../components/KPIBox';
import LocationSelect from '../components/LocationSelect';

const DashboardScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { dashboard, loading, error } = useSelector(
    (state: RootState) => state.dealer
  );
  const { city } = useSelector((state: RootState) => state.location);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    detectAndStoreLocation();
    dispatch(fetchDashboard());
  }, []);

  const detectAndStoreLocation = async () => {
    try {
      setIsDetectingLocation(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        setIsDetectingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Store coordinates in Redux
      dispatch(
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      );

      // Reverse geocode to get city
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const detectedCity =
          place.city || place.subregion || place.district || 'Unknown Location';

        dispatch(setCity(detectedCity));
        console.log('Location detected and stored:', detectedCity);
      }
    } catch (error: any) {
      console.error('Location detection error:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleLocationChange = (location: string) => {
    setShowLocationModal(false);
    // Optionally refresh dashboard
    dispatch(fetchDashboard());
  };

  // Loading state
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#667eea"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#EF4444" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Safe default data
  const totalListings = dashboard?.totalListings ?? 0;
  const newLeads = dashboard?.newLeads ?? 0;
  const recentActivity = dashboard?.recentActivity || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {/* Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.statusBarSpacer} />
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View>
              
              <Text style={styles.headerTitle}>Dashboard</Text>
            </View>
          </View>

          {/* Location Card */}
          <View style={styles.locationCard}>
            <View style={styles.locationCardContent}>
              <View style={styles.locationIconWrapper}>
                <Ionicons
                  name={isDetectingLocation ? 'sync' : 'location-sharp'}
                  size={22}
                  color="#667eea"
                />
              </View>
              <View style={styles.locationTextWrapper}>
                <Text style={styles.locationLabel}>Your Location</Text>
                <Text style={styles.locationValue}>
                  {isDetectingLocation
                    ? 'Detecting your location...'
                    : city || 'Location not set'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.changeLocationButton}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.changeLocationText}>Change</Text>
              <Ionicons name="chevron-forward" size={16} color="#667eea" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Dashboard Content */}
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.kpiContainer}>
          <KPIBox title="Total Listings" value={totalListings} />
          <KPIBox title="New Leads" value={newLeads} />
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivity}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>{item}</Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="document-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No recent activity</Text>
            </View>
          }
        />
      </View>

      {/* Location Select Modal */}
     
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  statusBarSpacer: { height: 40 },
  headerWrapper: {
    backgroundColor: '#667eea',
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContainer: { paddingHorizontal: 20 },
  headerTop: { marginBottom: 20 },
  greetingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 20,
    color: '#1F2937',
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  locationCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  locationIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrapper: { flex: 1 },
  locationLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
  locationValue: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  changeLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  changeLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  content: { flex: 1, padding: 20 },
  kpiContainer: { marginTop: 8, gap: 12 },
  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  activityItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  activityText: { fontSize: 14, color: '#374151' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#9CA3AF', marginTop: 8 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  errorText: { marginTop: 16, fontSize: 16, color: '#EF4444', textAlign: 'center' },
});

export default DashboardScreen;
