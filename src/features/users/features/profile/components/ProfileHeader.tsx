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
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Avatar Section */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={onAvatarPress}
          activeOpacity={0.8}
        >
          {renderAvatar()}
          
          {onAvatarPress && (
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color={colors.white} />
            </View>
          )}
          
          {profile.dealerInfo?.verified && (
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={colors.success}
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Profile Info */}
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {profile.name}
            </Text>
            
            {showEditButton && onEditPress && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={onEditPress}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color={colors.white} />
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {profile.dealerInfo && (
            <View style={styles.dealerBadge}>
              <Ionicons name="business" size={14} color={colors.white} />
              <Text style={styles.dealerText}>Dealer</Text>
            </View>
          )}

          {profile.phone && (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color={colors.white} />
              <Text style={styles.infoText}>{profile.phone}</Text>
            </View>
          )}

          {profile.email && (
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color={colors.white} />
              <Text style={styles.infoText} numberOfLines={1}>
                {profile.email}
              </Text>
            </View>
          )}

          {profile.location && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color={colors.white} />
              <Text style={styles.infoText}>
                {profile.location.city}, {profile.location.state}
              </Text>
            </View>
          )}

          {profile.dealerInfo?.rating && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.ratingText}>
                {profile.dealerInfo.rating.toFixed(1)}
              </Text>
              {profile.dealerInfo.totalSales && (
                <Text style={styles.salesText}>
                  • {profile.dealerInfo.totalSales} sales
                </Text>
              )}
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white + '30',
    borderWidth: 3,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginRight: spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  editText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.white,
    marginLeft: 4,
  },
  dealerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white + '25',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: spacing.xs,
  },
  dealerText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.white,
    marginLeft: spacing.xs,
    opacity: 0.9,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
    marginLeft: 4,
  },
  salesText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.white,
    marginLeft: 4,
    opacity: 0.8,
  },
});