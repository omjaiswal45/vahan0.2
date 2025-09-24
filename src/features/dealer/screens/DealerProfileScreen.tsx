import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../../store/slices/dealerSlice';
import { updateProfile } from '../services/dealerAPI';
import { RootState, AppDispatch } from '../../../store/store';

const DealerProfileScreen = () => {
const dispatch = useDispatch<AppDispatch>();

  const { profile, loading, error } = useSelector((state: RootState) => state.dealer);
  const [form, setForm] = useState({ name: '', contact: '', address: '' });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(form);
      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={{ padding: 16, color: 'red' }}>{error}</Text>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
      <Text>Name</Text>
      <TextInput value={form.name} onChangeText={text => setForm({ ...form, name: text })} style={{ borderWidth: 1, padding: 8, marginVertical: 8 }} />
      <Text>Contact</Text>
      <TextInput value={form.contact} onChangeText={text => setForm({ ...form, contact: text })} style={{ borderWidth: 1, padding: 8, marginVertical: 8 }} />
      <Text>Address</Text>
      <TextInput value={form.address} onChangeText={text => setForm({ ...form, address: text })} style={{ borderWidth: 1, padding: 8, marginVertical: 8 }} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default DealerProfileScreen;
