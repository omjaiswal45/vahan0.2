// src/features/users/features/profile/screens/ProfileScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileOptionCard } from '../components/ProfileOptionCard';
import { useProfile } from '../hooks/useProfile';
import { ProfileOption } from '../types';
import { Colors } from '../../../../../styles/colors';
import { Spacing } from '../../../../../styles/spacing';
import { Typography } from '../../../../../styles/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, stats, refreshing, refreshData } = useProfile();

  useEffect(() => {
    refreshData();
  }, []);

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const isDealer = profile.role === 'dealer';

  // Profile options for customers
  const customerOptions: ProfileOption[] = [
    {
      id: 'saved-cars',
      title: 'Saved Cars',
      subtitle: `${stats?.savedCars || 0} cars saved`,
      icon: 'heart',
      route: 'SavedCars',
      color: Colors.danger,
      badge: stats?.savedCars,
    },
    {
      id: 'my-listings',
      title: 'My Listings',
      subtitle: `${stats?.totalListings || 0} active listings`,
      icon: 'car',
      iconType: 'ionicon',
      route: 'MyListings',
      color: Colors.primary,
      badge: stats?.activeListing,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Notifications, privacy & preferences',
      icon: 'settings',
      route: 'Settings',
      color: Colors.textLight,
    },
  ];

  // Profile options for dealers
  const dealerOptions: ProfileOption[] = [
    {
      id: 'my-listings',
      title: 'My Inventory',
      subtitle: `${stats?.totalListings || 0} listings`,
      icon: 'car-sport',
      route: 'MyListings',
      color: Colors.primary,
      badge: stats?.activeListing,
    },
    {
      id: 'leads',
      title: 'Leads',
      subtitle: `${stats?.totalLeads || 0} total leads`,
      icon: 'people',
      route: 'Leads',
      color: Colors.secondary,
      badge: stats?.activeLeads,
    },
    {
      id: 'performance',
      title: 'Performance',
      subtitle: `${stats?.soldCars || 0} cars sold`,
      icon: 'analytics',
      route: 'Performance',
      color: Colors.secondary,
    },
    {
      id: 'settings',
      title: 'Settings',
      subtitle: 'Business settings & preferences',
      icon: 'settings',
      route: 'Settings',
      color: Colors.textSecondary,
    },
  ];

  const options = isDealer ? dealerOptions : customerOptions;

  const handleOptionPress = (option: ProfileOption) => {
    if (option.action) {
      option.action();
    } else if (option.route) {
      navigation.navigate(option.route as never);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleAvatarPress = () => {
    navigation.navigate('EditProfile' as never);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Dispatch logout action
            // navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          onEditPress={handleEditProfile}
          onAvatarPress={handleAvatarPress}
        />

        {/* Stats Section */}
        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalListings}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {isDealer ? stats.totalLeads : stats.savedCars}
              </Text>
              <Text style={styles.statLabel}>
                {isDealer ? 'Leads' : 'Saved'}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.soldCars}</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
          </View>
        )}

        {/* Options Section */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Account</Text>

          {options.map((option) => (
            <ProfileOptionCard
              key={option.id}
              option={option}
              onPress={() => handleOptionPress(option)}
            />
          ))}

          {/* Logout Option */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.logoutContent}>
              <View style={styles.logoutIconContainer}>
                <Ionicons name="log-out-outline" size={24} color={Colors.error} />
              </View>
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.lg,
    marginTop: -30,
    borderRadius: 16,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  optionsContainer: {
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  logoutButton: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.error,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});