// AvatarUploader.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

type Props = {
  imageUri?: string | null;
  onImagePicked: (file: { uri: string; name: string; type: string }) => void;
  size?: number;
};

const AvatarUploader: React.FC<Props> = ({ imageUri, onImagePicked, size = 96 }) => {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permission required', 'We need access to your photo library to update avatar.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.cancelled) return;
      setLoading(true);
      const manip = await ImageManipulator.manipulateAsync(result.uri, [{ resize: { width: 800 } }], {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      // create file object
      const fileName = manip.uri.split('/').pop() || `avatar.jpg`;
      const file = { uri: manip.uri, name: fileName, type: 'image/jpeg' };
      onImagePicked(file);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={pickImage} style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: size, height: size }} resizeMode="cover" />
        ) : (
          <View style={{ width: size, height: size, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Upload</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AvatarUploader;
