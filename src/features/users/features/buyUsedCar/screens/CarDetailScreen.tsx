// src/features/users/features/buyUsedCar/screens/CarDetailScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCarDetails } from '../hooks/useBuyUsedCar';
import { buyUsedCarAPI } from '../services/buyUsedCarAPI';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

const { width } = Dimensions.get('window');

export const CarDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { carId } = route.params as { carId: string };
  const { car, loading } = useCarDetails(carId);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (car) {
      setIsSaved(car.isSaved || false);
      // Track view
      buyUsedCarAPI.trackCarView(carId, 'current-user-id');
    }
  }, [car, carId]);

  const handleSave = async () => {
    try {
      const result = await buyUsedCarAPI.toggleSaveCar({
        carId,
        userId: 'current-user-id',
      });
      setIsSaved(result.isSaved);
    } catch (error) {
      console.error('Failed to save car:', error);
    }
  };

  const handleCall = () => {
    if (car?.dealerPhone) {
      Linking.openURL(`tel:${car.dealerPhone}`);
    }
  };

  const handleWhatsApp = () => {
    if (car?.dealerPhone) {
      const message = `Hi, I'm interested in your ${car.brand} ${car.model} (${car.year})`;
      Linking.openURL(`whatsapp://send?phone=${car.dealerPhone}&text=${encodeURIComponent(message)}`);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveSlide(roundIndex);
  };

  const renderImageItem = ({ item }: { item: string }) => (
    <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!car) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Car not found</Text>
      </View>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : [car.thumbnail];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `${item}-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          />
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeSlide === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButtonDetail} onPress={handleSave}>
            <Ionicons
              name={isSaved ? 'heart' : 'heart-outline'}
              size={24}
              color={isSaved ? colors.error : colors.white}
            />
          </TouchableOpacity>
        </View>

        {/* Car Info */}
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {car.brand} {car.model}
              </Text>
              {car.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>
            {car.variant && <Text style={styles.variant}>{car.variant}</Text>}
            <Text style={styles.price}>{formatPrice(car.price)}</Text>
          </View>

          {/* Key Specs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Specifications</Text>
            <View style={styles.specsGrid}>
              <View style={styles.specItem}>
                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                <Text style={styles.specLabel}>Year</Text>
                <Text style={styles.specValue}>{car.year}</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="speedometer-outline" size={24} color={colors.primary} />
                <Text style={styles.specLabel}>KM Driven</Text>
                <Text style={styles.specValue}>{(car.km / 1000).toFixed(0)}k km</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="water-outline" size={24} color={colors.primary} />
                <Text style={styles.specLabel}>Fuel</Text>
                <Text style={styles.specValue}>{car.fuelType}</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="cog-outline" size={24} color={colors.primary} />
                <Text style={styles.specLabel}>Transmission</Text>
                <Text style={styles.specValue}>{car.transmission}</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="person-outline" size={24} color={colors.primary} />
                <Text style={styles.specLabel}>Ownership</Text>
                <Text style={styles.specValue}>{car.ownerNumber} Owner</Text>
              </View>
              <View style={styles.specItem}>
                <Ionicons name="location-outline" size={24} color={colors.primary} />
                <Text style={styles.specLabel}>Location</Text>
                <Text style={styles.specValue}>{car.location?.city ?? ''}</Text>
              </View>
            </View>
          </View>

          {/* Description */}
          {car.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{car.description}</Text>
            </View>
          )}

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresContainer}>
                {car.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Dealer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dealer Information</Text>
            <View style={styles.dealerCard}>
              <View style={styles.dealerAvatar}>
                <Ionicons name="business" size={24} color={colors.primary} />
              </View>
              <View style={styles.dealerInfo}>
                <Text style={styles.dealerName}>{car.dealerName}</Text>
                {car.dealerLocation && (
                  <Text style={styles.dealerLocation}>{car.dealerLocation}</Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color={colors.white} />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleWhatsApp}
        >
          <Ionicons name="logo-whatsapp" size={24} color={colors.white} />
          <Text style={styles.actionText}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: typography.sizes.lg,
    color: colors.textSecondary,
  },
  carouselContainer: {
    height: 300,
    position: 'relative',
  },
  carouselImage: {
    width,
    height: 300,
  },
  pagination: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  paginationDotActive: {
    backgroundColor: colors.white,
    width: 24,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  saveButtonDetail: {
    position: 'absolute',
    top: 40,
    right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: spacing.sm,
  },
  content: {
    padding: spacing.lg,
  },
  headerSection: {
    marginBottom: spacing.xl,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: typography.sizes.sm,
    color: colors.success,
    fontWeight: typography.weights.semibold,
  },
  variant: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  specItem: {
    width: '31%',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  specLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  specValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginTop: 2,
  },
  description: {
    fontSize: typography.sizes.md,
    color: colors.text,
    lineHeight: 22,
  },
  featuresContainer: {
    gap: spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  dealerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dealerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dealerInfo: {
    flex: 1,
  },
  dealerName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: 4,
  },
  dealerLocation: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.textSecondary,
    gap: spacing.xs,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  actionText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
});