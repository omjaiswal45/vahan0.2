import React from 'react';
import { View, Text } from 'react-native';
import { Colors, Spacing, Typography } from '../../../styles';

interface KPIBoxProps {
  title: string;
  value: number | string;
}

const KPIBox: React.FC<KPIBoxProps> = ({ title, value }) => (
  <View style={{
    padding: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    marginVertical: Spacing.sm,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }}>
    <Text style={{ fontSize: 14, color: Colors.textSecondary }}>{title}</Text>
    <Text style={{ fontSize: 22, fontFamily: Typography.fontFamily.bold as any, color: Colors.text, marginTop: 4 }}>{String(value)}</Text>
  </View>
);

export default KPIBox;
