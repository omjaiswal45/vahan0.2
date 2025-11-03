import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
}

const EditListingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { listing } = route.params || {};

  // Form states
  const [registration, setRegistration] = useState(listing?.registration || '');
  const [brand, setBrand] = useState(listing?.brand || listing?.make || '');
  const [model, setModel] = useState(listing?.model || '');
  const [year, setYear] = useState(listing?.year?.toString() || '');
  const [fuel, setFuel] = useState(listing?.fuel || '');
  const [km, setKm] = useState(listing?.km || '');
  const [owner, setOwner] = useState(listing?.owner || '');
  const [transmission, setTransmission] = useState(listing?.transmission || '');
  const [price, setPrice] = useState(listing?.price || '');
  const [city, setCity] = useState(listing?.city || listing?.location || '');
  const [description, setDescription] = useState(listing?.description || '');

  const [isSaving, setIsSaving] = useState(false);

  // Fuel type options
  const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
  const transmissionTypes = ['Manual', 'Automatic'];
  const ownerOptions = ['1st', '2nd', '3rd', '4th', '5+'];

  const handleSave = async () => {
    // Validation
    if (!brand.trim()) {
      Alert.alert('Validation Error', 'Please enter the brand name');
      return;
    }
    if (!model.trim()) {
      Alert.alert('Validation Error', 'Please enter the model name');
      return;
    }
    if (!year.trim() || isNaN(Number(year))) {
      Alert.alert('Validation Error', 'Please enter a valid year');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Validation Error', 'Please enter the price');
      return;
    }

    try {
      setIsSaving(true);

      // TODO: Replace with actual API call
      // await updateListing(listing.id, updatedData);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedListing = {
        ...listing,
        registration,
        brand,
        model,
        year: Number(year),
        fuel,
        km,
        owner,
        transmission,
        price,
        city,
        location: city,
        description,
        make: brand,
      };

      Alert.alert('Success', 'Listing updated successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to detail screen with updated data
            navigation.navigate('ListingDetail', {
              id: listing.id,
              listing: updatedListing,
            });
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating listing:', error);
      Alert.alert('Error', 'Failed to update listing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Discard Changes?', 'Are you sure you want to discard your changes?', [
      { text: 'Keep Editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Info */}
          <View style={styles.headerCard}>
            <Ionicons name="create" size={32} color="#ff1ea5ff" />
            <Text style={styles.headerTitle}>Edit Your Listing</Text>
            <Text style={styles.headerSubtitle}>Update any field to modify your listing</Text>
          </View>

          {/* Vehicle Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vehicle Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Registration Number</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="document-text" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={registration}
                  onChangeText={setRegistration}
                  placeholder="e.g., MH12AB1234"
                  placeholderTextColor="#999"
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Brand <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="car" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="e.g., Maruti Suzuki"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Model <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="car-sport" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={model}
                  onChangeText={setModel}
                  placeholder="e.g., Swift VXI"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Year <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="calendar" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={year}
                  onChangeText={setYear}
                  placeholder="e.g., 2020"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fuel Type</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipContainer}>
                  {fuelTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.chip, fuel === type && styles.chipSelected]}
                      onPress={() => setFuel(type)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.chipText, fuel === type && styles.chipTextSelected]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kilometers Driven</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="speedometer" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={km}
                  onChangeText={setKm}
                  placeholder="e.g., 25,000 km"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Owner</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipContainer}>
                  {ownerOptions.map((ownerType) => (
                    <TouchableOpacity
                      key={ownerType}
                      style={[styles.chip, owner === ownerType && styles.chipSelected]}
                      onPress={() => setOwner(ownerType)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.chipText, owner === ownerType && styles.chipTextSelected]}
                      >
                        {ownerType}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Transmission</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.chipContainer}>
                  {transmissionTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.chip, transmission === type && styles.chipSelected]}
                      onPress={() => setTransmission(type)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[styles.chipText, transmission === type && styles.chipTextSelected]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {/* Pricing & Location Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing & Location</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Price <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputContainer}>
                <Ionicons name="cash" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="e.g., ₹5,50,000"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>City</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="e.g., Mumbai"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>

          {/* Additional Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add any additional details about the car..."
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <Text style={styles.actionButtonText}>Saving...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancel}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <Ionicons name="close-circle" size={20} color="#ff3b30" />
              <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  required: {
    color: '#ff3b30',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 14,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: '#ff1ea5ff',
    borderColor: '#ff1ea5ff',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  chipTextSelected: {
    color: '#fff',
  },
  actionSection: {
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
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
  saveButton: {
    backgroundColor: '#ff1ea5ff',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff3b30',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#ff3b30',
  },
});

export default EditListingScreen;
