// src/features/users/features/profile/screens/ProfileScreen.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileOptionCard } from '../components/ProfileOptionCard';
import { useProfile } from '../hooks/useProfile';
import { ProfileOption } from '../types';
import { Colors } from '../../../../../styles/colors';
import { Spacing } from '../../../../../styles/spacing';
import { Typography } from '../../../../../styles/typography';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, stats, refreshing, refreshData } = useProfile();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    refreshData();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const isDealer = profile.role === 'dealer';

  // Animated header opacity based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Animated background opacity - fades out when scrolling
  const backgroundOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

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
    <View style={styles.container}>
      {/* Main Background Gradient - Fades on scroll */}
      <Animated.View style={{ opacity: backgroundOpacity }}>
        <LinearGradient
          colors={['#fff0f6', '#ffe4f1', '#ffd6eb', '#ffe8f5']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      {/* Animated Sticky Header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <View style={styles.stickyHeaderContent}>
          <Text style={styles.stickyHeaderText}>{profile.name}</Text>
          <TouchableOpacity onPress={handleEditProfile} style={styles.stickyEditButton}>
            <Ionicons name="create-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Cover Solid Color with Particles Effect - Fades on scroll */}
      <Animated.View style={{ opacity: backgroundOpacity }}>
        <View style={styles.coverSolid}>
          <View style={styles.particlesContainer}>
            {[...Array(20)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.particle,
                  {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.5,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            tintColor={Colors.white}
            colors={[Colors.white]}
          />
        }
      >
        {/* Profile Header */}
        <Animated.View
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ProfileHeader
            profile={profile}
            onEditPress={handleEditProfile}
            onAvatarPress={handleAvatarPress}
          />
        </Animated.View>

        {/* Stats Cards - Animated */}
        {stats && (
          <Animated.View
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
              },
            ]}
          >
            {[
              {
                icon: 'car-sport',
                value: stats.totalListings,
                label: 'Listings',
                color: Colors.primary,
                onPress: () => navigation.navigate('MyListings' as never),
              },
              {
                icon: isDealer ? 'people' : 'heart',
                value: isDealer ? stats.totalLeads : stats.savedCars,
                label: isDealer ? 'Leads' : 'Saved',
                color: Colors.error,
                onPress: () => !isDealer && navigation.navigate('SavedCars' as never),
              },
              {
                icon: 'checkmark-circle',
                value: stats.soldCars,
                label: 'Sold',
                color: Colors.success,
                onPress: null,
              },
            ].map((stat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.statCard}
                activeOpacity={0.7}
                onPress={stat.onPress || undefined}
              >
                <LinearGradient
                  colors={[stat.color + '08', stat.color + '15']}
                  style={styles.statGradient}
                >
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: stat.color + '20' },
                    ]}
                  >
                    <Ionicons name={stat.icon as any} size={26} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.quickActionsRow}>
            {!isDealer && (
              <TouchableOpacity
                style={styles.quickActionCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('BuyUsedCar' as never)}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryDark]}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="search" size={28} color={Colors.white} />
                  <Text style={styles.quickActionText}>Browse Cars</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.quickActionCard}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SellCar' as never)}
            >
              <LinearGradient
                colors={[Colors.success, '#059669']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add-circle" size={28} color={Colors.white} />
                <Text style={styles.quickActionText}>Sell Car</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Options Section - Improved */}
        <Animated.View
          style={[
            styles.optionsContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{options.length}</Text>
            </View>
          </View>

          <View style={styles.optionsGrid}>
            {options.map((option, index) => (
              <Animated.View
                key={option.id}
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + index * 10],
                      }),
                    },
                  ],
                }}
              >
                <ProfileOptionCard
                  option={option}
                  onPress={() => handleOptionPress(option)}
                />
              </Animated.View>
            ))}
          </View>

          {/* Support Section */}
          <View style={styles.supportSection}>
            <Text style={styles.supportTitle}>Need Help?</Text>
            <View style={styles.supportRow}>
              <TouchableOpacity style={styles.supportCard} activeOpacity={0.7}>
                <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary} />
                <Text style={styles.supportCardText}>Chat Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.supportCard} activeOpacity={0.7}>
                <Ionicons name="call" size={24} color={Colors.success} />
                <Text style={styles.supportCardText}>Call Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.supportCard} activeOpacity={0.7}>
                <Ionicons name="help-circle" size={24} color={Colors.warning} />
                <Text style={styles.supportCardText}>FAQ</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Option - Redesigned */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[Colors.error + '08', Colors.error + '12']}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.logoutContent}>
                <View style={styles.logoutIconContainer}>
                  <Ionicons name="log-out" size={26} color={Colors.error} />
                </View>
                <View style={styles.logoutTextContainer}>
                  <Text style={styles.logoutText}>Logout from Account</Text>
                  <Text style={styles.logoutSubtext}>You can login anytime</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={22} color={Colors.error} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>VahanHelp v1.0.0</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </View>
          <Text style={styles.footerCopyright}>© 2024 VahanHelp. All rights reserved.</Text>
        </View>

        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Sticky animated header
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.primary,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
      android: {
        paddingTop: 0,
      },
    }),
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  blurHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.white + '10',
  },
  whiteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stickyHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },
  stickyHeaderText: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
  },
  stickyEditButton: {
    padding: Spacing.xs,
  },
  // Cover gradient
  coverGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  coverSolid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
    backgroundColor: '#ff66b3',
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  headerSection: {
    marginBottom: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  statGradient: {
    padding: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  statIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 30,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: 2,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  quickActionGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  optionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    letterSpacing: -0.8,
  },
  sectionBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    alignItems: 'center',
  },
  sectionBadgeText: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primary,
  },
  optionsGrid: {
    marginBottom: Spacing.lg,
  },
  // Support Section
  supportSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  supportTitle: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  supportRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  supportCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: Spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  supportCardText: {
    fontSize: 11,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  // Logout Button
  logoutButton: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginTop: Spacing.md,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.error + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  logoutTextContainer: {
    flex: 1,
  },
  logoutText: {
    fontSize: 18,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  logoutSubtext: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
  },
  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  versionText: {
    fontSize: 14,
    fontFamily: Typography.fontFamily.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  footerLink: {
    fontSize: 13,
    fontFamily: Typography.fontFamily.medium,
    color: Colors.primary,
  },
  footerDot: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.sm,
  },
  footerCopyright: {
    fontSize: 12,
    fontFamily: Typography.fontFamily.regular,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  bottomPadding: {
    height: Spacing.xxl,
  },
});