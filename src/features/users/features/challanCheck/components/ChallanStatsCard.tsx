// src/features/users/features/challanCheck/components/ChallanStatsCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';
import { ChallanStats } from '../types';

interface ChallanStatsCardProps {
  stats: ChallanStats;
}
export const ChallanStatsCard: React.FC<ChallanStatsCardProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challan Summary</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statBox, styles.totalBox]}>
          <Text style={styles.statValue}>{stats.totalChallans}</Text>
          <Text style={styles.statLabel}>Total Challans</Text>
        </View>

        <View style={[styles.statBox, styles.pendingBox]}>
          <Text style={styles.statValue}>{stats.pendingChallans}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View> 
        <View style={[styles.statBox, styles.overdueBox]}>
          <Text style={styles.statValue}>{stats.overdueChallans}</Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>

        <View style={[styles.statBox, styles.paidBox]}>
          <Text style={styles.statValue}>{stats.paidChallans}</Text>
          <Text style={styles.statLabel}>Paid</Text>
        </View>
      </View>

      {stats.totalPendingAmount > 0 && (
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Pending Amount</Text>
          <Text style={styles.amountValue}>₹{stats.totalPendingAmount.toLocaleString('en-IN')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  statBox: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalBox: {
    backgroundColor: colors.primaryLight,
  },
  pendingBox: {
    backgroundColor: `${colors.warning}15`,
  },
  overdueBox: {
    backgroundColor: `${colors.error}15`,
  },
  paidBox: {
    backgroundColor: `${colors.success}15`,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  amountContainer: {
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.error,
  },
});
