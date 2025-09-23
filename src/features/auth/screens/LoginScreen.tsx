import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Input from '../../../common/Input';
import Button from '../../../common/Button';
import AppHeader from '../../../common/AppHeader';
import PhoneInput from 'react-native-phone-number-input';
import { useAuth } from '../hooks/useAuth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
  // ...other props...
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { emailLoginHandler, sendOtpHandler, loading, error, role, setRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const phoneInput = useRef<PhoneInput>(null);

  const handleEmailLogin = async () => {
    const success = await emailLoginHandler(email, password);
    if (success) {
      console.log('Logged in as', role);
    }
  };

  const handleSendOtp = async () => {
    const fullNumber = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    if (fullNumber) {
      await sendOtpHandler(fullNumber.formattedNumber);
      navigation.navigate('OTP', { phone: fullNumber.formattedNumber });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F9FAFB' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <AppHeader />

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Sign in to your account</Text>

            {/* Role Selection */}
            <View style={styles.roleContainer}>
              <TouchableOpacity style={[styles.roleButton, role === 'customer' && styles.activeRole]} onPress={() => setRole('customer')}>
                <Text style={[styles.roleText, role === 'customer' && styles.activeRoleText]}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roleButton, role === 'dealer' && styles.activeRole]} onPress={() => setRole('dealer')}>
                <Text style={[styles.roleText, role === 'dealer' && styles.activeRoleText]}>Dealer</Text>
              </TouchableOpacity>
            </View>

            {/* Email Login */}
            <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
            <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>

            <Button title="Login" onPress={handleEmailLogin} loading={loading} variant="primary"/>

            <Text style={styles.orText}>─── OR ───</Text>

            {/* Phone OTP */}
            <PhoneInput
              ref={phoneInput}
              defaultValue={phone}
              defaultCode="IN"
              layout="first"
              onChangeText={setPhone}
              onChangeFormattedText={text => setPhone(text)}
              withShadow
              autoFocus={false}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.phoneTextContainer}
            />

            <Button title="Send OTP" onPress={handleSendOtp} loading={loading} variant="secondary"/>
            {error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink} onPress={() => navigation.navigate('Signup')}>Sign up</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { paddingHorizontal: 22, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 12 },
  roleContainer: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roleButton: { flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: '#F9FAFB' },
  activeRole: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  roleText: { fontSize: 16, fontWeight: '500', color: '#374151' },
  activeRoleText: { color: '#fff', fontWeight: '600' },
  orText: { textAlign: 'center', marginVertical: 12, fontWeight: '600', color: '#888' },
  phoneContainer: { width: '100%', height: 55, marginBottom: 15 },
  phoneTextContainer: { paddingVertical: 0, backgroundColor: '#F3F4F6', borderRadius: 8 },
  error: { color: 'red', marginTop: 10, textAlign: 'center' },
  signupText: { textAlign: 'center', marginTop: 16, color: '#444' },
  signupLink: { color: '#1D4ED8', fontWeight: '600' },
});

export default LoginScreen;
