// ProfileScreen.tsx
import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../components/ProfileHeader';
import ProfileOptionCard from '../components/ProfileOptionCard';
import { useprofile } from '../hooks/useProfile'; 
import { useDispatch } from 'react-redux';
import { logoutCustomer } from '../../../../../../src/store/slices/customerSlice';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { profile, refresh, loading } = useprofile();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logoutCustomer()) },
    ]);
  };

  return (
    <ScrollView>
      <ProfileHeader profile={profile} />
      <View style={{ marginTop: 12 }}>
        <ProfileOptionCard icon="create-outline" label="Edit profile" onPress={() => navigation.navigate('EditProfile')} />
        <ProfileOptionCard icon="car-outline" label="My Listings" onPress={() => navigation.navigate('MyListings')} />
        <ProfileOptionCard icon="bookmark-outline" label="Saved Cars" onPress={() => navigation.navigate('SavedCars')} />
        <ProfileOptionCard icon="settings-outline" label="Settings" onPress={() => navigation.navigate('Settings')} />
        <ProfileOptionCard icon="log-out-outline" label="Logout" onPress={handleLogout} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
