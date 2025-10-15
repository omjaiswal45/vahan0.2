// src/features/users/features/challanCheck/components/ChallanRecordCard.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../../../styles';
import { ChallanRecord } from '../types';

interface ChallanRecordCardProps {
  challan: ChallanRecord;
  onPayPress?: (challanId: string) => void;
  onDetailsPress?: (challanId: string) => void;
}

export const ChallanRecordCard: React.FC<ChallanRecordCardProps> = ({
  challan,
  onPayPress,
  onDetailsPress,
}) => {
  const getStatusColor = (status: ChallanRecord['status']) => {
    switch (status) {
      case 'paid':
        return colors.success;
      case 'overdue':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusBackgroundColor = (status: ChallanRecord['status']) => {
    switch (status) {
      case 'paid':
        return `${colors.success}15`;
      case 'overdue':
        return `${colors.error}15`;
      case 'pending':
        return `${colors.warning}15`;
      default:
        return colors.surface;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.challanNumber}>{challan.challanNumber}</Text>
          <Text style={styles.issueDate}>Issued on {formatDate(challan.issueDate)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusBackgroundColor(challan.status) }]}>
          <Text style={[styles.statusText, { color: getStatusColor(challan.status) }]}>
            {challan.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.violationSection}>
        <Text style={styles.violationType}>{challan.violationType}</Text>
        <Text style={styles.violationDescription}>{challan.violationDescription}</Text>
      </View>

      <View style={styles.detailsSection}>
        <DetailRow icon="📍" label="Location" value={challan.location} />
        <DetailRow icon="👮" label="Officer" value={challan.officerName} />
        {challan.status !== 'paid' && (
          <DetailRow icon="📅" label="Due Date" value={formatDate(challan.dueDate)} />
        )}
      </View>

      <View style={styles.amountSection}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Challan Amount</Text>
          <Text style={styles.amountValue}>₹{challan.amount.toLocaleString('en-IN')}</Text>
        </View>
        {challan.penaltyAmount > 0 && (
          <View style={styles.amountRow}>
            <Text style={[styles.amountLabel, styles.penaltyLabel]}>Penalty</Text>
            <Text style={[styles.amountValue, styles.penaltyValue]}>
              ₹{challan.penaltyAmount.toLocaleString('en-IN')}
            </Text>
          </View>
        )}
        <View style={[styles.amountRow, styles.totalAmountRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{challan.totalAmount.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {challan.status !== 'paid' && onPayPress && (
        <TouchableOpacity
          style={[styles.payButton, challan.status === 'overdue' && styles.payButtonOverdue]}
          onPress={() => onPayPress(challan.id)}
        >
          <Text style={styles.payButtonText}>
            {challan.status === 'overdue' ? 'Pay Overdue Challan' : 'Pay Now'}
          </Text>
        </TouchableOpacity>
      )}

      {onDetailsPress && (
        <TouchableOpacity style={styles.detailsButton} onPress={() => onDetailsPress(challan.id)}>
          <Text style={styles.detailsButtonText}>View Full Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  challanNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  issueDate: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  violationSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  violationType: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  violationDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  detailsSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  amountSection: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  penaltyLabel: {
    color: colors.error,
  },
  penaltyValue: {
    color: colors.error,
  },
  totalAmountRow: {
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  payButtonOverdue: {
    backgroundColor: colors.error,
  },
  payButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.background,
  },
  detailsButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});