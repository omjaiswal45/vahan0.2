// EditprofileScreen.tsx
import React from 'react';
import { View, Alert } from 'react-native';
import EditprofileForm from '../components/EditProfileForm';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../../../src/store/store';
import { updateprofile } from '../../../../../../src/store/slices/customerSlice';

const EditprofileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const profile = useSelector((s: RootState) => s.customer.profile);

  const onSubmit = async (formData: FormData) => {
    try {
      await dispatch(updateprofile({ formData }) as any);
      Alert.alert('Success', 'profile updated.');
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <EditprofileForm initial={profile} onSubmit={onSubmit} />
    </View>
  );
};

export default EditprofileScreen;
