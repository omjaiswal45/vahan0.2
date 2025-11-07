// src/features/users/features/carInsurance/components/InsurancePolicyCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors, spacing } from '../../../../../styles';
import { InsurancePolicy } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface InsurancePolicyCardProps {
  policy: InsurancePolicy;
  onRenewPress?: (policyId: string) => void;
}

export const InsurancePolicyCard: React.FC<InsurancePolicyCardProps> = ({
  policy,
  onRenewPress,
}) => {
  const getStatusColor = (status: InsurancePolicy['status']) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'expired':
        return colors.error;
      case 'expiring-soon':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusLabel = (status: InsurancePolicy['status']) => {
    switch (status) {
      case 'active':
        return '✓ Active';
      case 'expired':
        return '✗ Expired';
      case 'expiring-soon':
        return '⚠ Expiring Soon';
      default:
        return status;
    }
  };

  const getPolicyTypeLabel = (type: InsurancePolicy['policyType']) => {
    switch (type) {
      case 'comprehensive':
        return 'Comprehensive';
      case 'third-party':
        return 'Third Party';
      case 'standalone-od':
        return 'Standalone OD';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    // Format large numbers in lakhs for better readability
    if (amount >= 100000) {
      const lakhs = amount / 100000;
      return `₹${lakhs.toFixed(2)}L`;
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.providerSection}>
          <Text style={styles.provider}>{policy.provider}</Text>
          <Text style={styles.policyNumber}>Policy: {policy.policyNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(policy.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(policy.status)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsSection}>
        <DetailRow label="Policy Type" value={getPolicyTypeLabel(policy.policyType)} />
        <DetailRow label="Coverage" value={policy.coverageType} />
        <DetailRow label="Issue Date" value={formatDate(policy.issueDate)} />
        <DetailRow label="Expiry Date" value={formatDate(policy.expiryDate)} highlight />
      </View>

      <View style={styles.divider} />

      <View style={styles.financialSection}>
        <View style={styles.financialCard}>
          <Text style={styles.financialLabel}>Premium</Text>
          <Text style={styles.financialValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatCurrency(policy.premiumAmount)}
          </Text>
        </View>
        <View style={styles.financialCard}>
          <Text style={styles.financialLabel}>IDV</Text>
          <Text style={styles.financialValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatCurrency(policy.idv)}
          </Text>
        </View>
        <View style={styles.financialCard}>
          <Text style={styles.financialLabel}>NCB</Text>
          <Text style={styles.financialValue} numberOfLines={1}>
            {policy.ncbPercentage}%
          </Text>
        </View>
      </View>

      {policy.addOns.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.addOnsSection}>
            <Text style={styles.addOnsTitle}>Add-Ons</Text>
            <View style={styles.addOnsGrid}>
              {policy.addOns.map((addOn, index) => (
                <View key={index} style={styles.addOnChip}>
                  <Text style={styles.addOnText}>✓ {addOn}</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      )}

      {policy.claimsMade > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.claimsSection}>
            <Text style={styles.claimsText}>
              Claims Made: <Text style={styles.claimsCount}>{policy.claimsMade}</Text>
            </Text>
          </View>
        </>
      )}

      {(policy.status === 'expired' || policy.status === 'expiring-soon') && onRenewPress && (
        <>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.renewButton}
            onPress={() => onRenewPress(policy.id)}
          >
            <Text style={styles.renewButtonText}>🔄 Renew Policy</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, highlight }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, highlight && styles.detailValueHighlight]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.md + 4,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  providerSection: {
    flex: 1,
  },
  provider: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  policyNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  detailsSection: {
    gap: spacing.md - 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  detailValueHighlight: {
    color: '#8b5cf6',
  },
  financialSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  financialCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 0, // Allow flex items to shrink below content size
  },
  financialLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  financialValue: {
    fontSize: SCREEN_WIDTH < 375 ? 13 : 15,
    fontWeight: '800',
    color: '#8b5cf6',
    textAlign: 'center',
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
  },
  addOnsSection: {
    marginTop: spacing.xs,
  },
  addOnsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md - 4,
  },
  addOnsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  addOnChip: {
    backgroundColor: '#f3e8ff',
    paddingHorizontal: spacing.md - 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8,
  },
  addOnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  claimsSection: {
    backgroundColor: '#fef3c7',
    padding: spacing.md - 4,
    borderRadius: 8,
  },
  claimsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  claimsCount: {
    fontWeight: '800',
  },
  renewButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  renewButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
});
