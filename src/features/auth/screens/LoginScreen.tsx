import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import Button from '../../../common/Button';
import AppHeader from '../../../common/AppHeader';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { role, selectRole, phone, sendOtpHandler, loading, error } = useAuth();
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const phoneInputRef = useRef<PhoneInput>(null);

  const handleSendOtp = async () => {
    const fullNumber = phoneInputRef.current?.getNumberAfterPossiblyEliminatingZero()?.formattedNumber;
    if (!fullNumber) return;
    await sendOtpHandler(fullNumber);
    navigation.navigate('OTP', { phone: fullNumber });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <AppHeader />
          <Text style={styles.sectionTitle}>Sign in to your account</Text>

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'customer' && styles.activeRole]}
              onPress={() => selectRole('customer')}
            >
              <Text style={[styles.roleText, role === 'customer' && styles.activeRoleText]}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'dealer' && styles.activeRole]}
              onPress={() => selectRole('dealer')}
            >
              <Text style={[styles.roleText, role === 'dealer' && styles.activeRoleText]}>Dealer</Text>
            </TouchableOpacity>
          </View>

          {/* Phone Input */}
          <PhoneInput
            ref={phoneInputRef}
            defaultValue={phoneInputValue}
            defaultCode="IN"
            layout="first"
            onChangeText={setPhoneInputValue}
            withShadow
            autoFocus={false}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
            textInputProps={{ placeholder: 'Enter phone number' }}
          />

          <Button title="Send OTP" onPress={handleSendOtp} loading={loading} variant="primary" />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 22, paddingTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 20, textAlign: 'center' },
  roleContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  activeRole: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  roleText: { fontSize: 16, fontWeight: '500', color: '#374151' },
  activeRoleText: { color: '#fff', fontWeight: '600' },
  phoneContainer: { width: '100%', height: 55, marginBottom: 15 },
  phoneTextContainer: { paddingVertical: 0, backgroundColor: '#F3F4F6', borderRadius: 8 },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default LoginScreen;
