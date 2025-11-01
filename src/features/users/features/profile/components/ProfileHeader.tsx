// src/features/users/features/profile/components/ProfileHeader.tsx

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditPress?: () => void;
  onAvatarPress?: () => void;
  showEditButton?: boolean;
  style?: ViewStyle;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onEditPress,
  onAvatarPress,
  showEditButton = true,
  style,
}) => {
  const renderAvatar = () => {
    if (profile.avatar) {
      return (
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
      );
    }

    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>
          {profile.name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Avatar Section - Centered */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={onAvatarPress}
            activeOpacity={0.8}
          >
            {renderAvatar()}

            {onAvatarPress && (
              <View style={styles.cameraButton}>
                <Ionicons name="camera" size={18} color={colors.white} />
              </View>
            )}

            {profile.dealerInfo?.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={28}
                  color={colors.success}
                />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Profile Info - Centered */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.name}
            </Text>

            {profile.dealerInfo && (
              <View style={styles.dealerBadge}>
                <Ionicons name="business" size={12} color={colors.white} />
                <Text style={styles.dealerText}>Dealer</Text>
              </View>
            )}
          </View>

          {/* Contact Info Row */}
          <View style={styles.contactRow}>
            {profile.phone && (
              <View style={styles.infoChip}>
                <Ionicons name="call" size={14} color={colors.white} />
                <Text style={styles.infoText}>{profile.phone}</Text>
              </View>
            )}

            {profile.location && (
              <View style={styles.infoChip}>
                <Ionicons name="location" size={14} color={colors.white} />
                <Text style={styles.infoText}>
                  {profile.location.city}
                </Text>
              </View>
            )}
          </View>

          {/* Edit Button - Full Width */}
          {showEditButton && onEditPress && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={onEditPress}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={20} color={colors.white} />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xxl + 10,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white + '25',
    borderWidth: 4,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  verifiedBadge: {
    position: 'absolute',
    right: -2,
    top: 0,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  name: {
    fontSize: 26,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  dealerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '30',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 10,
  },
  dealerText: {
    fontSize: 11,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.white,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
});