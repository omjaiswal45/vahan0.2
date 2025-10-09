// SettingsScreen.tsx
import React, { useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { logoutCustomer } from '../../../../../../src/store/slices/customerSlice';

const SettingsScreen: React.FC = () => {
  const [dark, setDark] = useState(false);
  const [notify, setNotify] = useState(true);
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logoutCustomer()) },
    ]);
  };

  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
        <Text>Dark Mode</Text>
        <Switch value={dark} onValueChange={setDark} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
        <Text>Notifications</Text>
        <Switch value={notify} onValueChange={setNotify} />
      </View>
      <View style={{ marginTop: 24 }}>
        <Text onPress={handleLogout} style={{ color: 'red' }}>Logout</Text>
      </View>
    </View>
  );
};

export default SettingsScreen;
