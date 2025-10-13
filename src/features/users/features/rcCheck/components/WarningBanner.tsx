// src/features/users/features/rcCheck/components/WarningBanner.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../../../styles/colors';
import { Warning } from '../types';

interface WarningBannerProps {
  warnings: Warning[];
}

const WarningBanner: React.FC<WarningBannerProps> = ({ warnings }) => {
  if (warnings.length === 0) {
    return null;
  }

  const getWarningColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          bg: colors.red[50],
          border: colors.red[200],
          text: colors.red[700],
          icon: colors.red[600],
        };
      case 'medium':
        return {
          bg: colors.amber[50],
          border: colors.amber[200],
          text: colors.amber[700],
          icon: colors.amber[600],
        };
      default:
        return {
          bg: colors.blue[50],
          border: colors.blue[200],
          text: colors.blue[700],
          icon: colors.blue[600],
        };
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      default:
        return 'ℹ️';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>⚠️ Warnings & Alerts</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{warnings.length}</Text>
        </View>
      </View>

      <ScrollView style={styles.warningsList}>
        {warnings.map((warning, index) => {
          const warningColors = getWarningColor(warning.severity);
          return (
            <View
              key={index}
              style={[
                styles.warningItem,
                {
                  backgroundColor: warningColors.bg,
                  borderColor: warningColors.border,
                },
              ]}
            >
              <Text style={[styles.icon, { color: warningColors.icon }]}>
                {getSeverityIcon(warning.severity)}
              </Text>
              <View style={styles.warningContent}>
                <View style={styles.warningHeader}>
                  <Text
                    style={[styles.severityText, { color: warningColors.text }]}
                  >
                    {warning.severity.toUpperCase()}
                  </Text>
                  <Text style={styles.category}>{warning.category}</Text>
                </View>
                <Text style={[styles.message, { color: warningColors.text }]}>
                  {warning.message}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
  },
  badge: {
    backgroundColor: colors.red[500],
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  warningsList: {
    maxHeight: 300,
  },
  warningItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  warningContent: {
    flex: 1,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  category: {
    fontSize: 11,
    color: colors.gray[500],
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default WarningBanner;