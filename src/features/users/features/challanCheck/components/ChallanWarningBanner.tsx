// src/features/users/features/challanCheck/components/ChallanWarningBanner.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

interface ChallanWarningBannerProps {
  type: 'overdue' | 'pending' | 'info';
  title: string;
  message: string;
}

export const ChallanWarningBanner: React.FC<ChallanWarningBannerProps> = ({
  type,
  title,
  message,
}) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'overdue':
        return colors.errorLight;
      case 'pending':
        return `${colors.warning}20`;
      case 'info':
        return colors.primaryLight;
      default:
        return colors.surface;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'overdue':
        return colors.error;
      case 'pending':
        return colors.warning;
      case 'info':
        return colors.primary;
      default:
        return colors.text;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'overdue':
        return '⚠️';
      case 'pending':
        return '⏰';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getIcon()}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: getIconColor() }]}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 18,
  },
});