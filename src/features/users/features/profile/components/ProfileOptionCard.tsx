// profileOptionCard.tsx
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Props = {
  icon: string;
  label: string;
  onPress?: () => void;
  badge?: string | number;
};

const profileOptionCard: React.FC<Props> = ({ icon, label, onPress, badge }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 0.5, borderBottomColor: '#eee' }}>
      <Ionicons name={icon} size={22} style={{ width: 36 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16 }}>{label}</Text>
      </View>
      {badge ? <View style={{ backgroundColor: '#f2f2f2', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}><Text>{badge}</Text></View> : null}
    </TouchableOpacity>
  );
};

export default profileOptionCard;
