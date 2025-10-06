import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Animated,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePickerCard from "../components/ImagePickerCard";

// Types
interface RouteParams {
  carData?: Record<string, any>;
}

interface NavigationProps {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  popToTop: () => void;
}

export default function ImagePickerScreen() {
  // Navigation & Route
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<any>();
  const carData = route.params?.carData || {};

  // State Management
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fade in animation on mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  /**
   * Handles image updates from ImagePickerCard
   */
  const handleImagesChange = useCallback((newImages: string[]) => {
    setImages(newImages);
  }, []);

  /**
   * Validates and submits the listing
   */
  const handleSubmit = async () => {
    // Validation
    if (images.length === 0) {
      Alert.alert(
        "Images Required",
        "Please upload at least one image before submitting.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare final listing data
      const finalListingData = {
        ...carData,
        images,
        uploadedAt: new Date().toISOString(),
        imageCount: images.length,
      };

      // Simulate API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ Listing Submitted Successfully:", finalListingData);

      // Success feedback
      Alert.alert(
        "🎉 Success!",
        "Your listing has been submitted successfully.",
        [
          {
            text: "Done",
            style: "default",
            onPress: () => navigation.popToTop(),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("❌ Submission Error:", error);
      Alert.alert(
        "Submission Failed",
        "Something went wrong. Please try again.",
        [{ text: "OK", style: "cancel" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles back navigation with unsaved changes warning
   */
  const handleBackPress = () => {
    if (images.length > 0) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved images. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Instructions Card */}
          <View style={styles.instructionsCard}>
            <View style={styles.instructionRow}>
              <Ionicons name="camera-outline" size={20} color="#ff1ea5" />
              <Text style={styles.instructionText}>
                Add high-quality images to attract buyers
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Ionicons name="resize-outline" size={20} color="#ff1ea5" />
              <Text style={styles.instructionText}>
                First image will be the cover photo
              </Text>
            </View>
            <View style={styles.instructionRow}>
              <Ionicons name="hand-left-outline" size={20} color="#ff1ea5" />
              <Text style={styles.instructionText}>
                Long press and drag to reorder images
              </Text>
            </View>
          </View>

          {/* Image Picker Card Component */}
          <ImagePickerCard
            images={images}
            setImages={handleImagesChange}
            maxImages={5}
          />

          {/* Image Counter */}
          <View style={styles.counterContainer}>
            <Ionicons
              name={images.length === 5 ? "checkmark-circle" : "images-outline"}
              size={20}
              color={images.length === 5 ? "#10b981" : "#666"}
            />
            <Text style={styles.counterText}>
              {images.length} / 5 images uploaded
            </Text>
          </View>

          {/* Tips Section */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>📸 Photo Tips</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Use natural lighting for better quality
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Capture multiple angles (front, side, interior)
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Clean your vehicle before photographing
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>
                Avoid blurry or dark images
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar - Fixed above tab bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            images.length === 0 && styles.submitButtonDisabled,
            isSubmitting && styles.submitButtonSubmitting,
          ]}
          onPress={handleSubmit}
          disabled={images.length === 0 || isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <Text style={styles.submitButtonText}>Submitting...</Text>
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Listing</Text>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom button + tab bar
  },
  content: {
    flex: 1,
  },
  instructionsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#f8f9ff",
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#ff1ea5",
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  counterText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  tipsCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fffbf5",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffe8cc",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: "#ff1ea5",
    marginRight: 8,
    fontWeight: "700",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  bottomBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: "#ff1ea5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    bottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  submitButtonSubmitting: {
    backgroundColor: "#f472b6",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});