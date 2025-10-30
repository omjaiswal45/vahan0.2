// AvatarUploader.tsx
import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../../../styles';

type Props = {
  imageUri?: string | null;
  onImagePicked: (file: { uri: string; name: string; type: string }) => void;
  size?: number;
};

const AvatarUploader: React.FC<Props> = ({ imageUri, onImagePicked, size = 120 }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(imageUri || null);
  const [loading, setLoading] = useState(false);

  /**
   * Request camera and media library permissions
   */
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus.status !== 'granted' || mediaStatus.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable camera and photo library access in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
        return false;
      }
    }
    return true;
  };

  /**
   * Fix image orientation and mirror issues
   * 
   * WHY THIS HAPPENS:
   * - Front cameras capture images as mirror images by default
   * - iOS and Android have different EXIF orientation handling
   * - Some devices auto-rotate based on EXIF data, others don't
   * 
   * THE FIX:
   * - We manually process the image to correct orientation
   * - For front camera selfies, we flip horizontally to show the non-mirrored view
   * - We remove EXIF data to prevent double-rotation issues
   */
  const processImage = async (uri: string, isFrontCamera: boolean = true) => {
    try {
      setLoading(true);

      // Step 1: Fix orientation and optionally flip for front camera
      const manipulatorActions: any[] = [];

      // If it's a selfie from front camera, flip it to show normal (non-mirror) view
      if (isFrontCamera) {
        manipulatorActions.push({ flip: ImageManipulator.FlipType.Horizontal });
      }

      // Resize to optimize file size (keeping aspect ratio)
      manipulatorActions.push({
        resize: {
          width: 800, // Reasonable size for profile photos
        },
      });

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        manipulatorActions,
        {
          compress: 0.8, // Good balance between quality and file size
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return manipulatedImage.uri;
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Show options to pick image from camera or gallery
   */
  const showImagePickerOptions = () => {
    Alert.alert(
      'Choose Photo',
      'Select where you want to pick your photo from',
      [
        {
          text: 'Take Photo',
          onPress: () => pickImageFromCamera(),
        },
        {
          text: 'Choose from Gallery',
          onPress: () => pickImageFromGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Pick image from camera (selfie mode)
   */
  const pickImageFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square crop for profile photos
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front, // Default to front camera for selfies
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Process the image to fix rotation and mirror issues
        const processedUri = await processImage(asset.uri, true);
        
        setCurrentImage(processedUri);
        
        // Prepare file data for upload
        const fileName = `avatar_${Date.now()}.jpg`;
        onImagePicked({
          uri: processedUri,
          name: fileName,
          type: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Error picking image from camera:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  /**
   * Pick image from gallery
   */
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square crop for profile photos
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        
        // Process the image (gallery photos usually don't need flipping)
        const processedUri = await processImage(asset.uri, false);
        
        setCurrentImage(processedUri);
        
        // Prepare file data for upload
        const fileName = `avatar_${Date.now()}.jpg`;
        onImagePicked({
          uri: processedUri,
          name: fileName,
          type: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.avatarContainer, { width: size, height: size }]}
        onPress={showImagePickerOptions}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <View style={[styles.avatar, styles.loadingContainer, { width: size, height: size }]}>
            <ActivityIndicator size="large" color={Colors.primary || '#007AFF'} />
          </View>
        ) : currentImage ? (
          <Image
            source={{ uri: currentImage }}
            style={[styles.avatar, { width: size, height: size }]}
          />
        ) : (
          <View style={[styles.avatar, styles.placeholderContainer, { width: size, height: size }]}>
            <Ionicons
              name="person"
              size={size * 0.5}
              color={Colors.textSecondary || '#999999'}
            />
          </View>
        )}

        {/* Edit Badge */}
        <View style={styles.editBadge}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    borderRadius: 999, // Fully circular
    backgroundColor: Colors.background || '#F3F4F6',
    borderWidth: 3,
    borderColor: Colors.border || '#E5E7EB',
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background || '#F3F4F6',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background || '#F3F4F6',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary || '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background || '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AvatarUploader;