// src/features/users/features/profile/screens/EditProfileScreen.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AvatarUploader from '../components/AvatarUploader';
import EditProfileForm from '../components/EditProfileForm';
import { useProfile } from '../hooks/useProfile';
import { ProfileUpdatePayload } from '../types';
import { Colors } from '../../../../../styles/colors';
import { Spacing } from '../../../../../styles/spacing';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();

  if (!profile) {
    return null;
  }

  const handleUpdateProfile = async (data: ProfileUpdatePayload) => {
    await updateProfile(data);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Upload */}
        <AvatarUploader
          imageUri={profile.avatar}
          onImagePicked={async (file) => {
            await uploadAvatar({
              uri: file.uri,
              fileName: file.name,
              mimeType: file.type,
              fileSize: 0,
            });
          }}
        />

        {/* Edit Form */}
        <EditProfileForm
          profile={profile}
          onSubmit={handleUpdateProfile}
          loading={loading}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
});