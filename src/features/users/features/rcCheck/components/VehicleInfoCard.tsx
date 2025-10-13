// src/features/users/features/rcCheck/components/VehicleInfoCard.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../../../styles/colors';
import { VehicleBasicInfo } from '../types';

interface VehicleInfoCardProps {
  info: VehicleBasicInfo;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ info }) => {
  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Information</Text>
      
      <View style={styles.header}>
        <Text style={styles.vehicleName}>
          {info.manufacturer} {info.model}
        </Text>
        <Text style={styles.variant}>{info.variant}</Text>
      </View>

      <View style={styles.section}>
        <InfoRow label="Registration No." value={info.registrationNumber} />
        <InfoRow label="Registration Date" value={info.registrationDate} />
        <InfoRow label="Fuel Type" value={info.fuelType} />
        <InfoRow label="Color" value={info.color} />
        <InfoRow label="Body Type" value={info.bodyType} />
        <InfoRow label="Vehicle Class" value={info.vehicleClass} />
      </View>

      <View style={styles.technicalSection}>
        <Text style={styles.sectionTitle}>Technical Details</Text>
        <InfoRow label="Engine Number" value={info.engineNumber} />
        <InfoRow label="Chassis Number" value={info.chassisNumber} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 16,
  },
  header: {
    backgroundColor: colors.blue[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.blue[700],
  },
  variant: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.blue[600],
    marginTop: 4,
  },
  section: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  label: {
    fontSize: 14,
    color: colors.gray[600],
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: colors.gray[900],
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  technicalSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 12,
  },
});

export default VehicleInfoCard;