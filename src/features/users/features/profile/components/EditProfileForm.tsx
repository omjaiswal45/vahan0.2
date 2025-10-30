// EditProfileForm.tsx
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AvatarUploader from './AvatarUploader';
import { Userprofile } from '../types';
import Input from '../../../../../common/Input';
import PrimaryButton from '../../../../../common/Button';
import { Colors, Spacing, Typography } from '../../../../../styles';

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  city?: string;
};

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .optional()
    .matches(/^[0-9+\-\s()]*$/, 'Please enter a valid phone number'),
  city: Yup.string().optional(),
});

type Props = {
  initial?: Userprofile | null;
  onSubmit: (formData: FormData) => Promise<void>;
};

const EditProfileForm: React.FC<Props> = ({ initial, onSubmit }) => {
  const { control, handleSubmit, formState: { errors, isDirty } } = useForm<FormValues>({
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
      phone: initial?.phone ?? '',
      city: initial?.location?.city ?? '',
    },
    resolver: yupResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const [avatarFile, setAvatarFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (data: FormValues) => {
    try {
      const fd = new FormData();
      fd.append('name', data.name.trim());
      fd.append('email', data.email.trim().toLowerCase());
      
      if (data.phone?.trim()) {
        fd.append('phone', data.phone.trim());
      }
      
      if (data.city?.trim()) {
        fd.append('city', data.city.trim());
      }
      
      if (avatarFile) {
        // Append avatar with proper type casting for React Native
        fd.append('avatar', {
          uri: avatarFile.uri,
          name: avatarFile.name,
          type: avatarFile.type,
        } as any);
      }
      
      setLoading(true);
      await onSubmit(fd);
      
      Alert.alert(
        'Success',
        'Your profile has been updated successfully!',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (e: any) {
      Alert.alert(
        'Update Failed',
        e?.message ?? 'An error occurred while updating your profile. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <AvatarUploader
          imageUri={initial?.avatar}
          onImagePicked={(f) => setAvatarFile(f)}
          size={120}
        />
        <Text style={styles.avatarHint}>
          Tap to change your profile photo
        </Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <View>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  returnKeyType="next"
                  editable={!loading}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <View>
                <Input
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                  editable={!loading}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <View>
                <Input
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="+1 (555) 123-4567"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  returnKeyType="next"
                  editable={!loading}
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* City Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>City</Text>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <View>
                <Input
                  value={field.value || ''}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Enter your city"
                  autoCapitalize="words"
                  returnKeyType="done"
                  editable={!loading}
                />
                {errors.city && (
                  <Text style={styles.errorText}>{errors.city.message}</Text>
                )}
              </View>
            )}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={loading ? 'Updating...' : 'Update Profile'}
            onPress={handleSubmit(submit)}
            disabled={loading || !isDirty}
          />
          
          {!isDirty && !loading && (
            <Text style={styles.noChangesText}>
              Make changes to update your profile
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background || '#FFFFFF',
  },
  contentContainer: {
    padding: Spacing.lg || 16,
    paddingBottom: Spacing.xl || 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl || 24,
    paddingVertical: Spacing.md || 12,
  },
  avatarHint: {
    marginTop: Spacing.sm || 8,
    fontSize: 13,
    color: Colors.textSecondary || '#666666',
    fontFamily: Typography?.fontFamily?.regular || 'System',
  },
  formSection: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: Spacing.lg || 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text || '#000000',
    marginBottom: Spacing.xs || 6,
    fontFamily: Typography?.fontFamily?.medium || 'System',
  },
  required: {
    color: Colors.error || '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: Colors.error || '#DC2626',
    marginTop: Spacing.xs || 6,
    fontFamily: Typography?.fontFamily?.regular || 'System',
  },
  buttonContainer: {
    marginTop: Spacing.lg || 16,
  },
  noChangesText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary || '#666666',
    marginTop: Spacing.sm || 8,
    fontFamily: Typography?.fontFamily?.regular || 'System',
  },
});

export default EditProfileForm;
// AvatarUploader.tsx
