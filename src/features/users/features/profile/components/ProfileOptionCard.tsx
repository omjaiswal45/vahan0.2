// src/features/users/features/profile/components/ProfileOptionCard.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { ProfileOption } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

interface ProfileOptionCardProps {
  option: ProfileOption;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ProfileOptionCard: React.FC<ProfileOptionCardProps> = ({
  option,
  onPress,
  style,
}) => {
  const IconComponent = {
    ionicon: Ionicons,
    material: MaterialIcons,
    feather: Feather,
    fontawesome: FontAwesome5,
  }[option.iconType || 'ionicon'];

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: option.color ? `${option.color}15` : colors.primary + '15' },
          ]}
        >
          <IconComponent
            name={option.icon as any}
            size={24}
            color={option.color || colors.primary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{option.title}</Text>
          {option.subtitle && (
            <Text style={styles.subtitle}>{option.subtitle}</Text>
          )}
        </View>

        <View style={styles.rightContent}>
          {option.badge !== undefined && option.badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {option.badge > 99 ? '99+' : option.badge}
              </Text>
            </View>
          )}

          {(option.showChevron !== false) && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSecondary}
              style={styles.chevron}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  chevron: {
    marginLeft: spacing.xs,
  },
});