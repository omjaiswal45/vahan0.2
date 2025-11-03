import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import ListingCarousel from '../components/ListingCarousel';

const { width } = Dimensions.get('window');

interface CarListing {
  id: string;
  registration?: string;
  brand?: string;
  model?: string;
  year: number;
  fuel: string;
  km: string;
  owner?: string;
  transmission?: string;
  price: string;
  location?: string;
  city: string;
  images: string[];
  make: string;
  title: string;
  description?: string;
  createdAt?: string;
}

const ListingDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { id, listing: passedListing } = route.params || {};

  const [listing, setListing] = useState<CarListing | null>(passedListing || null);
  const [loading, setLoading] = useState(!passedListing);

  useEffect(() => {
    if (!passedListing && id) {
      // Fetch listing by ID from API
      fetchListingById(id);
    }
  }, [id, passedListing]);

  const fetchListingById = async (listingId: string) => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await getListingById(listingId);
      // setListing(response.data);

      // Mock data for now
      setTimeout(() => {
        setListing(passedListing);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load listing details');
    }
  };

  const handleEdit = () => {
    // Navigate to edit screen with listing data
    navigation.navigate('EditListing', { listing });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete API call
            console.log('Delete listing:', id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share Listing', 'Share functionality will be implemented here');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff1ea5ff" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
        <Text style={styles.errorText}>Listing not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ListingCarousel images={listing.images} autoplay={false} fullScreen={true} />

          {/* Year Badge */}
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{listing.year}</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Title & Price Section */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {listing.brand || listing.make} {listing.model}
              </Text>
              <View style={styles.locationBadge}>
                <Ionicons name="location" size={14} color="#ff1ea5ff" />
                <Text style={styles.locationText}>{listing.city || listing.location}</Text>
              </View>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{listing.price}</Text>
              <Text style={styles.priceLabel}>Best Price</Text>
            </View>
          </View>

          {/* Quick Specs Grid */}
          <View style={styles.specsGrid}>
            <View style={styles.specCard}>
              <Ionicons name="speedometer" size={24} color="#ff1ea5ff" />
              <Text style={styles.specValue}>{listing.km}</Text>
              <Text style={styles.specLabel}>Driven</Text>
            </View>
            <View style={styles.specCard}>
              <Ionicons name="flame" size={24} color="#ff1ea5ff" />
              <Text style={styles.specValue}>{listing.fuel}</Text>
              <Text style={styles.specLabel}>Fuel</Text>
            </View>
            <View style={styles.specCard}>
              <Ionicons name="hand-left" size={24} color="#ff1ea5ff" />
              <Text style={styles.specValue}>{listing.owner || '1st'}</Text>
              <Text style={styles.specLabel}>Owner</Text>
            </View>
            <View style={styles.specCard}>
              <Ionicons name="settings" size={24} color="#ff1ea5ff" />
              <Text style={styles.specValue}>{listing.transmission || 'Manual'}</Text>
              <Text style={styles.specLabel}>Transmission</Text>
            </View>
          </View>

          {/* Vehicle Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Details</Text>
            <View style={styles.detailsCard}>
              {listing.registration && (
                <DetailRow
                  icon="document-text"
                  label="Registration"
                  value={listing.registration}
                />
              )}
              <DetailRow icon="car" label="Brand" value={listing.brand || listing.make || 'N/A'} />
              <DetailRow icon="car-sport" label="Model" value={listing.model} />
              <DetailRow icon="calendar" label="Year" value={listing.year.toString()} />
              <DetailRow icon="flame" label="Fuel Type" value={listing.fuel} />
              <DetailRow icon="speedometer" label="Kilometers" value={listing.km} />
              {listing.owner && (
                <DetailRow icon="person" label="Owner" value={`${listing.owner} Owner`} />
              )}
              {listing.transmission && (
                <DetailRow icon="settings" label="Transmission" value={listing.transmission} />
              )}
              {listing.location && (
                <DetailRow icon="location" label="Location" value={listing.location} />
              )}
            </View>
          </View>

          {/* Description Section */}
          {listing.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionText}>{listing.description}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Edit Listing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.shareButton]}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social" size={20} color="#ff1ea5ff" />
              <Text style={[styles.actionButtonText, styles.shareButtonText]}>Share</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons name="trash" size={20} color="#ff3b30" />
            <Text style={styles.deleteButtonText}>Delete Listing</Text>
          </TouchableOpacity>

          {/* Listing Info Footer */}
          {listing.createdAt && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Listed on {new Date(listing.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Detail Row Component
interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLeft}>
      <Ionicons name={icon as any} size={20} color="#666" />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#ff1ea5ff',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  carouselContainer: {
    position: 'relative',
    backgroundColor: '#000',
    width: '100%',
  },
  yearBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  yearText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  locationText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#ff1ea5ff',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ff1ea5ff',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  specCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 8,
  },
  specLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
    marginLeft: 12,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  descriptionText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24,
  },
  actionSection: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#ff1ea5ff',
  },
  shareButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff1ea5ff',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
  shareButtonText: {
    color: '#ff1ea5ff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff3b30',
    marginLeft: 8,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#999',
  },
});

export default ListingDetailScreen;
