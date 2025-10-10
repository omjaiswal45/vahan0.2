// src/features/users/features/profile/screens/SettingsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import { SettingsConfig } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

const defaultSettings: SettingsConfig = {
  notifications: {
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false,
    leadAlerts: true,
    priceDropAlerts: true,
    newListingAlerts: true,
  },
  privacy: {
    showPhone: false,
    showEmail: false,
    allowContact: true,
  },
  preferences: {
    language: 'English',
    currency: 'INR',
    distanceUnit: 'km',
  },
};

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { settings, fetchSettings, updateSettings, deleteAccount, loading } = useProfile();
  const [localSettings, setLocalSettings] = useState<SettingsConfig>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await fetchSettings();
    if (data) {
      setLocalSettings(data);
    }
  };

  const handleToggle = async (
    section: keyof SettingsConfig,
    key: string,
    value: boolean
  ) => {
    if (!localSettings) return;

    const updatedSettings = {
      ...localSettings,
      [section]: {
        ...localSettings[section],
        [key]: value,
      },
    };

    setLocalSettings(updatedSettings);

    try {
      await updateSettings({
        [section]: {
          ...localSettings[section],
          [key]: value,
        },
      });
    } catch (error) {
      // Revert on error
      setLocalSettings(localSettings);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      // Navigate to auth screen after successful deletion
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' as never }],
      });
    } catch (error) {
      // User cancelled or error occurred
    }
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{content}</View>
    </View>
  );

  const renderToggleItem = (
    label: string,
    description: string,
    section: keyof SettingsConfig,
    key: string,
    value: boolean
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={(newValue) => handleToggle(section, key, newValue)}
        trackColor={{ false: colors.border, true: colors.primary + '80' }}
        thumbColor={value ? colors.primary : colors.white}
        ios_backgroundColor={colors.border}
      />
    </View>
  );

  // Always render using localSettings (seeded with defaults), and hydrate when API is available

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications */}
        {renderSection(
          'Notifications',
          <>
            {renderToggleItem(
              'Push Notifications',
              'Receive push notifications on your device',
              'notifications',
              'pushEnabled',
              localSettings.notifications.pushEnabled
            )}
            {renderToggleItem(
              'Email Notifications',
              'Receive notifications via email',
              'notifications',
              'emailEnabled',
              localSettings.notifications.emailEnabled
            )}
            {renderToggleItem(
              'SMS Notifications',
              'Receive text messages for important updates',
              'notifications',
              'smsEnabled',
              localSettings.notifications.smsEnabled
            )}
            {renderToggleItem(
              'Lead Alerts',
              'Get notified when someone is interested in your listing',
              'notifications',
              'leadAlerts',
              localSettings.notifications.leadAlerts
            )}
            {renderToggleItem(
              'Price Drop Alerts',
              'Get notified about price drops on saved cars',
              'notifications',
              'priceDropAlerts',
              localSettings.notifications.priceDropAlerts
            )}
            {renderToggleItem(
              'New Listing Alerts',
              'Get notified about new cars matching your preferences',
              'notifications',
              'newListingAlerts',
              localSettings.notifications.newListingAlerts
            )}
          </>
        )}

        {/* Privacy */}
        {renderSection(
          'Privacy',
          <>
            {renderToggleItem(
              'Show Phone Number',
              'Display your phone number on listings',
              'privacy',
              'showPhone',
              localSettings.privacy.showPhone
            )}
            {renderToggleItem(
              'Show Email',
              'Display your email on listings',
              'privacy',
              'showEmail',
              localSettings.privacy.showEmail
            )}
            {renderToggleItem(
              'Allow Contact',
              'Allow buyers to contact you directly',
              'privacy',
              'allowContact',
              localSettings.privacy.allowContact
            )}
          </>
        )}

        {/* Preferences */}
        {renderSection(
          'Preferences',
          <>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingValue}>
                  {localSettings.preferences.language}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Currency</Text>
                <Text style={styles.settingValue}>
                  {localSettings.preferences.currency}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Distance Unit</Text>
                <Text style={styles.settingValue}>
                  {localSettings.preferences.distanceUnit.toUpperCase()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </>
        )}

        {/* About */}
        {renderSection(
          'About',
          <>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Terms & Conditions</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>App Version</Text>
                <Text style={styles.settingValue}>1.0.0</Text>
              </View>
            </View>
          </>
        )}

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleDeleteAccount}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>

          <Text style={styles.dangerDescription}>
            Once you delete your account, there is no going back. Please be certain.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  dangerSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.error + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  dangerTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.error,
    marginBottom: spacing.md,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
    marginBottom: spacing.sm,
  },
  dangerButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.error,
    marginLeft: spacing.xs,
  },
  dangerDescription: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.error,
    textAlign: 'center',
    lineHeight: 18,
  },
});