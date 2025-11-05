import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, Alert, StyleSheet, Image, Animated, Platform, Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchprofile } from '../../../store/slices/dealerSlice';
import { updateprofile } from '../services/dealerAPI';
import { RootState, AppDispatch } from '../../../store/store';
import { colors } from '../../../styles/colors';

const DealerprofileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.dealer);

  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showImageOptions, setShowImageOptions] = useState(false);

  const [form, setForm] = useState({
    name: '', contact: '', email: '', address: '',
    dealership: '', dealerType: '', yearsInBusiness: '',
    website: '', instagram: '', facebook: '', linkedin: '',
    preferredVehicle: '', minPrice: '', maxPrice: '', locationAreas: '',
    licenseNumber: '', gstNumber: '',
  });

  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchprofile());
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [dispatch]);

  useEffect(() => {
    if (profile) setForm({ ...form, ...profile });
    if (profile?.avatar) setAvatar(profile.avatar);
  }, [profile]);

  const requestPermissions = async (type: 'camera' | 'library') => {
    if (Platform.OS !== 'web') {
      if (type === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Camera permission is required.');
          return false;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Gallery permission is required.');
          return false;
        }
      }
    }
    return true;
  };

  const pickImageFromCamera = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const pickImageFromGallery = async () => {
    setShowImageOptions(false);
    const hasPermission = await requestPermissions('library');
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      await updateprofile({ ...form, avatar });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const renderInput = (label: string, key: string, placeholder?: string, multiline = false, icon?: string) => (
    <View style={styles.inputCard}>
      <View style={styles.inputHeader}>
        {icon && <Ionicons name={icon as any} size={20} color={colors.primary} style={styles.inputIcon} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        value={(form as any)[key]}
        onChangeText={text => setForm({ ...form, [key]: text })}
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }]}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor={colors.gray[400]}
        multiline={multiline}
      />
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={() => setShowImageOptions(true)}
              activeOpacity={0.8}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholderContainer}>
                  <Ionicons name="person" size={40} color={colors.primary} />
                </View>
              )}
              <View style={styles.cameraIconWrapper}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.cameraIcon}
                >
                  <Ionicons name="camera" size={18} color={colors.white} />
                </LinearGradient>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change profile photo</Text>
          </View>

          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {renderInput('Full Name', 'name', 'John Doe', false, 'person-outline')}
            {renderInput('Contact Number', 'contact', '+91 98765 43210', false, 'call-outline')}
            {renderInput('Email Address', 'email', 'dealer@example.com', false, 'mail-outline')}
            {renderInput('Address', 'address', 'Enter your complete address', true, 'location-outline')}
          </View>

          {/* Save Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', marginTop: 8 }}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <Ionicons name="checkmark-circle" size={24} color={colors.white} />
                <Text style={styles.saveText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Animated.View>

      {/* Image Picker Modal */}
      <Modal
        visible={showImageOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageOptions(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Photo</Text>
            <Text style={styles.modalSubtitle}>Select an option to upload your profile picture</Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickImageFromCamera}
              activeOpacity={0.7}
            >
              <View style={styles.modalIconWrapper}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.modalIconGradient}
                >
                  <Ionicons name="camera" size={28} color={colors.white} />
                </LinearGradient>
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Take Photo</Text>
                <Text style={styles.modalOptionSubtitle}>Use camera to capture</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={pickImageFromGallery}
              activeOpacity={0.7}
            >
              <View style={styles.modalIconWrapper}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.modalIconGradient}
                >
                  <Ionicons name="images" size={28} color={colors.white} />
                </LinearGradient>
              </View>
              <View style={styles.modalOptionText}>
                <Text style={styles.modalOptionTitle}>Choose from Gallery</Text>
                <Text style={styles.modalOptionSubtitle}>Select from your photos</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowImageOptions(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 4,
    borderColor: colors.white,
    position: 'relative',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarPlaceholderContainer: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.pink[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.white,
  },
  cameraIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarHint: {
    marginTop: 12,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  inputCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.gray[50],
  },
  saveButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  saveText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalIconWrapper: {
    marginRight: 16,
  },
  modalIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionText: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  modalOptionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  modalCancelButton: {
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCancelText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
});

export default DealerprofileScreen;
