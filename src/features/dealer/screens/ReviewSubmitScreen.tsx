import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ReviewSubmitScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { listingData } = route.params || {};

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare final submission data
      const finalData = {
        ...listingData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      // TODO: Replace with actual API call
      // await submitListing(finalData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('✅ Final Listing Submitted:', finalData);

      setIsSubmitting(false);

      // Success alert with navigation
      Alert.alert(
        '🎉 Success!',
        'Your car listing is under review! We will notify you once it\'s approved.',
        [
          {
            text: 'View Listings',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'ListingsHome' }],
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('❌ Submission Error:', error);
      setIsSubmitting(false);
      Alert.alert(
        'Submission Failed',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleEditDetails = () => {
    navigation.goBack();
    navigation.goBack(); // Go back twice to reach AddListing
  };

  const handleEditImages = () => {
    navigation.goBack();
  };

  if (!listingData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ff3b30" />
        <Text style={styles.errorText}>No listing data found</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header - Attached to top */}
      <LinearGradient colors={['#ff1ea5', '#cc1884']} style={styles.headerGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Review Your Listing</Text>
              <Text style={styles.headerSubtitle}>Check everything before submitting</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Images Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📸 Photos ({listingData.imageCount})</Text>
            <TouchableOpacity onPress={handleEditImages} style={styles.editButton}>
              <Ionicons name="create" size={16} color="#ff1ea5" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {listingData.images?.map((imageUri: string, index: number) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                {index === 0 && (
                  <View style={styles.coverBadge}>
                    <Text style={styles.coverBadgeText}>Cover</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Vehicle Details Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚗 Vehicle Details</Text>
            <TouchableOpacity onPress={handleEditDetails} style={styles.editButton}>
              <Ionicons name="create" size={16} color="#ff1ea5" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailsCard}>
            {listingData.registration && (
              <DetailRow icon="document-text" label="Registration" value={listingData.registration} />
            )}
            <DetailRow icon="car" label="Brand" value={listingData.brand} />
            <DetailRow icon="car-sport" label="Model" value={listingData.model} />
            <DetailRow icon="calendar" label="Year" value={listingData.year} />
            <DetailRow icon="flame" label="Fuel" value={listingData.fuel} />
            <DetailRow icon="speedometer" label="Kilometers" value={listingData.km} />
            {listingData.owner && <DetailRow icon="person" label="Owner" value={listingData.owner} />}
            {listingData.transmission && (
              <DetailRow icon="settings" label="Transmission" value={listingData.transmission} />
            )}
            <DetailRow icon="cash" label="Price" value={listingData.price} />
            {listingData.location && (
              <DetailRow icon="location" label="Location" value={listingData.location} />
            )}
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <Ionicons name="information-circle" size={24} color="#3b82f6" />
            <Text style={styles.noteTitle}>Important</Text>
          </View>
          <Text style={styles.noteText}>
            Your listing will be reviewed by our team within 24-48 hours. You'll receive a
            notification once it's approved and live on the platform.
          </Text>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Submit Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBarWrapper}>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator color="#fff" size="small" style={{ marginRight: 8 }} />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit for Review</Text>
                <Text style={styles.arrow}>→</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: '#ff1ea5',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerGradient: {
    paddingBottom: 16,
  },
  headerContent: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff1f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff1ea5',
  },
  imageScroll: {
    marginLeft: -16,
    paddingLeft: 16,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.45,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  coverBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#ff1ea5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  coverBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
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
    gap: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  noteCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  bottomBarWrapper: {
    backgroundColor: 'transparent',
  },
  bottomBar: {
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff1ea5',
    shadowColor: '#ff1ea5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  arrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
});

export default ReviewSubmitScreen;
