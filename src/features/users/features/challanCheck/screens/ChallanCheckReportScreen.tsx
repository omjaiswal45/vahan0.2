// src/features/users/features/challanCheck/screens/ChallanCheckReportScreen.tsx

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
import { useChallanCheck } from '../hooks/useChallanCheck';
import { VehicleChallanInfoCard } from '../components/VehicleChallanInfoCard';
import { ChallanStatsCard } from '../components/ChallanStatsCard';
import { ChallanRecordCard } from '../components/ChallanRecordCard';
import { ChallanLoadingSkeleton } from '../components/ChallanLoadingSkeleton';
import { ChallanEmptyState } from '../components/ChallanEmptyState';
import { colors } from '../../../../../styles';

interface ChallanCheckReportScreenProps {
  navigation: any;
  route: any;
}

export const ChallanCheckReportScreen: React.FC<ChallanCheckReportScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    currentChallanData,
    isLoading,
    saveCurrentReport,
    payChallan,
    getChallanStats,
  } = useChallanCheck();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveReport}
        >
          <Text style={styles.saveButtonText}>💾 Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [currentChallanData]);

  const handleSaveReport = () => {
    saveCurrentReport();
    Alert.alert('Success', 'Report saved successfully!', [{ text: 'OK' }]);
  };

  const handlePayChallan = async (challanId: string) => {
    Alert.alert(
      'Pay Challan',
      'Do you want to proceed with the payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: async () => {
            try {
              await payChallan(challanId);
              Alert.alert('Success', 'Payment processed successfully!', [{ text: 'OK' }]);
            } catch (error) {
              Alert.alert('Error', 'Payment failed. Please try again.', [{ text: 'OK' }]);
            }
          },
        },
      ]
    );
  };

  const handleChallanDetails = (challanId: string) => {
    navigation.navigate('ChallanDetail', { challanId });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <ChallanLoadingSkeleton />
        </ScrollView>
      </SafeAreaView>
      
    );
  }

  if (!currentChallanData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ChallanEmptyState
            title="No Data Available"
            message="Unable to load challan data. Please try searching again."
            icon="❌"
          />
        </View>
      </SafeAreaView>
    );
  }

  const stats = getChallanStats();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <VehicleChallanInfoCard
          registrationNumber={currentChallanData.registrationNumber}
          vehicleModel={currentChallanData.vehicleModel}
          vehicleClass={currentChallanData.vehicleClass}
          ownerName={currentChallanData.ownerName}
        />

        {stats && <ChallanStatsCard stats={stats} />}

        {currentChallanData.challans.length === 0 ? (
          <ChallanEmptyState />
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Challan Records</Text>
              <Text style={styles.sectionCount}>
                {currentChallanData.challans.length} {currentChallanData.challans.length === 1 ? 'Challan' : 'Challans'}
              </Text>
            </View>

            {currentChallanData.challans.map((challan) => (
              <ChallanRecordCard
                key={challan.id}
                challan={challan}
                onPayPress={handlePayChallan}
                onDetailsPress={handleChallanDetails}
              />
            ))}
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last checked: {new Date(currentChallanData.lastCheckedAt).toLocaleString('en-IN')}
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
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primaryDarker,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  footer: {
    marginTop: 24,
    padding: 16,
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