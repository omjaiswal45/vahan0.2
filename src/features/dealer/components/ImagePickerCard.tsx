import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  Dimensions
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

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

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission Denied", "Allow access to your gallery to upload images");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.7,
        selectionLimit: maxImages - images.length,
      });

      if (!result.canceled) {
        const selectedImages = result.assets.map(asset => asset.uri);
        setImages([...images, ...selectedImages].slice(0, maxImages));
      }
    } catch (err) {
      console.log("ImagePicker Error:", err);
    }
  };

  const removeImage = (uri: string) => {
    setImages(images.filter(img => img !== uri));
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<string>) => (
    <TouchableOpacity
      style={[styles.imageWrapper, isActive && { opacity: 0.7 }]}
      onLongPress={drag}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item }} style={styles.image} />
      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => removeImage(item)}
      >
        <Ionicons name="close-circle" size={22} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Upload Images</Text>
      <Text style={styles.subtitle}>You can upload up to {maxImages} images</Text>

      <DraggableFlatList
        data={images}
        horizontal
        keyExtractor={(item, index) => `draggable-item-${index}`}
        onDragEnd={({ data }) => setImages(data)}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {images.length < maxImages && (
        <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
          <Ionicons name="add" size={36} color="#ff1ea5" />
        </TouchableOpacity>
      )}

      {onComplete && (
        <TouchableOpacity style={styles.nextBtn} onPress={onComplete}>
          <Text style={styles.nextText}>Next →</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#666", marginBottom: 12 },
  imageWrapper: { marginRight: 12, position: "relative" },
  image: { width: 100, height: 100, borderRadius: 12 },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff1ea5",
    borderRadius: 12,
  },
  addBtn: {
    marginTop: 12,
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ff1ea5",
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtn: {
    marginTop: 16,
    backgroundColor: "#ff1ea5",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  nextText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
