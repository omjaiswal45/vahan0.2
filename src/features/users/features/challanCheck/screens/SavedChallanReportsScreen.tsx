// src/features/users/features/challanCheck/screens/SavedChallanReportsScreen.tsx

import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useChallanCheck } from '../hooks/useChallanCheck';
import { VehicleChallanData } from '../types';
import { colors } from '../../../../../styles';

interface SavedChallanReportsScreenProps {
  navigation: any;
}

export const SavedChallanReportsScreen: React.FC<SavedChallanReportsScreenProps> = ({
  navigation,
}) => {
  const { savedReports, removeReport, searchChallan } = useChallanCheck();

  const handleReportPress = async (registrationNumber: string) => {
    try {
      await searchChallan({ registrationNumber });
      navigation.navigate('ChallanCheckReport', { registrationNumber });
    } catch (error) {
      Alert.alert('Error', 'Failed to load report. Please try again.', [{ text: 'OK' }]);
    }
  };

  const handleDeleteReport = (registrationNumber: string) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this saved report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeReport(registrationNumber),
        },
      ]
    );
  };

  const renderReportCard = ({ item }: { item: VehicleChallanData }) => (
    <TouchableOpacity
      style={styles.reportCard}
      onPress={() => handleReportPress(item.registrationNumber)}
    >
      <View style={styles.reportHeader}>
        <View style={styles.licensePlate}>
          <Text style={styles.registrationNumber}>{item.registrationNumber}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReport(item.registrationNumber)}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportInfo}>
        <Text style={styles.vehicleModel}>{item.vehicleModel}</Text>
        <Text style={styles.vehicleClass}>{item.vehicleClass}</Text>
      </View>

      <View style={styles.reportStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{item.totalChallans}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.pendingValue]}>
            ₹{item.totalPendingAmount.toLocaleString('en-IN')}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.reportFooter}>
        <Text style={styles.lastChecked}>
          Last checked: {new Date(item.lastCheckedAt).toLocaleDateString('en-IN')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
      </View>
      <Text style={styles.emptyTitle}>No Saved Reports</Text>
      <Text style={styles.emptyMessage}>
        Your saved challan reports will appear here
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={savedReports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item.registrationNumber}
        contentContainerStyle={[
          styles.listContent,
          savedReports.length === 0 && styles.listContentEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  reportCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  licensePlate: {
    backgroundColor: colors.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.text,
  },
  registrationNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1.5,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 20,
  },
  reportInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  vehicleClass: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  reportStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  pendingValue: {
    color: colors.error,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  reportFooter: {
    alignItems: 'center',
  },
  lastChecked: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});