// src/features/users/features/rcCheck/screens/RCCheckReportScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { colors } from '../../../../../styles/colors';
import { useRCCheck } from '../hooks/useRCCheck';
import TrustScoreCard from '../components/TrustScoreCard';
import VehicleInfoCard from '../components/VehicleInfoCard';
import WarningBanner from '../components/WarningBanner';
import PriceEstimationCard from '../components/PriceEstimationCard';
import InspectionReportCard from '../components/InspectionReportCard';

interface RCCheckReportScreenProps {
  navigation: any;
}

const RCCheckReportScreen: React.FC<RCCheckReportScreenProps> = ({ navigation }) => {
  const { currentReport, saveCurrentReport, isReportSaved } = useRCCheck();
  const [isSaving, setIsSaving] = useState(false);

  if (!currentReport) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📄</Text>
          <Text style={styles.emptyText}>No report available</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.emptyButtonText}>Check New Vehicle</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSaveReport = async () => {
    if (isReportSaved(currentReport.reportId)) {
      Alert.alert('Already Saved', 'This report is already in your saved list');
      return;
    }

    setIsSaving(true);
    try {
      await saveCurrentReport();
      Alert.alert('Success', 'Report saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save report');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareReport = () => {
    Alert.alert('Share Report', 'Share functionality coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleShareReport}
            >
              <Text style={styles.iconButtonText}>📤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, isSaving && styles.iconButtonDisabled]}
              onPress={handleSaveReport}
              disabled={isSaving}
            >
              <Text style={styles.iconButtonText}>
                {isReportSaved(currentReport.reportId) ? '💾' : '🔖'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>
            {currentReport.basicInfo.manufacturer} {currentReport.basicInfo.model}
          </Text>
          <Text style={styles.reportSubtitle}>
            {currentReport.registrationNumber}
          </Text>
          <Text style={styles.reportDate}>
            Report Date: {new Date(currentReport.checkDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Trust Score */}
        <View style={styles.section}>
          <TrustScoreCard
            score={currentReport.trustScore}
            grade={currentReport.trustGrade}
          />
        </View>

        {/* Warnings */}
        {currentReport.warnings.length > 0 && (
          <View style={styles.section}>
            <WarningBanner warnings={currentReport.warnings} />
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <StatCard
            icon="👤"
            label="Owners"
            value={currentReport.ownerInfo.ownerCount.toString()}
          />
          <StatCard
            icon="💰"
            label="Est. Value"
            value={`₹${(currentReport.priceEstimation?.estimatedPrice || 0) / 1000}K`}
          />
          <StatCard
            icon="🚨"
            label="Challans"
            value={currentReport.challansInfo.totalChallans.toString()}
          />
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <VehicleInfoCard info={currentReport.basicInfo} />
        </View>

        {/* Price Estimation */}
        {currentReport.priceEstimation && (
          <View style={styles.section}>
            <PriceEstimationCard estimation={currentReport.priceEstimation} />
          </View>
        )}

        {/* Inspection Report */}
        {currentReport.inspectionReport && (
          <View style={styles.section}>
            <InspectionReportCard report={currentReport.inspectionReport} />
          </View>
        )}

        {/* Owner & Registration Info */}
        <View style={styles.section}>
          <OwnerInfoCard
            ownerInfo={currentReport.ownerInfo}
            insuranceInfo={currentReport.insuranceInfo}
            financeInfo={currentReport.financeInfo}
            fitnessInfo={currentReport.fitnessInfo}
          />
        </View>

        {/* Challans Info */}
        {currentReport.challansInfo.totalChallans > 0 && (
          <View style={styles.section}>
            <ChallansCard challansInfo={currentReport.challansInfo} />
          </View>
        )}

        {/* Safety Checks */}
        <View style={styles.section}>
          <SafetyChecksCard
            blacklistInfo={currentReport.blacklistInfo}
            theftInfo={currentReport.theftInfo}
          />
        </View>

        {/* Recommendations */}
        {currentReport.recommendations.length > 0 && (
          <View style={styles.section}>
            <RecommendationsCard recommendations={currentReport.recommendations} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const OwnerInfoCard = ({ ownerInfo, insuranceInfo, financeInfo, fitnessInfo }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>📋 Owner & Documents</Text>
    
    <View style={styles.cardSection}>
      <Text style={styles.cardSectionTitle}>Owner Details</Text>
      <InfoRow label="Owner Name" value={ownerInfo.ownerName} />
      <InfoRow label="Owner Count" value={`${ownerInfo.ownerCount} Owner(s)`} />
      <InfoRow label="Registered At" value={ownerInfo.registeredAt} />
    </View>

    <View style={styles.cardSection}>
      <Text style={styles.cardSectionTitle}>Insurance</Text>
      <InfoRow label="Company" value={insuranceInfo.insuranceCompany} />
      <InfoRow label="Policy Type" value={insuranceInfo.insuranceType} />
      <InfoRow
        label="Valid Upto"
        value={insuranceInfo.validUpto}
        status={insuranceInfo.status}
      />
    </View>

    {financeInfo.isFinanced && (
      <View style={styles.cardSection}>
        <Text style={styles.cardSectionTitle}>Finance</Text>
        <InfoRow label="Financier" value={financeInfo.financierName || ''} />
        <InfoRow label="Status" value={financeInfo.hypothecationStatus || ''} />
        {financeInfo.outstandingAmount && (
          <InfoRow
            label="Outstanding"
            value={`₹${financeInfo.outstandingAmount.toLocaleString()}`}
          />
        )}
      </View>
    )}

    <View style={styles.cardSection}>
      <Text style={styles.cardSectionTitle}>Fitness & Tax</Text>
      <InfoRow label="Fitness Valid Upto" value={fitnessInfo.fitnessUpto} />
      <InfoRow label="PUC Valid Upto" value={fitnessInfo.pucValidUpto} />
      <InfoRow label="Road Tax Paid Upto" value={fitnessInfo.roadTaxPaidUpto} />
    </View>
  </View>
);

const ChallansCard = ({ challansInfo }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>🚨 Traffic Challans</Text>
    <View style={styles.challanSummary}>
      <Text style={styles.challanCount}>
        Total: {challansInfo.totalChallans} Challan(s)
      </Text>
      <Text style={styles.challanAmount}>
        ₹{challansInfo.totalFineAmount.toLocaleString()}
      </Text>
    </View>
    {challansInfo.challans.map((challan: any, index: number) => (
      <View key={index} style={styles.challanItem}>
        <View style={styles.challanHeader}>
          <Text style={styles.challanViolation}>{challan.violation}</Text>
          <Text style={styles.challanFine}>₹{challan.fineAmount}</Text>
        </View>
        <Text style={styles.challanDate}>Date: {challan.challanDate}</Text>
        <Text style={styles.challanLocation}>Location: {challan.location}</Text>
        <View
          style={[
            styles.challanStatus,
            challan.status === 'paid' ? styles.challanPaid : styles.challanPending,
          ]}
        >
          <Text style={styles.challanStatusText}>
            {challan.status === 'paid' ? 'PAID' : 'PENDING'}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const SafetyChecksCard = ({ blacklistInfo, theftInfo }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>🔒 Safety Checks</Text>
    <View style={styles.safetyCheck}>
      <Text style={styles.safetyIcon}>
        {blacklistInfo.isBlacklisted ? '❌' : '✅'}
      </Text>
      <View style={styles.safetyContent}>
        <Text style={styles.safetyLabel}>Blacklist Status</Text>
        <Text
          style={[
            styles.safetyValue,
            blacklistInfo.isBlacklisted ? styles.safetyDanger : styles.safetySafe,
          ]}
        >
          {blacklistInfo.isBlacklisted ? 'BLACKLISTED' : 'Clear'}
        </Text>
      </View>
    </View>
    <View style={styles.safetyCheck}>
      <Text style={styles.safetyIcon}>{theftInfo.isStolen ? '❌' : '✅'}</Text>
      <View style={styles.safetyContent}>
        <Text style={styles.safetyLabel}>Theft Status</Text>
        <Text
          style={[
            styles.safetyValue,
            theftInfo.isStolen ? styles.safetyDanger : styles.safetySafe,
          ]}
        >
          {theftInfo.isStolen ? 'REPORTED STOLEN' : 'Not Reported'}
        </Text>
      </View>
    </View>
  </View>
);

const RecommendationsCard = ({ recommendations }: any) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>💡 Recommendations</Text>
    {recommendations.map((rec: string, index: number) => (
      <View key={index} style={styles.recommendationItem}>
        <Text style={styles.recommendationBullet}>•</Text>
        <Text style={styles.recommendationText}>{rec}</Text>
      </View>
    ))}
  </View>
);

const InfoRow = ({ label, value, status }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoRight}>
      <Text style={styles.infoValue}>{value}</Text>
      {status && (
        <View
          style={[
            styles.statusBadge,
            status === 'active'
              ? styles.statusActive
              : status === 'expiring_soon'
              ? styles.statusWarning
              : styles.statusExpired,
          ]}
        >
          <Text style={styles.statusText}>{status.replace('_', ' ')}</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.blue[600],
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconButtonDisabled: {
    opacity: 0.5,
  },
  iconButtonText: {
    fontSize: 20,
  },
  reportHeader: {
    marginBottom: 24,
  },
  reportTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: 4,
  },
  reportSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.blue[600],
    letterSpacing: 1,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 13,
    color: colors.gray[600],
  },
  section: {
    marginBottom: 20,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.gray[900],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.gray[600],
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 16,
  },
  cardSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.gray[600],
    fontWeight: '500',
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoValue: {
    fontSize: 13,
    color: colors.gray[900],
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusActive: {
    backgroundColor: colors.green[100],
  },
  statusWarning: {
    backgroundColor: colors.amber[100],
  },
  statusExpired: {
    backgroundColor: colors.red[100],
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  challanSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.red[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  challanCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.red[700],
  },
  challanAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.red[700],
  },
  challanItem: {
    backgroundColor: colors.gray[50],
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  challanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  challanViolation: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gray[900],
  },
  challanFine: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.red[600],
  },
  challanDate: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: 2,
  },
  challanLocation: {
    fontSize: 12,
    color: colors.gray[600],
    marginBottom: 6,
  },
  challanStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  challanPaid: {
    backgroundColor: colors.green[100],
  },
  challanPending: {
    backgroundColor: colors.red[100],
  },
  challanStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  safetyCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  safetyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  safetyContent: {
    flex: 1,
  },
  safetyLabel: {
    fontSize: 13,
    color: colors.gray[600],
    fontWeight: '600',
    marginBottom: 4,
  },
  safetyValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  safetySafe: {
    color: colors.green[600],
  },
  safetyDanger: {
    color: colors.red[600],
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recommendationBullet: {
    fontSize: 18,
    color: colors.blue[600],
    marginRight: 10,
    fontWeight: '700',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: colors.gray[600],
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.blue[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RCCheckReportScreen;