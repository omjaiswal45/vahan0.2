// src/features/users/features/carInsurance/screens/InsuranceReportScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useCarInsurance } from '../hooks/useCarInsurance';
import { VehicleInsuranceInfoCard } from '../components/VehicleInsuranceInfoCard';
import { InsurancePolicyCard } from '../components/InsurancePolicyCard';
import { InsuranceLoadingSkeleton } from '../components/InsuranceLoadingSkeleton';
import { InsuranceEmptyState } from '../components/InsuranceEmptyState';
import { colors, spacing } from '../../../../../styles';

interface InsuranceReportScreenProps {
  navigation: any;
  route: any;
}

export const InsuranceReportScreen: React.FC<InsuranceReportScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    currentInsuranceData,
    isLoading,
    saveCurrentReport,
    renewPolicy,
  } = useCarInsurance();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveReport}
          activeOpacity={0.7}
        >
          <Text style={styles.saveButtonText}>💾</Text>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [currentInsuranceData]);

  const handleSaveReport = () => {
    saveCurrentReport();
    Alert.alert('Success', 'Report saved successfully!', [{ text: 'OK' }]);
  };

  const handleRenewPolicy = async (policyId: string) => {
    Alert.alert(
      'Renew Policy',
      'Do you want to proceed with the policy renewal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Renew Now',
          onPress: async () => {
            try {
              await renewPolicy(policyId);
              Alert.alert('Success', 'Policy renewal initiated successfully!', [{ text: 'OK' }]);
            } catch (error) {
              Alert.alert('Error', 'Renewal failed. Please try again.', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <InsuranceLoadingSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!currentInsuranceData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <InsuranceEmptyState
            title="No Data Available"
            message="Unable to load insurance data. Please try searching again."
            icon="❌"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VehicleInsuranceInfoCard
          registrationNumber={currentInsuranceData.registrationNumber}
          vehicleModel={currentInsuranceData.vehicleModel}
          vehicleClass={currentInsuranceData.vehicleClass}
          ownerName={currentInsuranceData.ownerName}
        />

        {currentInsuranceData.policyHistory.length === 0 ? (
          <InsuranceEmptyState />
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Insurance Policies</Text>
              <Text style={styles.sectionCount}>
                {currentInsuranceData.policyHistory.length} {currentInsuranceData.policyHistory.length === 1 ? 'Policy' : 'Policies'}
              </Text>
            </View>

            {currentInsuranceData.policyHistory.map((policy) => (
              <InsurancePolicyCard
                key={policy.id}
                policy={policy}
                onRenewPress={handleRenewPolicy}
              />
            ))}
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last checked: {new Date(currentInsuranceData.lastCheckedAt).toLocaleString('en-IN')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  saveButton: {
    marginRight: spacing.md,
    paddingHorizontal: 10,
    paddingVertical: spacing.xs + 2,
    backgroundColor: colors.primaryDarker,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8,
  },
  footer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
