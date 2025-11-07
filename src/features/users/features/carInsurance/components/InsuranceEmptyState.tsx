// src/features/users/features/carInsurance/components/InsuranceEmptyState.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

interface InsuranceEmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export const InsuranceEmptyState: React.FC<InsuranceEmptyStateProps> = ({
  title = 'No Insurance Found',
  message = 'No active insurance policy found for this vehicle. Consider getting insurance to protect your vehicle.',
  icon = '🛡️',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
    borderRadius: 16,
    marginVertical: 16,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
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
