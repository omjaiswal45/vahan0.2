import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, View, Text, TextInput, ScrollView, 
  TouchableOpacity, Alert, StyleSheet, Image, Animated, Platform 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../../../store/slices/dealerSlice';
import { updateProfile } from '../services/dealerAPI';
import { RootState, AppDispatch } from '../../../store/store';

const DealerProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.dealer);

  const [scaleAnim] = useState(new Animated.Value(1));
  const [form, setForm] = useState({
    name: '', contact: '', email: '', address: '',
    dealership: '', dealerType: '', yearsInBusiness: '',
    website: '', instagram: '', facebook: '', linkedin: '',
    preferredVehicle: '', minPrice: '', maxPrice: '', locationAreas: '',
    licenseNumber: '', gstNumber: '',
  });

  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) setForm({ ...form, ...profile });
    if (profile?.avatar) setAvatar(profile.avatar);
  }, [profile]);

  const pickAvatar = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Camera roll permission is required.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    try {
      await updateProfile({ ...form, avatar });
      Alert.alert('Success', 'Profile updated!');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const renderInput = (label: string, key: string, placeholder?: string, multiline = false) => (
    <View style={styles.inputCard}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={(form as any)[key]}
        onChangeText={text => setForm({ ...form, [key]: text })}
        style={[styles.input, multiline && { height: 80 }]}
        placeholder={placeholder || `Enter ${label}`}
        placeholderTextColor="#999"
        multiline={multiline}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dealer Profile</Text>

        {/* Avatar */}
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickAvatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarPlaceholder}>Upload Avatar</Text>
          )}
        </TouchableOpacity>

        {/* Personal Info */}
        {renderInput('Name', 'name')}
        {renderInput('Contact', 'contact')}
        {renderInput('Email', 'email')}
        {renderInput('Address', 'address', undefined, true)}

 

   


        {/* Save Button */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveText}>Save Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fdf4f9' },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffe5f4',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    color: '#ff1ea5',
    fontWeight: '700',
    textAlign: 'center',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#ff1ea5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ffe5f4',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#e5e5ea',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveButton: {
    backgroundColor: '#ff1ea5',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff1ea5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default DealerProfileScreen;
