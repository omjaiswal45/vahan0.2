import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
  Platform,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 2;

interface ImageItem {
  id: string;
  uri: string;
  width?: number;
  height?: number;
}

const EnhancedImagePickerScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { carData } = route.params || {};

  const [images, setImages] = useState<ImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photos');
        return false;
      }
    }
    return true;
  };

  // Pick multiple images from gallery (up to 5 total)
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      Alert.alert('Maximum Images', 'You can only upload up to 5 images');
      return;
    }

    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages: ImageItem[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}-${index}`,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        }));
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images');
    } finally {
      setIsUploading(false);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    if (images.length >= 5) {
      Alert.alert('Maximum Images', 'You can only upload up to 5 images');
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera permission');
        return;
      }

      setIsUploading(true);
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newImage: ImageItem = {
          id: Date.now().toString(),
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        };
        setImages([...images, newImage]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsUploading(false);
    }
  };

  // Edit image with aspect ratio selection
  const editImage = async (image: ImageItem, action: 'rotate' | 'resize') => {
    try {
      setIsUploading(true);
      let manipulatedImage;

      switch (action) {
        case 'resize':
          // Resize to optimal size (1200px width)
          manipulatedImage = await ImageManipulator.manipulateAsync(
            image.uri,
            [{ resize: { width: 1200 } }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          Alert.alert('Resized!', 'Image has been resized to 1200px width');
          break;

        case 'rotate':
          // Rotate 90 degrees clockwise
          manipulatedImage = await ImageManipulator.manipulateAsync(
            image.uri,
            [{ rotate: 90 }],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          Alert.alert('Rotated!', 'Image has been rotated 90° clockwise');
          break;
      }

      // Update image in list
      setImages(
        images.map((img) =>
          img.id === image.id
            ? { ...img, uri: manipulatedImage.uri, width: manipulatedImage.width, height: manipulatedImage.height }
            : img
        )
      );
      setShowEditModal(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error editing image:', error);
      Alert.alert('Error', 'Failed to edit image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Crop image with aspect ratio
  const cropImage = async (image: ImageItem, aspectRatio: 'square' | '4:3' | '16:9' | 'original') => {
    try {
      setIsUploading(true);
      const imgWidth = image.width || 1000;
      const imgHeight = image.height || 1000;
      let cropConfig;

      switch (aspectRatio) {
        case 'square': // 1:1 - Perfect for car thumbnails
          const squareSize = Math.min(imgWidth, imgHeight);
          cropConfig = {
            originX: (imgWidth - squareSize) / 2,
            originY: (imgHeight - squareSize) / 2,
            width: squareSize,
            height: squareSize,
          };
          break;

        case '4:3': // Standard car photo ratio
          let crop43Width, crop43Height;
          if (imgWidth / imgHeight > 4 / 3) {
            crop43Height = imgHeight;
            crop43Width = crop43Height * (4 / 3);
          } else {
            crop43Width = imgWidth;
            crop43Height = crop43Width * (3 / 4);
          }
          cropConfig = {
            originX: (imgWidth - crop43Width) / 2,
            originY: (imgHeight - crop43Height) / 2,
            width: crop43Width,
            height: crop43Height,
          };
          break;

        case '16:9': // Widescreen - Good for car side views
          let crop169Width, crop169Height;
          if (imgWidth / imgHeight > 16 / 9) {
            crop169Height = imgHeight;
            crop169Width = crop169Height * (16 / 9);
          } else {
            crop169Width = imgWidth;
            crop169Height = crop169Width * (9 / 16);
          }
          cropConfig = {
            originX: (imgWidth - crop169Width) / 2,
            originY: (imgHeight - crop169Height) / 2,
            width: crop169Width,
            height: crop169Height,
          };
          break;

        case 'original':
          // No crop, just optimize
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            image.uri,
            [],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
          );
          setImages(
            images.map((img) =>
              img.id === image.id
                ? { ...img, uri: manipulatedImage.uri }
                : img
            )
          );
          setShowEditModal(false);
          setSelectedImage(null);
          setIsUploading(false);
          Alert.alert('Optimized!', 'Image has been optimized');
          return;
      }

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        image.uri,
        [{ crop: cropConfig }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImages(
        images.map((img) =>
          img.id === image.id
            ? { ...img, uri: manipulatedImage.uri, width: manipulatedImage.width, height: manipulatedImage.height }
            : img
        )
      );
      setShowEditModal(false);
      setSelectedImage(null);
      Alert.alert('Cropped!', `Image cropped to ${aspectRatio === 'square' ? '1:1' : aspectRatio} ratio`);
    } catch (error) {
      console.error('Error cropping image:', error);
      Alert.alert('Error', 'Failed to crop image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Remove image
  const removeImage = (id: string) => {
    Alert.alert('Remove Image', 'Are you sure you want to remove this image?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setImages(images.filter((img) => img.id !== id)),
      },
    ]);
  };

  // Open edit modal
  const openEditModal = (image: ImageItem) => {
    setSelectedImage(image);
    setShowEditModal(true);
  };

  // Move image to first position (make cover)
  const makeCover = (id: string) => {
    const imageIndex = images.findIndex((img) => img.id === id);
    if (imageIndex > 0) {
      const newImages = [...images];
      const [movedImage] = newImages.splice(imageIndex, 1);
      newImages.unshift(movedImage);
      setImages(newImages);
    }
  };

  // Navigate to review
  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Images Required', 'Please upload at least one image before continuing.');
      return;
    }

    const finalListingData = {
      ...carData,
      images: images.map((img) => img.uri),
      imageCount: images.length,
    };

    navigation.navigate('ReviewSubmit', { listingData: finalListingData });
  };

  // Render image item
  const renderImageItem = ({ item, index }: { item: ImageItem; index: number }) => (
    <View style={styles.imageItemContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => openEditModal(item)}
        style={styles.imageItemTouchable}
      >
        <Image source={{ uri: item.uri }} style={styles.imageItem} />

        {/* Cover Badge */}
        {index === 0 && (
          <View style={styles.coverBadge}>
            <Ionicons name="star" size={12} color="#fff" />
            <Text style={styles.coverText}>Cover</Text>
          </View>
        )}

        {/* Make Cover Button - Only show on non-cover images */}
        {index !== 0 && (
          <TouchableOpacity style={styles.makeCoverButton} onPress={() => makeCover(item.id)}>
            <Ionicons name="star-outline" size={16} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Edit Button */}
        <TouchableOpacity style={styles.editImageButton} onPress={() => openEditModal(item)}>
          <Ionicons name="create" size={16} color="#fff" />
        </TouchableOpacity>

        {/* Remove Button */}
        <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(item.id)}>
          <Ionicons name="close-circle" size={24} color="#ff3b30" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Fixed Header - Attached to top */}
        <LinearGradient colors={['#ff1ea5', '#cc1884']} style={styles.headerGradient}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerContent}>
              <View style={styles.headerIconContainer}>
                <Ionicons name="images" size={24} color="#fff" />
                {images.length > 0 && (
                  <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{images.length}</Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.headerTitle}>Upload Photos</Text>
                <Text style={styles.headerSubtitle}>{images.length}/5 images</Text>
              </View>
            </View>
          </SafeAreaView>
          {images.length > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${(images.length / 5) * 100}%` }]} />
            </View>
          )}
        </LinearGradient>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

            {/* Upload Buttons */}
            <View style={styles.uploadSection}>
              {/* Empty State / Upload Prompt */}
              {images.length === 0 && (
                <View style={styles.emptyStateCard}>
                  <View style={styles.emptyIconWrapper}>
                    <Ionicons name="cloud-upload-outline" size={64} color="#ff1ea5" />
                  </View>
                  <Text style={styles.emptyStateTitle}>No photos yet</Text>
                  <Text style={styles.emptyStateText}>
                    Upload photos to showcase your car listing
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={pickImage}
                disabled={isUploading || images.length >= 5}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={images.length >= 5 ? ['#d1d5db', '#d1d5db'] : ['#ff1ea5ff', '#ff1ea5dd']}
                  style={styles.uploadButtonGradient}
                >
                  <Ionicons name="images" size={28} color="#fff" />
                  <Text style={styles.uploadButtonText}>
                    {images.length >= 5 ? 'Maximum reached' : 'Choose from Gallery'}
                  </Text>
                  {images.length < 5 && (
                    <View style={styles.uploadBadge}>
                      <Text style={styles.uploadBadgeText}>{5 - images.length} left</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.uploadButton}
                onPress={takePhoto}
                disabled={isUploading || images.length >= 5}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.uploadButtonOutline,
                  (isUploading || images.length >= 5) && styles.uploadButtonDisabled
                ]}>
                  <Ionicons
                    name="camera"
                    size={28}
                    color={images.length >= 5 ? '#d1d5db' : '#ff1ea5ff'}
                  />
                  <Text style={[
                    styles.uploadButtonTextOutline,
                    images.length >= 5 && styles.uploadButtonTextDisabled
                  ]}>
                    {images.length >= 5 ? 'Maximum reached' : 'Take a Photo'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Image Counter */}
            <View style={styles.counterContainer}>
              <View
                style={[
                  styles.counterBadge,
                  images.length === 5 && styles.counterBadgeComplete,
                ]}
              >
                <Ionicons
                  name={images.length === 5 ? 'checkmark-circle' : 'images'}
                  size={20}
                  color={images.length === 5 ? '#10b981' : '#ff1ea5ff'}
                />
                <Text style={styles.counterText}>
                  {images.length} / 5 images {images.length === 5 && '(Maximum reached)'}
                </Text>
              </View>
            </View>

            {/* Images Grid */}
            {images.length > 0 && (
              <View style={styles.imagesSection}>
                <View style={styles.imagesSectionHeader}>
                  <Text style={styles.imagesSectionTitle}>Your Photos</Text>
                  <Text style={styles.imagesSectionSubtitle}>
                    Tap star icon to set as cover photo
                  </Text>
                </View>

                <FlatList
                  data={images}
                  renderItem={renderImageItem}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  scrollEnabled={false}
                  contentContainerStyle={styles.imagesList}
                />
              </View>
            )}

            {/* Tips Card */}
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={24} color="#f59e0b" />
                <Text style={styles.tipsTitle}>Photo Tips</Text>
              </View>
              <TipItem text="Use natural lighting for better quality" />
              <TipItem text="Capture multiple angles (front, side, interior)" />
              <TipItem text="Clean your vehicle before photographing" />
              <TipItem text="Avoid blurry or dark images" />
              <TipItem text="First image will be your cover photo" />
            </View>

            <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom Button */}
        <SafeAreaView edges={['bottom']} style={styles.bottomBarWrapper}>
            <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.nextButton, images.length === 0 && styles.nextButtonDisabled]}
              onPress={handleNext}
              disabled={images.length === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>Next: Review & Submit</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Loading Overlay */}
          {isUploading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingCard}>
                <ActivityIndicator size="large" color="#ff1ea5ff" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            </View>
          )}

          {/* Edit Modal */}
          <Modal
            visible={showEditModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEditModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Image</Text>

                {selectedImage && (
                  <Image source={{ uri: selectedImage.uri }} style={styles.modalImage} />
                )}

                {/* Crop Aspect Ratios */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionLabel}>Crop to Aspect Ratio</Text>
                  <View style={styles.cropOptions}>
                    <TouchableOpacity
                      style={styles.cropOption}
                      onPress={() => selectedImage && cropImage(selectedImage, 'square')}
                    >
                      <View style={styles.cropIconSquare} />
                      <Text style={styles.cropOptionText}>1:1</Text>
                      <Text style={styles.cropOptionSubtext}>Square</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cropOption}
                      onPress={() => selectedImage && cropImage(selectedImage, '4:3')}
                    >
                      <View style={styles.cropIcon43} />
                      <Text style={styles.cropOptionText}>4:3</Text>
                      <Text style={styles.cropOptionSubtext}>Standard</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cropOption}
                      onPress={() => selectedImage && cropImage(selectedImage, '16:9')}
                    >
                      <View style={styles.cropIcon169} />
                      <Text style={styles.cropOptionText}>16:9</Text>
                      <Text style={styles.cropOptionSubtext}>Wide</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cropOption}
                      onPress={() => selectedImage && cropImage(selectedImage, 'original')}
                    >
                      <Ionicons name="image" size={28} color="#666" />
                      <Text style={styles.cropOptionText}>Original</Text>
                      <Text style={styles.cropOptionSubtext}>No crop</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Other Edit Options */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionLabel}>Quick Edits</Text>
                  <View style={styles.editOptions}>
                    <TouchableOpacity
                      style={styles.editOption}
                      onPress={() => selectedImage && editImage(selectedImage, 'rotate')}
                    >
                      <Ionicons name="sync" size={24} color="#ff1ea5ff" />
                      <Text style={styles.editOptionText}>Rotate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.editOption}
                      onPress={() => selectedImage && editImage(selectedImage, 'resize')}
                    >
                      <Ionicons name="resize" size={24} color="#ff1ea5ff" />
                      <Text style={styles.editOptionText}>Optimize</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => {
                    setShowEditModal(false);
                    setSelectedImage(null);
                  }}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
      </Animated.View>
    </View>
  );
};

