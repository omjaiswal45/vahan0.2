import React, { useState } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

// Types
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

  /**
   * Request permissions and launch image picker
   */
  const pickImage = async () => {
    try {
      setIsLoading(true);

      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to upload images.",
          [{ text: "OK" }]
        );
        return;
      }

      // Calculate remaining slots
      const remainingSlots = maxImages - images.length;

      // Launch image picker
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
      console.error("❌ ImagePicker Error:", err);
      Alert.alert(
        "Upload Failed",
        "Unable to upload images. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove image with confirmation
   */
  const removeImage = (uri: string, index: number) => {
    Alert.alert(
      "Remove Image",
      `Remove ${index === 0 ? "cover" : ""} image?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setImages(images.filter((img) => img !== uri));
          },
        },
      ]
    );
  };

  /**
   * Move image to a new position
   */
  const moveImage = (fromIndex: number, direction: "left" | "right") => {
    const newImages = [...images];
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= images.length) return;

    // Swap images
    [newImages[fromIndex], newImages[toIndex]] = [
      newImages[toIndex],
      newImages[fromIndex],
    ];

    setImages(newImages);
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="images-outline" size={56} color="#d1d5db" />
      </View>
      <Text style={styles.emptyStateText}>No images uploaded yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Add photos to showcase your listing
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      {/* Card Header */}
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

      {/* Image Grid */}
      {images.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageScrollContent}
        >
          {images.map((uri, index) => {
            const isCoverImage = index === 0;
            const canMoveLeft = index > 0;
            const canMoveRight = index < images.length - 1;

            return (
              <View key={`${uri}-${index}`} style={styles.imageContainer}>
                {/* Image Card */}
                <View
                  style={[
                    styles.imageWrapper,
                    isCoverImage && styles.coverImageWrapper,
                  ]}
                >
                  <Image
                    source={{ uri }}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  {/* Cover Badge */}
                  {isCoverImage && (
                    <View style={styles.coverBadge}>
                      <Ionicons name="star" size={12} color="#fff" />
                      <Text style={styles.coverBadgeText}>Cover</Text>
                    </View>
                  )}

                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeImage(uri, index)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </TouchableOpacity>

                  {/* Position Indicator */}
                  <View style={styles.positionBadge}>
                    <Text style={styles.positionText}>{index + 1}</Text>
                  </View>
                </View>

                {/* Reorder Controls */}
                <View style={styles.reorderControls}>
                  <TouchableOpacity
                    style={[
                      styles.reorderBtn,
                      !canMoveLeft && styles.reorderBtnDisabled,
                    ]}
                    onPress={() => moveImage(index, "left")}
                    disabled={!canMoveLeft}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={16}
                      color={canMoveLeft ? "#ff1ea5" : "#d1d5db"}
                    />
                  </TouchableOpacity>

                  <Text style={styles.reorderLabel}>Reorder</Text>

                  <TouchableOpacity
                    style={[
                      styles.reorderBtn,
                      !canMoveRight && styles.reorderBtnDisabled,
                    ]}
                    onPress={() => moveImage(index, "right")}
                    disabled={!canMoveRight}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={canMoveRight ? "#ff1ea5" : "#d1d5db"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        renderEmptyState()
      )}

      {/* Add Image Button */}
      {images.length < maxImages && (
        <TouchableOpacity
          style={[
            styles.addBtn,
            images.length === 0 && styles.addBtnPrimary,
          ]}
          onPress={pickImage}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={images.length === 0 ? "#fff" : "#ff1ea5"} />
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
                {images.length === 0 ? "Add Images" : `Add More (${maxImages - images.length} left)`}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* Completion Button */}
      {onComplete && images.length > 0 && (
        <TouchableOpacity style={styles.nextBtn} onPress={onComplete}>
          <Text style={styles.nextText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      )}
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
  },
  coverImageWrapper: {
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  coverBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fbbf24",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  coverBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  positionBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  positionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ef4444",
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  reorderControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  reorderBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  reorderBtnDisabled: {
    opacity: 0.3,
  },
  reorderLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: "#9ca3af",
  },
  addBtn: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff1ea5",
    borderStyle: "dashed",
    gap: 8,
  },
  addBtnPrimary: {
    backgroundColor: "#ff1ea5",
    borderStyle: "solid",
  },
  addBtnText: {
    color: "#ff1ea5",
    fontWeight: "600",
    fontSize: 15,
  },
  addBtnTextPrimary: {
    color: "#fff",
  },
  nextBtn: {
    marginTop: 16,
    flexDirection: "row",
    backgroundColor: "#ff1ea5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});