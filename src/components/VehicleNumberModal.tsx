import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { LinearGradient } from 'expo-linear-gradient';

interface VehicleNumberModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (vehicleNumber: string) => void;
  onSkip?: () => void;
  contextTitle?: string;
  contextMessage?: string;
  showDemoOption?: boolean;
  onDemo?: () => void;
}

const VehicleNumberModal: React.FC<VehicleNumberModalProps> = ({
  visible,
  onClose,
  onSubmit,
  onSkip,
  contextTitle,
  contextMessage,
  showDemoOption = false,
  onDemo,
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');

  const validateVehicleNumber = (number: string): boolean => {
    // Indian vehicle registration format: XX00XX0000 or XX00XXX0000
    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
    return regex.test(number.toUpperCase());
  };

  const handleSubmit = () => {
    const trimmedNumber = vehicleNumber.trim().toUpperCase();

    if (!trimmedNumber) {
      setError('Please enter your vehicle number');
      return;
    }

    if (!validateVehicleNumber(trimmedNumber)) {
      setError('Invalid format. Example: UP32AB1234');
      return;
    }

    setError('');
    onSubmit(trimmedNumber);
    setVehicleNumber('');
  };

  const handleSkip = () => {
    setVehicleNumber('');
    setError('');
    if (onSkip) {
      onSkip();
    } else {
      onClose();
    }
  };

  const handleDemo = () => {
    setVehicleNumber('');
    setError('');
    if (onDemo) {
      onDemo();
    }
  };

  const handleInputChange = (text: string) => {
    // Remove spaces and convert to uppercase
    const formatted = text.replace(/\s/g, '').toUpperCase();
    setVehicleNumber(formatted);
    if (error) setError('');
  };

  const benefits = [
    { icon: 'search-outline', text: 'Check RC & Challan instantly' },
    { icon: 'cash-outline', text: "Know your car's market value" },
    { icon: 'receipt-outline', text: 'Get insurance & service reminders' },
    { icon: 'flash-outline', text: 'Faster results every time you open the app' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.gray[700]} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Icon/Emoji */}
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDark]}
                  style={styles.iconGradient}
                >
                  <Ionicons name="car-sport" size={32} color="#fff" />
                </LinearGradient>
              </View>

              {/* Title */}
              <Text style={styles.title}>
                {contextTitle || 'Add Your Car to Get Personalized Features'}
              </Text>

              {/* Message */}
              <Text style={styles.message}>
                {contextMessage ||
                  'Enter your car number to unlock full access — check RC details, challans, resale value, insurance reminders, and more — all in one place.'}
              </Text>

              {/* Example */}
              <Text style={styles.example}>Example: UP32AB1234</Text>

              {/* Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="car-outline"
                    size={20}
                    color={colors.gray[500]}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter car number (e.g., UP32AB1234)"
                    placeholderTextColor={colors.gray[400]}
                    value={vehicleNumber}
                    onChangeText={handleInputChange}
                    autoCapitalize="characters"
                    maxLength={15}
                    autoFocus={true}
                  />
                  {vehicleNumber.length > 0 && (
                    <TouchableOpacity
                      onPress={() => setVehicleNumber('')}
                      style={styles.clearButton}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.gray[400]}
                      />
                    </TouchableOpacity>
                  )}
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              {/* Benefits */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Benefits:</Text>
                {benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <View style={styles.benefitIconContainer}>
                      <Ionicons
                        name={benefit.icon as any}
                        size={18}
                        color={colors.primary}
                      />
                    </View>
                    <Text style={styles.benefitText}>{benefit.text}</Text>
                  </View>
                ))}
              </View>

              {/* Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.primaryButtonGradient}
                  >
                    <Text style={styles.primaryButtonText}>Add My Car</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

                {showDemoOption && onDemo ? (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleDemo}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.secondaryButtonText}>Try Demo</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleSkip}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.secondaryButtonText}>Maybe Later</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardView: {
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  message: {
    fontSize: 15,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  example: {
    fontSize: 13,
    color: colors.gray[500],
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.gray[200],
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.gray[900],
    fontWeight: '500',
  },
  clearButton: {
    padding: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 13,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  benefitsContainer: {
    backgroundColor: colors.gray[50],
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLighter + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.gray[300],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
  },
});

export default VehicleNumberModal;
