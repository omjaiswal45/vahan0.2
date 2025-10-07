import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Modal,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MIN_CROP_SIZE = 100;
const MODAL_IMAGE_HEIGHT = SCREEN_HEIGHT * 0.7;

interface ImagePickerCardProps {
  images: string[];
  setImages: (val: string[]) => void;
  onComplete?: () => void;
  maxImages?: number;
}

export default function ImagePickerCard({
  images,
  setImages,
  onComplete,
  maxImages = 5,
}: ImagePickerCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [cropMode, setCropMode] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [displayedImageBounds, setDisplayedImageBounds] = useState({ 
    width: 0, 
    height: 0, 
    offsetX: 0, 
    offsetY: 0 
  });

  // Crop state - these store the ACTUAL numeric values
  const cropState = useRef({
    x: 0,
    y: 0,
    width: 300,
    height: 300,
    rotation: 0,
  }).current;

  // Animated values
  const pan = useRef(new Animated.ValueXY()).current;
  const cropWidth = useRef(new Animated.Value(300)).current;
  const cropHeight = useRef(new Animated.Value(300)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const draggedItemPosition = useRef(new Animated.ValueXY()).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Sync animated values with crop state
  const updateCropState = (updates: Partial<typeof cropState>) => {
    Object.assign(cropState, updates);
    if (updates.x !== undefined) pan.x.setValue(updates.x);
    if (updates.y !== undefined) pan.y.setValue(updates.y);
    if (updates.width !== undefined) cropWidth.setValue(updates.width);
    if (updates.height !== undefined) cropHeight.setValue(updates.height);
    if (updates.rotation !== undefined) rotation.setValue(updates.rotation);
  };

  /**
   * Pick images from library
   */
  const pickImage = async () => {
    try {
      setIsLoading(true);
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library.",
          [{ text: "OK" }]
        );
        return;
      }

      const remainingSlots = maxImages - images.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: remainingSlots,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        const newImages = [...images, ...selectedImages].slice(0, maxImages);
        setImages(newImages);
      }
    } catch (err) {
      console.error("ImagePicker Error:", err);
      Alert.alert("Upload Failed", "Unable to upload images. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Open image in modal and calculate display bounds
   */
  const openImageModal = (uri: string, index: number) => {
    setSelectedImage(uri);
    setSelectedImageIndex(index);
    setCropMode(false);

    Image.getSize(
      uri,
      (width, height) => {
        setImageDimensions({ width, height });

        // Calculate how the image will be displayed with resizeMode="contain"
        const imageAspect = width / height;
        const containerAspect = SCREEN_WIDTH / MODAL_IMAGE_HEIGHT;

        let displayWidth, displayHeight, offsetX, offsetY;

        if (imageAspect > containerAspect) {
          // Image is wider - constrained by width
          displayWidth = SCREEN_WIDTH;
          displayHeight = SCREEN_WIDTH / imageAspect;
          offsetX = 0;
          offsetY = (MODAL_IMAGE_HEIGHT - displayHeight) / 2;
        } else {
          // Image is taller - constrained by height
          displayHeight = MODAL_IMAGE_HEIGHT;
          displayWidth = MODAL_IMAGE_HEIGHT * imageAspect;
          offsetY = 0;
          offsetX = (SCREEN_WIDTH - displayWidth) / 2;
        }

        setDisplayedImageBounds({ width: displayWidth, height: displayHeight, offsetX, offsetY });

        // Initialize crop box in center
        const cropSize = Math.min(displayWidth, displayHeight) * 0.8;
        const initialX = offsetX + (displayWidth - cropSize) / 2;
        const initialY = offsetY + (displayHeight - cropSize) / 2;

        updateCropState({
          x: initialX,
          y: initialY,
          width: cropSize,
          height: cropSize,
          rotation: 0,
        });
      },
      (error) => {
        console.error("Failed to get image size:", error);
        Alert.alert("Error", "Failed to load image dimensions");
      }
    );
  };

  /**
   * Close modal
   */
  const closeImageModal = () => {
    setSelectedImage(null);
    setSelectedImageIndex(null);
    setCropMode(false);
    updateCropState({ rotation: 0 });
  };

  /**
   * Apply crop with proper coordinate transformation
   */
  const cropImage = async () => {
    if (!selectedImage) return;

    if (!cropMode) {
      setCropMode(true);
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Rotate image if needed
      const angle = Math.round(cropState.rotation) % 360;
      let workingUri = selectedImage;
      let currentWidth = imageDimensions.width;
      let currentHeight = imageDimensions.height;

      if (angle !== 0) {
        const rotateResult = await ImageManipulator.manipulateAsync(
          selectedImage,
          [{ rotate: angle }],
          { compress: 1, format: ImageManipulator.SaveFormat.PNG }
        );
        workingUri = rotateResult.uri;

        // After rotation, dimensions may swap
        if (Math.abs(angle) === 90 || Math.abs(angle) === 270) {
          [currentWidth, currentHeight] = [currentHeight, currentWidth];
        }
      }

      // Step 2: Calculate crop coordinates
      // Scale from display coordinates to actual image coordinates
      const scaleX = currentWidth / displayedImageBounds.width;
      const scaleY = currentHeight / displayedImageBounds.height;

      // Adjust crop box position relative to displayed image bounds
      const relativeX = cropState.x - displayedImageBounds.offsetX;
      const relativeY = cropState.y - displayedImageBounds.offsetY;

      // Convert to image pixels
      const originX = Math.max(0, Math.round(relativeX * scaleX));
      const originY = Math.max(0, Math.round(relativeY * scaleY));
      const cropWidthPx = Math.round(cropState.width * scaleX);
      const cropHeightPx = Math.round(cropState.height * scaleY);

      // Clamp to image bounds
      const finalWidth = Math.min(currentWidth - originX, cropWidthPx);
      const finalHeight = Math.min(currentHeight - originY, cropHeightPx);

      // Step 3: Perform crop
      const cropResult = await ImageManipulator.manipulateAsync(
        workingUri,
        [
          {
            crop: {
              originX,
              originY,
              width: finalWidth,
              height: finalHeight,
            },
          },
          { resize: { width: 1000 } }, // Resize for optimization
        ],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Update images array
      const newImages = [...images];
      if (selectedImageIndex !== null) {
        newImages[selectedImageIndex] = cropResult.uri;
        setImages(newImages);
      }

      Alert.alert("Success", "Image cropped successfully!");
      closeImageModal();
    } catch (error) {
      console.error("Crop error:", error);
      Alert.alert("Error", "Failed to crop image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove image
   */
  const removeImage = (uri: string, index: number) => {
    Alert.alert(
      "Remove Image",
      `Remove ${index === 0 ? "cover " : ""}image?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => setImages(images.filter((img) => img !== uri)),
        },
      ]
    );
  };

  const removeImageFromModal = () => {
    if (selectedImageIndex === null) return;
    Alert.alert(
      "Remove Image",
      `Remove ${selectedImageIndex === 0 ? "cover " : ""}image?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newImages = images.filter((_, idx) => idx !== selectedImageIndex);
            setImages(newImages);
            closeImageModal();
          },
        },
      ]
    );
  };

  /**
   * Drag to reorder - Thumbnail PanResponder
   */
  const createPanResponder = (index: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDraggingIndex(index);
        draggedItemPosition.setOffset({
          x: (draggedItemPosition.x as any)._value,
          y: (draggedItemPosition.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: draggedItemPosition.x, dy: draggedItemPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        draggedItemPosition.flattenOffset();
        const movedDistance = gesture.dx;
        const threshold = 60;

        if (Math.abs(movedDistance) > threshold) {
          const direction = movedDistance > 0 ? 1 : -1;
          const newIndex = index + direction;

          if (newIndex >= 0 && newIndex < images.length) {
            const newImages = [...images];
            [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
            setImages(newImages);
          }
        }

        Animated.spring(draggedItemPosition, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        setDraggingIndex(null);
      },
    });
  };

  /**
   * Crop Box Move PanResponder
   */
  const cropMoveResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: cropState.x,
          y: cropState.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        
        // Update state with clamping
        const newX = Math.max(
          displayedImageBounds.offsetX,
          Math.min(
            displayedImageBounds.offsetX + displayedImageBounds.width - cropState.width,
            (pan.x as any)._value
          )
        );
        const newY = Math.max(
          displayedImageBounds.offsetY,
          Math.min(
            displayedImageBounds.offsetY + displayedImageBounds.height - cropState.height,
            (pan.y as any)._value
          )
        );

        updateCropState({ x: newX, y: newY });
      },
    })
  ).current;

  /**
   * Crop Box Resize PanResponders
   */
  const createResizeResponder = (corner: "tl" | "tr" | "bl" | "br") => {
    let initialState = { x: 0, y: 0, width: 0, height: 0 };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        initialState = { ...cropState };
      },
      onPanResponderMove: (_, gesture) => {
        let newX = initialState.x;
        let newY = initialState.y;
        let newWidth = initialState.width;
        let newHeight = initialState.height;

        switch (corner) {
          case "br":
            newWidth = Math.max(MIN_CROP_SIZE, initialState.width + gesture.dx);
            newHeight = Math.max(MIN_CROP_SIZE, initialState.height + gesture.dy);
            break;
          case "bl":
            newWidth = Math.max(MIN_CROP_SIZE, initialState.width - gesture.dx);
            newHeight = Math.max(MIN_CROP_SIZE, initialState.height + gesture.dy);
            newX = initialState.x + (initialState.width - newWidth);
            break;
          case "tr":
            newWidth = Math.max(MIN_CROP_SIZE, initialState.width + gesture.dx);
            newHeight = Math.max(MIN_CROP_SIZE, initialState.height - gesture.dy);
            newY = initialState.y + (initialState.height - newHeight);
            break;
          case "tl":
            newWidth = Math.max(MIN_CROP_SIZE, initialState.width - gesture.dx);
            newHeight = Math.max(MIN_CROP_SIZE, initialState.height - gesture.dy);
            newX = initialState.x + (initialState.width - newWidth);
            newY = initialState.y + (initialState.height - newHeight);
            break;
        }

        // Clamp to image bounds
        const minX = displayedImageBounds.offsetX;
        const minY = displayedImageBounds.offsetY;
        const maxX = displayedImageBounds.offsetX + displayedImageBounds.width;
        const maxY = displayedImageBounds.offsetY + displayedImageBounds.height;

        newX = Math.max(minX, Math.min(newX, maxX - MIN_CROP_SIZE));
        newY = Math.max(minY, Math.min(newY, maxY - MIN_CROP_SIZE));
        newWidth = Math.min(newWidth, maxX - newX);
        newHeight = Math.min(newHeight, maxY - newY);

        updateCropState({ x: newX, y: newY, width: newWidth, height: newHeight });
      },
      onPanResponderRelease: () => {},
    });
  };

  const resizeTL = useRef(createResizeResponder("tl")).current;
  const resizeTR = useRef(createResizeResponder("tr")).current;
  const resizeBL = useRef(createResizeResponder("bl")).current;
  const resizeBR = useRef(createResizeResponder("br")).current;

  /**
   * Rotation PanResponder
   */
  const rotateResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const sensitivity = 0.3;
        const newRotation = cropState.rotation + gesture.dx * sensitivity;
        updateCropState({ rotation: newRotation });
      },
      onPanResponderRelease: () => {
        // Snap to 90 degree increments if close
        const currentRotation = cropState.rotation % 360;
        const snapPoints = [0, 90, 180, 270, 360];
        const threshold = 10;

        for (const snap of snapPoints) {
          if (Math.abs(currentRotation - snap) < threshold) {
            updateCropState({ rotation: snap });
            break;
          }
        }
      },
    })
  ).current;

  /**
   * Empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="images-outline" size={56} color="#d1d5db" />
      </View>
      <Text style={styles.emptyStateText}>No images uploaded yet</Text>
      <Text style={styles.emptyStateSubtext}>Add photos to showcase your listing</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Upload Images</Text>
          <Text style={styles.subtitle}>
            {images.length === 0
              ? `Add up to ${maxImages} images`
              : `${images.length} of ${maxImages} images`}
          </Text>
        </View>
        {images.length > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {Math.round((images.length / maxImages) * 100)}%
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(images.length / maxImages) * 100}%` },
                ]}
              />
            </View>
          </View>
        )}
      </View>

      {/* Images */}
      {images.length > 0 ? (
        <>
          <Text style={styles.dragHint}>
            <Ionicons name="hand-left-outline" size={14} color="#6b7280" /> Long press
            and drag to reorder
          </Text>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.imageScrollContent}
          >
            {images.map((uri, index) => {
              const isCoverImage = index === 0;
              const isDragging = draggingIndex === index;
              const panResponder = createPanResponder(index);

              return (
                <Animated.View
                  key={`${uri}-${index}`}
                  style={[
                    styles.imageContainer,
                    isDragging && {
                      transform: [
                        { translateX: draggedItemPosition.x },
                        { translateY: draggedItemPosition.y },
                        { scale: 1.1 },
                      ],
                      zIndex: 1000,
                    },
                  ]}
                  {...panResponder.panHandlers}
                >
                  <TouchableOpacity
                    onPress={() => openImageModal(uri, index)}
                    activeOpacity={0.9}
                    style={[
                      styles.imageWrapper,
                      isCoverImage && styles.coverImageWrapper,
                      isDragging && styles.draggingImage,
                    ]}
                  >
                    <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                    {isCoverImage && (
                      <View style={styles.coverBadge}>
                        <Ionicons name="star" size={12} color="#fff" />
                        <Text style={styles.coverBadgeText}>Cover</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeImage(uri, index)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="close-circle" size={28} color="#ef4444" />
                    </TouchableOpacity>
                    <View style={styles.positionBadge}>
                      <Text style={styles.positionText}>{index + 1}</Text>
                    </View>
                    <View style={styles.dragIndicator}>
                      <Ionicons name="move" size={16} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </>
      ) : (
        renderEmptyState()
      )}

      {/* Add Button */}
      {images.length < maxImages && (
        <TouchableOpacity
          style={[styles.addBtn, images.length === 0 && styles.addBtnPrimary]}
          onPress={pickImage}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={images.length === 0 ? "#fff" : "#ff1ea5"}
            />
          ) : (
            <>
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={images.length === 0 ? "#fff" : "#ff1ea5"}
              />
              <Text
                style={[
                  styles.addBtnText,
                  images.length === 0 && styles.addBtnTextPrimary,
                ]}
              >
                {images.length === 0
                  ? "Add Images"
                  : `Add More (${maxImages - images.length} left)`}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Continue */}
      {onComplete && images.length > 0 && (
        <TouchableOpacity style={styles.nextBtn} onPress={onComplete}>
          <Text style={styles.nextText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={closeImageModal}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalDeleteBtn} onPress={removeImageFromModal}>
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {selectedImage && (
              <>
                <Animated.Image
                  source={{ uri: selectedImage }}
                  style={[
                    styles.modalImage,
                    {
                      transform: [
                        {
                          rotate: rotation.interpolate({
                            inputRange: [-360, 360],
                            outputRange: ["-360deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />

                {cropMode && (
                  <View style={styles.cropOverlay}>
                    <View style={StyleSheet.absoluteFill}>
                      <View style={styles.darkOverlay} />
                    </View>

                    {/* Crop Box */}
                    <Animated.View
                      style={[
                        styles.cropBox,
                        {
                          left: pan.x,
                          top: pan.y,
                          width: cropWidth,
                          height: cropHeight,
                        },
                      ]}
                      {...cropMoveResponder.panHandlers}
                    >
                      {/* Corner Handles */}
                      <View
                        style={[styles.cropHandle, styles.cropHandleTopLeft]}
                        {...resizeTL.panHandlers}
                      />
                      <View
                        style={[styles.cropHandle, styles.cropHandleTopRight]}
                        {...resizeTR.panHandlers}
                      />
                      <View
                        style={[styles.cropHandle, styles.cropHandleBottomLeft]}
                        {...resizeBL.panHandlers}
                      />
                      <View
                        style={[styles.cropHandle, styles.cropHandleBottomRight]}
                        {...resizeBR.panHandlers}
                      />

                      {/* Rotate Handle */}
                      <View style={styles.rotateHandle} {...rotateResponder.panHandlers}>
                        <Ionicons name="refresh" size={18} color="#fff" />
                      </View>

                      {/* Center Icon */}
                      <View style={styles.cropCenter}>
                        <Ionicons name="move" size={22} color="#fff" />
                      </View>

                      {/* Rotation Indicator */}
                      {Math.abs(cropState.rotation % 360) > 1 && (
                        <View style={styles.rotationIndicator}>
                          <Text style={styles.rotationText}>
                            {Math.round(cropState.rotation % 360)}°
                          </Text>
                        </View>
                      )}
                    </Animated.View>
                  </View>
                )}
              </>
            )}
          </View>

          <View style={styles.modalFooter}>
            {!cropMode ? (
              <TouchableOpacity
                style={styles.cropBtn}
                onPress={cropImage}
                disabled={isLoading}
              >
                <Ionicons name="crop-outline" size={24} color="#fff" />
                <Text style={styles.cropBtnText}>Enable Crop Mode</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cropActions}>
                <TouchableOpacity
                  style={[styles.cropBtn, styles.cancelBtn]}
                  onPress={() => setCropMode(false)}
                >
                  <Text style={styles.cropBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.cropBtn, styles.applyCropBtn]}
                  onPress={cropImage}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={24} color="#fff" />
                      <Text style={styles.cropBtnText}>Apply Crop</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
  },
  progressContainer: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ff1ea5",
    marginBottom: 4,
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff1ea5",
    borderRadius: 3,
  },
  dragHint: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
    fontStyle: "italic",
  },
  imageScrollContent: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  imageContainer: {
    marginRight: 16,
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    borderWidth: 2,
    borderColor: "transparent",
  },
  coverImageWrapper: {
    borderColor: "#fbbf24",
  },
  draggingImage: {
    opacity: 0.8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  image: {
    width: 120,
    height: 120,},
  coverBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  coverBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 14,
  },
  positionBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  positionText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  dragIndicator: {
    position: "absolute",
    bottom: 6,
    left: 6,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff1ea5",
    borderStyle: "dashed",
    marginTop: 12,
    gap: 8,
  },
  addBtnPrimary: {
    backgroundColor: "#ff1ea5",
    borderStyle: "solid",
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ff1ea5",
  },
  addBtnTextPrimary: {
    color: "#fff",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  nextText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 16,
    paddingBottom: 16,
  },
  modalCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDeleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: MODAL_IMAGE_HEIGHT,
  },
  cropOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  cropBox: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "#fff",
    borderStyle: "dashed",
  },
  cropHandle: {
    position: "absolute",
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  cropHandleTopLeft: {
    top: -12,
    left: -12,
  },
  cropHandleTopRight: {
    top: -12,
    right: -12,
  },
  cropHandleBottomLeft: {
    bottom: -12,
    left: -12,
  },
  cropHandleBottomRight: {
    bottom: -12,
    right: -12,
  },
  rotateHandle: {
    position: "absolute",
    top: -50,
    alignSelf: "center",
    width: 36,
    height: 36,
    backgroundColor: "#8b5cf6",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cropCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -11 }, { translateY: -11 }],
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  rotationIndicator: {
    position: "absolute",
    bottom: -40,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rotationText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    paddingTop: 16,
  },
  cropBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  cropBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
  cropActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#6b7280",
  },
  applyCropBtn: {
    flex: 2,
    backgroundColor: "#10b981",
  },
});