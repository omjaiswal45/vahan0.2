// src/features/users/features/profile/screens/EditProfileScreen.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EditProfileForm from '../components/EditProfileForm';
import { useProfile } from '../hooks/useProfile';
import { Colors } from '../../../../../styles/colors';
import { Spacing } from '../../../../../styles/spacing';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile, loading, updateProfile } = useProfile();

  if (!profile) {
    return null;
  }

  const handleUpdateProfile = async (data: FormData) => {
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
        {/* Edit Form with integrated Avatar Upload */}
        <EditProfileForm
          initial={profile}
          onSubmit={handleUpdateProfile}
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