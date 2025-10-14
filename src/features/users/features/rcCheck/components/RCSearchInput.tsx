// src/features/users/features/rcCheck/components/RCSearchInput.tsx

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../../../styles/colors';

interface RCSearchInputProps {
  onSearch: (regNumber: string) => void;
  loading?: boolean;
  placeholder?: string;
}

const RCSearchInput: React.FC<RCSearchInputProps> = ({
  onSearch,
  loading = false,
  placeholder = 'Enter Registration Number',
}) => {
  const [regNumber, setRegNumber] = useState('');
  const [error, setError] = useState('');

  const formatRegNumber = (text: string) => {
    // Remove spaces and convert to uppercase
    const formatted = text.toUpperCase().replace(/\s/g, '');
    setRegNumber(formatted);
    setError('');
  };

  const validateAndSearch = () => {
    if (!regNumber.trim()) {
      setError('Please enter registration number');
      return;
    }

    // Basic validation for Indian registration format
    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
    if (!regex.test(regNumber)) {
      setError('Invalid registration number format');
      return;
    }

    onSearch(regNumber);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        <TextInput
          style={styles.input}
          value={regNumber}
          onChangeText={formatRegNumber}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          autoCapitalize="characters"
          maxLength={13}
          editable={!loading}
        />
        <TouchableOpacity
          style={[styles.searchButton, loading && styles.searchButtonDisabled]}
          onPress={validateAndSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <Text style={styles.searchButtonText}>Check RC</Text>
          )}
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Text style={styles.helperText}>
        Example: DL3CAF4097, MH02DE1234
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.gray[200],
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputError: {
    borderColor: colors.red[500],
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[700],
    letterSpacing: 1,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 110,
  },
  searchButtonDisabled: {
    backgroundColor: colors.gray[400],
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: colors.red[500],
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  helperText: {
    color: colors.gray[500],
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default RCSearchInput;