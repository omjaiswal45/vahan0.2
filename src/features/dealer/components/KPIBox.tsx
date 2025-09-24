import React from 'react';
import { View, Text } from 'react-native';

interface KPIBoxProps {
  title: string;
  value: number | string;
}

const KPIBox: React.FC<KPIBoxProps> = ({ title, value }) => (
  <View style={{
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#e0f7e9',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }}>
    <Text style={{ fontSize: 16, color: '#333' }}>{title}</Text>
    <Text style={{ fontSize: 22, fontWeight: 'bold', marginTop: 4 }}>{value}</Text>
  </View>
);

export default KPIBox;