// Tip Item Component
const TipItem: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.tipItem}>
    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
    <Text style={styles.tipText}>{text}</Text>
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
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10b981',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.85,
  },
  uploadSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  emptyStateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#ffe8f5',
    borderStyle: 'dashed',
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff0f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  uploadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  uploadBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  uploadButtonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ff1ea5ff',
    borderRadius: 16,
    gap: 12,
  },
  uploadButtonDisabled: {
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  uploadButtonTextOutline: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ff1ea5ff',
  },
  uploadButtonTextDisabled: {
    color: '#d1d5db',
  },
  counterContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  counterBadgeComplete: {
    backgroundColor: '#ecfdf5',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  imagesSection: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  imagesSectionHeader: {
    marginBottom: 16,
  },
  imagesSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  imagesSectionSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  imagesList: {
    gap: 12,
  },
  imageItemContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: 12,
    marginBottom: 12,
  },
  imageItemTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  imageItem: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  coverBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff1ea5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  coverText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  makeCoverButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  dragHandle: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tipsCard: {
    margin: 16,
    backgroundColor: '#fffbf5',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    flex: 1,
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
  nextButton: {
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
  nextButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  nextButtonText: {
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
  },
  editOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  editOption: {
    alignItems: 'center',
    gap: 8,
  },
  editOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  modalCloseButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  cropOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cropOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    flex: 1,
    marginHorizontal: 4,
  },
  cropIconSquare: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: '#ff1ea5ff',
    borderRadius: 4,
    marginBottom: 8,
  },
  cropIcon43: {
    width: 48,
    height: 36,
    borderWidth: 2,
    borderColor: '#ff1ea5ff',
    borderRadius: 4,
    marginBottom: 8,
  },
  cropIcon169: {
    width: 56,
    height: 32,
    borderWidth: 2,
    borderColor: '#ff1ea5ff',
    borderRadius: 4,
    marginBottom: 8,
  },
  cropOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  cropOptionSubtext: {
    fontSize: 11,
    color: '#666',
  },
});

export default EnhancedImagePickerScreen;
