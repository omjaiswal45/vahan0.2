// src/features/users/features/challanCheck/components/VehicleChallanInfoCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles';

interface VehicleChallanInfoCardProps {
  registrationNumber: string;
  vehicleModel: string;
  vehicleClass: string;
  ownerName?: string;
}

export const VehicleChallanInfoCard: React.FC<VehicleChallanInfoCardProps> = ({
  registrationNumber,
  vehicleModel,
  vehicleClass,
  ownerName,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.licensePlate}>
          <Text style={styles.registrationNumber}>{registrationNumber}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <InfoRow label="Vehicle Model" value={vehicleModel} />
        <InfoRow label="Vehicle Class" value={vehicleClass} />
        {ownerName && <InfoRow label="Owner Name" value={ownerName} />}
      </View>
    </View>
  );
};
interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
    alignItems: 'center',
    marginBottom: 20,
  },
  licensePlate: {
    backgroundColor: colors.warning,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.text,
  },
  registrationNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 2,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
});