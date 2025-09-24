import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface LeadItemProps {
  lead: any;
  onPress: () => void;
}

const LeadItem: React.FC<LeadItemProps> = ({ lead, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      padding: 12,
      borderBottomWidth: 0.5,
      borderColor: '#ccc',
      backgroundColor: '#f9f9f9',
      marginVertical: 4,
      borderRadius: 6,
    }}
  >
    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{lead.customerName}</Text>
    <Text style={{ fontSize: 14 }}>{lead.carModel}</Text>
  </TouchableOpacity>
);

export default LeadItem;
