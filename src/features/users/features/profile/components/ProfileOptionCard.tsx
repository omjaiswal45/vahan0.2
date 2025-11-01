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
    borderRadius: 16,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md + 2,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.text,
    marginBottom: 3,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.error,
    borderRadius: 14,
    minWidth: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    marginRight: spacing.xs,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
  },
  chevron: {
    marginLeft: spacing.xs,
    opacity: 0.4,
  },
});