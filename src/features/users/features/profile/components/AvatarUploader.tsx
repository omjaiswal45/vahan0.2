// AvatarUploader.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, ActivityIndicator, ActionSheetIOS, Platform } from 'react-native';
import { pickImageFromCamera, pickImageFromLibrary, PickedImageFile } from '../../../../../common/MediaPicker';
import { colors, spacing, typography } from '../../../../../styles';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  imageUri?: string | null;
  onImagePicked: (file: PickedImageFile) => void;
  size?: number;
};

const AvatarUploader: React.FC<Props> = ({ imageUri, onImagePicked, size = 112 }) => {
  const [loading, setLoading] = useState(false);

  const presentPicker = async () => {
    const chooseLibrary = async () => {
      setLoading(true);
      const file = await pickImageFromLibrary();
      if (file) onImagePicked(file);
      setLoading(false);
    };
    const chooseCamera = async () => {
      setLoading(true);
      const file = await pickImageFromCamera();
      if (file) onImagePicked(file);
      setLoading(false);
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) chooseCamera();
          if (buttonIndex === 2) chooseLibrary();
        }
      );
    } else {
      // Simple fallback sheet for Android via inline buttons
      chooseLibrary();
    }
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={presentPicker} activeOpacity={0.85} style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.border }}>
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={{ width: size, height: size }} resizeMode="cover" />
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Ionicons name="camera" size={22} color={colors.textSecondary} />
            <Text style={{ marginTop: spacing.xs, fontFamily: typography.fontFamily.medium, color: colors.textSecondary }}>Add photo</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={{ marginTop: spacing.xs, fontSize: 12, color: colors.textSecondary }}>Tap to upload</Text>
    </View>
  );
};

export default AvatarUploader;
