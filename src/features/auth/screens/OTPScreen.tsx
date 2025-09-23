import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

const OTPScreen = () => {
  const route = useRoute();
  const { phone } = route.params as { phone: string };
  const { verifyOtpHandler, loading, error, role } = useAuth();
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  // Autofill simulation for dev/testing
  useEffect(() => {
    const fakeOtp = '123456';
    setOtp(fakeOtp.split(''));
    fakeOtp.split('').forEach((digit, i) => inputsRef.current[i]?.setNativeProps({ text: digit }));
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1);
    setOtp(newOtp);

    if (text && index < 5) inputsRef.current[index + 1]?.focus();
    if (!text && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    const success = await verifyOtpHandler(phone, enteredOtp);
    if (success) {
      (navigation as any).reset({ index: 0, routes: [{ name: role === 'customer' ? 'CustomerTabs' : 'DealerTabs' }] });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F9FAFB' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>OTP sent to {phone}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => { inputsRef.current[i] = el; }}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={text => handleChange(text, i)}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 25 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8, color: '#1E88E5' },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#555' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 22,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff880aff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: { backgroundColor: '#90CAF9' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  error: { color: 'red', textAlign: 'center', marginTop: 10 },
});

export default OTPScreen;
