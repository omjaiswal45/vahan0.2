// src/features/users/features/challanCheck/components/ChallanEmptyState.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

interface ChallanEmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export const ChallanEmptyState: React.FC<ChallanEmptyStateProps> = ({
  title = 'No Challans Found',
  message = 'Great news! This vehicle has no pending or recorded traffic challans.',
  icon = '✅',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});