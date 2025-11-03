import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchDashboard } from '../../../store/slices/dealerSlice';
import { setLocation, setCity } from '../../../store/slices/locationSlice';
import { AppDispatch, RootState } from '../../../store/store';
import * as Location from 'expo-location';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 3) / 2;

const DashboardScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();

  const { dashboard, loading, error } = useSelector((state: RootState) => state.dealer);
  const { city } = useSelector((state: RootState) => state.location);
  const { role } = useSelector((state: RootState) => state.auth);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dealerName, setDealerName] = useState('Rajesh Motors');

  useEffect(() => {
    detectAndStoreLocation();
    dispatch(fetchDashboard());
  }, []);

  const detectAndStoreLocation = async () => {
    try {
      setIsDetectingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsDetectingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      dispatch(
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
      );

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const place = reverseGeocode[0];
        const detectedCity =
          place.city || place.subregion || place.district || 'Unknown Location';
        dispatch(setCity(detectedCity));
      }
    } catch (error: any) {
      console.error('Location detection error:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDashboard());
    setRefreshing(false);
  };

  // Safe default data
  const totalListings = dashboard?.totalListings ?? 12;
  const newLeads = dashboard?.newLeads ?? 8;
  const activeListings = dashboard?.activeListings ?? 10;
  const soldThisMonth = dashboard?.soldThisMonth ?? 3;
  const totalViews = dashboard?.totalViews ?? 245;
  const revenue = dashboard?.revenue ?? '₹15,50,000';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff1ea5ff" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff1ea5ff" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ff1ea5ff']} />
        }
      >
        {/* Header Section with Gradient */}
        <LinearGradient colors={['#ff1ea5ff', '#ff1ea5dd']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            {/* Welcome Message */}
            <View style={styles.welcomeSection}>
              <Text style={styles.greetingText}>{getGreeting()} 👋</Text>
              <Text style={styles.dealerName}>{dealerName}</Text>
            </View>

            {/* Location Card */}
            <TouchableOpacity
              style={styles.locationCard}
              activeOpacity={0.8}
              onPress={detectAndStoreLocation}
            >
              <View style={styles.locationLeft}>
                <View style={styles.locationIconWrapper}>
                  <Ionicons
                    name={isDetectingLocation ? 'sync' : 'location'}
                    size={20}
                    color="#ff1ea5ff"
                  />
                </View>
                <View style={styles.locationTextWrapper}>
                  <Text style={styles.locationLabel}>Your Location</Text>
                  <Text style={styles.locationValue} numberOfLines={1}>
                    {isDetectingLocation ? 'Detecting...' : city || 'Set Location'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Overview Cards */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="car"
              iconColor="#ff1ea5ff"
              bgColor="#fff0f8"
              title="Total Listings"
              value={totalListings.toString()}
              onPress={() => navigation.navigate('Listings')}
            />
            <StatCard
              icon="people"
              iconColor="#10b981"
              bgColor="#ecfdf5"
              title="New Leads"
              value={newLeads.toString()}
              badge={newLeads > 0 ? 'New' : undefined}
              onPress={() => navigation.navigate('Leads')}
            />
            <StatCard
              icon="checkmark-circle"
              iconColor="#3b82f6"
              bgColor="#eff6ff"
              title="Active Listings"
              value={activeListings.toString()}
            />
            <StatCard
              icon="trophy"
              iconColor="#f59e0b"
              bgColor="#fffbeb"
              title="Sold This Month"
              value={soldThisMonth.toString()}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              icon="add-circle"
              title="Add Listing"
              subtitle="Post a new car"
              color="#ff1ea5ff"
              onPress={() => navigation.navigate('Listings', { screen: 'AddListingStack' })}
            />
            <QuickActionCard
              icon="eye"
              title="View Listings"
              subtitle="Manage cars"
              color="#3b82f6"
              onPress={() => navigation.navigate('Listings')}
            />
            <QuickActionCard
              icon="chatbubbles"
              title="Messages"
              subtitle="Check leads"
              color="#10b981"
              onPress={() => navigation.navigate('Leads')}
            />
            <QuickActionCard
              icon="analytics"
              title="Analytics"
              subtitle="View reports"
              color="#f59e0b"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Insights Section */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Business Insights</Text>

          {/* Revenue Card */}
          <TouchableOpacity style={styles.revenueCard} activeOpacity={0.9}>
            <View style={styles.revenueHeader}>
              <View style={styles.revenueIconWrapper}>
                <Ionicons name="wallet" size={24} color="#fff" />
              </View>
              <View style={styles.revenueInfo}>
                <Text style={styles.revenueLabel}>Monthly Revenue</Text>
                <Text style={styles.revenueValue}>{revenue}</Text>
              </View>
            </View>
            <View style={styles.revenueTrend}>
              <Ionicons name="trending-up" size={16} color="#10b981" />
              <Text style={styles.revenueTrendText}>+12% from last month</Text>
            </View>
          </TouchableOpacity>

          {/* Views Card */}
          <View style={styles.viewsCard}>
            <View style={styles.viewsLeft}>
              <Ionicons name="eye" size={24} color="#ff1ea5ff" />
              <View style={styles.viewsInfo}>
                <Text style={styles.viewsLabel}>Total Views</Text>
                <Text style={styles.viewsValue}>{totalViews}</Text>
              </View>
            </View>
            <View style={styles.viewsBadge}>
              <Text style={styles.viewsBadgeText}>This Week</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ActivityItem
            icon="checkmark-circle"
            iconColor="#10b981"
            title="Listing Sold"
            description="Honda City 2019 was marked as sold"
            time="2 hours ago"
          />
          <ActivityItem
            icon="person-add"
            iconColor="#3b82f6"
            title="New Lead"
            description="Inquiry for Maruti Swift 2021"
            time="5 hours ago"
          />
          <ActivityItem
            icon="create"
            iconColor="#f59e0b"
            title="Listing Updated"
            description="Updated price for Hyundai Creta"
            time="1 day ago"
          />
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  title: string;
  value: string;
  badge?: string;
  onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor,
  bgColor,
  title,
  value,
  badge,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.statCard}
    activeOpacity={0.8}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={[styles.statIconWrapper, { backgroundColor: bgColor }]}>
      <Ionicons name={icon as any} size={24} color={iconColor} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
    {badge && (
      <View style={styles.statBadge}>
        <Text style={styles.statBadgeText}>{badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

// Quick Action Card Component
interface QuickActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  subtitle,
  color,
  onPress,
}) => (
  <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      <Ionicons name={icon as any} size={24} color="#fff" />
    </View>
    <Text style={styles.quickActionTitle}>{title}</Text>
    <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

// Activity Item Component
interface ActivityItemProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  iconColor,
  title,
  description,
  time,
}) => (
  <View style={styles.activityItem}>
    <View style={[styles.activityIconWrapper, { backgroundColor: `${iconColor}20` }]}>
      <Ionicons name={icon as any} size={20} color={iconColor} />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activityDescription}>{description}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    gap: 16,
  },
  welcomeSection: {
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  dealerName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  locationIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff0f8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextWrapper: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statsSection: {
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative',
  },
  statIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  statBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  quickActionsSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  insightsSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  revenueCard: {
    backgroundColor: '#ff1ea5ff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#ff1ea5ff',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  revenueIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueInfo: {
    flex: 1,
  },
  revenueLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  revenueTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 6,
  },
  revenueTrendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  viewsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  viewsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  viewsInfo: {
    gap: 4,
  },
  viewsLabel: {
    fontSize: 13,
    color: '#666',
  },
  viewsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  viewsBadge: {
    backgroundColor: '#fff0f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff1ea5ff',
  },
  activitySection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff1ea5ff',
  },
  activityItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  activityIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default DashboardScreen;
